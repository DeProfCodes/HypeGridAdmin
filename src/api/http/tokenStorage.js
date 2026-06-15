// Token + session storage for the admin app. Mirrors the ZansiHustlePortal
// pattern. Persists to localStorage so a refresh keeps the session.
const ACCESS_TOKEN_KEY = 'hg_access_token';
const REFRESH_TOKEN_KEY = 'hg_refresh_token';
const EXPIRES_AT_KEY = 'hg_access_token_expires_at';
const USER_KEY = 'hg_current_user';

function get(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function set(key, value) {
  try { if (value != null) localStorage.setItem(key, value); } catch { /* ignore */ }
}

export const tokenStorage = {
  getAccessToken: () => get(ACCESS_TOKEN_KEY),
  setAccessToken: (t) => set(ACCESS_TOKEN_KEY, t),

  getRefreshToken: () => get(REFRESH_TOKEN_KEY),
  setRefreshToken: (t) => set(REFRESH_TOKEN_KEY, t),

  getExpiresAtUtc: () => get(EXPIRES_AT_KEY),
  setExpiresAtUtc: (v) => set(EXPIRES_AT_KEY, v),

  getUser() {
    const raw = get(USER_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  },
  setUser: (u) => { if (u) set(USER_KEY, JSON.stringify(u)); },

  clear() {
    [ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, EXPIRES_AT_KEY, USER_KEY].forEach((k) => {
      try { localStorage.removeItem(k); } catch { /* ignore */ }
    });
  },
};
