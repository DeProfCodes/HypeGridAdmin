// Global store configuration — single source of truth for "is the admin in
// mock/demo mode or live API mode". Demo login flips this on; real login flips
// it off. Listeners fire only on an actual change (idempotent), preventing a
// cascade of protected fetches on a no-op flip.
import { env } from '@/app/config/env';

let listeners = [];

export const STORE_CONFIG = {
  useMockData: env.forceMocks === true,

  setMockMode: (nextValue) => {
    const next = Boolean(nextValue);
    if (STORE_CONFIG.useMockData === next) return;
    STORE_CONFIG.useMockData = next;
    if (env.enableApiLogging) console.log(`📊 Mock mode: ${next ? 'ENABLED' : 'DISABLED'}`);
    listeners.forEach((l) => l(next));
  },

  getMockMode: () => STORE_CONFIG.useMockData,

  subscribe: (listener) => {
    listeners.push(listener);
    return () => { listeners = listeners.filter((l) => l !== listener); };
  },
};
