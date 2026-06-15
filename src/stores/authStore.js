import { create } from 'zustand';
import { tokenStorage } from '@/api/http/tokenStorage';

// Canonical client-side auth session. Hydrates from persisted storage so a
// page refresh keeps the user logged in. AuthContext provides this to the React
// tree; the HypeGrid data service writes to it on login/demo/logout.
function hydrate() {
  const user = tokenStorage.getUser();
  const token = tokenStorage.getAccessToken();
  return {
    user: user || null,
    roles: Array.isArray(user?.roles) ? user.roles : [],
    isAuthenticated: Boolean(token && user),
    isDemo: false,
  };
}

export const useAuthStore = create((set) => ({
  ...hydrate(),

  // From a real login response ({ user, access_token, ... }).
  setSession(auth) {
    const user = auth?.user || null;
    set({
      user,
      roles: Array.isArray(user?.roles) ? user.roles : [],
      isAuthenticated: Boolean(user),
      isDemo: false,
    });
  },

  // From a demo login (mock mode).
  setDemo(user) {
    set({
      user: user || null,
      roles: Array.isArray(user?.roles) ? user.roles : [],
      isAuthenticated: Boolean(user),
      isDemo: true,
    });
  },

  clear() {
    set({ user: null, roles: [], isAuthenticated: false, isDemo: false });
  },
}));
