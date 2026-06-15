import axios from 'axios';
import { env } from '@/app/config/env';
import { tokenStorage } from './tokenStorage';
import { sessionEvents } from './sessionEvents';

// Authenticated admin HTTP client. Attaches the bearer token, and on a 401
// transparently refreshes the token once (queuing concurrent requests) before
// retrying. If refresh fails the session is cleared and an expiry event is
// emitted so the auth layer can redirect to /login.
export const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

let isRefreshing = false;
let subscribers = [];

function onRefreshed(token) {
  subscribers.forEach((cb) => cb(token));
  subscribers = [];
}

async function refreshAccessToken() {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token available.');

  // Use a bare axios call (not httpClient) to avoid the interceptor recursing.
  const response = await axios.post(
    `${env.apiBaseUrl}/api/auth/refresh`,
    { refresh_token: refreshToken },
    { headers: { 'Content-Type': 'application/json' }, timeout: 30000 }
  );

  const result = response?.data;
  if (!(result?.success === true) || !result?.data) {
    throw new Error(result?.message || 'Failed to refresh token.');
  }

  const auth = result.data;
  tokenStorage.setAccessToken(auth.access_token);
  tokenStorage.setRefreshToken(auth.refresh_token);
  tokenStorage.setExpiresAtUtc(auth.expires_at_utc);
  if (auth.user) tokenStorage.setUser(auth.user);
  return auth.access_token;
}

httpClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (env.enableApiLogging) {
    console.debug('[HypeGrid API →]', (config.method || 'get').toUpperCase(), config.url);
  }
  return config;
});

httpClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error?.config;
    const status = error?.response?.status;

    if (!original || status !== 401 || original._retry) {
      return Promise.reject(error);
    }
    original._retry = true;

    if (!tokenStorage.getRefreshToken()) {
      tokenStorage.clear();
      sessionEvents.emitSessionExpired('no-refresh-token');
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribers.push((token) => {
          if (!token) return reject(error);
          original.headers.Authorization = `Bearer ${token}`;
          resolve(httpClient(original));
        });
      });
    }

    isRefreshing = true;
    try {
      const newToken = await refreshAccessToken();
      onRefreshed(newToken);
      original.headers.Authorization = `Bearer ${newToken}`;
      return httpClient(original);
    } catch (refreshError) {
      tokenStorage.clear();
      onRefreshed(null);
      sessionEvents.emitSessionExpired('refresh-failed');
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
