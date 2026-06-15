import { httpClient } from '@/api/http/httpClient';
import { unwrapResult } from '@/api/http/unwrapResult';

// Auth endpoints. Login/refresh/logout/me + password reset. The backend uses
// snake_case, so the returned auth object has access_token / refresh_token /
// expires_at_utc / user.
export const authApi = {
  async login(email, password) {
    return unwrapResult(await httpClient.post('/api/auth/login', { email, password }));
  },
  async me() {
    return unwrapResult(await httpClient.get('/api/auth/me'));
  },
  async refresh(refreshToken) {
    return unwrapResult(await httpClient.post('/api/auth/refresh', { refresh_token: refreshToken }));
  },
  async logout(refreshToken) {
    return unwrapResult(await httpClient.post('/api/auth/logout', { refresh_token: refreshToken }));
  },
  async register({ email, password, firstName, lastName }) {
    return unwrapResult(await httpClient.post('/api/auth/register', {
      email, password, first_name: firstName, last_name: lastName,
    }));
  },
  async forgotPassword(email) {
    return unwrapResult(await httpClient.post('/api/auth/forgot-password', { email }));
  },
  async resetPassword({ email, token, newPassword }) {
    return unwrapResult(await httpClient.post('/api/auth/reset-password', {
      email, token, new_password: newPassword,
    }));
  },
};
