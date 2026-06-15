// Central runtime config for the admin app. API base URL is ALWAYS env-driven.
export const env = {
  apiBaseUrl:
    import.meta.env.VITE_HYPEGRID_API_BASE_URL ||
    (typeof window !== 'undefined' && window.location.hostname === 'localhost'
      ? 'http://localhost:5249'
      : ''),

  // When true the app boots straight into mock/demo mode (no login required).
  // Normally demo mode is entered via the "Explore demo" login button instead.
  forceMocks: import.meta.env.VITE_HYPEGRID_USE_MOCKS === 'true',

  enableApiLogging:
    import.meta.env.VITE_ENABLE_API_LOGGING === 'true' || import.meta.env.DEV,
};
