import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { hypegrid } from '@/api/hypegridClient';
import { useAuthStore } from '@/stores/authStore';
import { tokenStorage } from '@/api/http/tokenStorage';
import { STORE_CONFIG } from '@/stores/config';
import { sessionEvents } from '@/api/http/sessionEvents';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => useAuthStore.getState().user);
  const [isAuthenticated, setIsAuthenticated] = useState(() => useAuthStore.getState().isAuthenticated);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [authError, setAuthError] = useState(null);

  const applyUser = useCallback((u) => {
    setUser(u);
    setIsAuthenticated(Boolean(u));
  }, []);

  // Resolves the current session: returns the mock user in demo mode, or calls
  // /api/auth/me with the stored token in live mode. Drives ProtectedRoute.
  const checkUserAuth = useCallback(async () => {
    setIsLoadingAuth(true);
    setAuthError(null);

    const hasToken = Boolean(tokenStorage.getAccessToken());
    const isDemo = STORE_CONFIG.getMockMode() && useAuthStore.getState().isDemo;

    if (!hasToken && !isDemo) {
      applyUser(null);
      setAuthError({ type: 'auth_required', message: 'Authentication required' });
      setIsLoadingAuth(false);
      setAuthChecked(true);
      return;
    }

    try {
      const currentUser = await hypegrid.auth.me();
      applyUser(currentUser);
      setAuthError(null);
    } catch (error) {
      applyUser(null);
      setAuthError({ type: 'auth_required', message: error?.message || 'Authentication required' });
    } finally {
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  }, [applyUser]);

  const login = useCallback(async (email, password) => {
    const loggedIn = await hypegrid.auth.loginViaEmailPassword(email, password);
    applyUser(loggedIn);
    setAuthError(null);
    setAuthChecked(true);
    return loggedIn;
  }, [applyUser]);

  const loginDemo = useCallback(async () => {
    const demo = await hypegrid.auth.loginDemo();
    applyUser(demo);
    setAuthError(null);
    setAuthChecked(true);
    return demo;
  }, [applyUser]);

  const logout = useCallback((shouldRedirect = true) => {
    hypegrid.auth.logout(shouldRedirect ? window.location.href : undefined);
    applyUser(null);
    setAuthChecked(true);
  }, [applyUser]);

  const navigateToLogin = useCallback(() => {
    hypegrid.auth.redirectToLogin();
  }, []);

  // The HTTP layer emits this when a refresh fails / no token is present on a
  // 401 — reflect it in the auth state so ProtectedRoute redirects to login.
  useEffect(() => {
    const off = sessionEvents.onSessionExpired(() => {
      applyUser(null);
      setAuthError({ type: 'auth_required', message: 'Your session has expired.' });
    });
    return off;
  }, [applyUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings: false, // retained for API compatibility (no remote app-settings)
        authError,
        appPublicSettings: null,
        authChecked,
        login,
        loginDemo,
        logout,
        navigateToLogin,
        checkUserAuth,
        checkAppState: checkUserAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
