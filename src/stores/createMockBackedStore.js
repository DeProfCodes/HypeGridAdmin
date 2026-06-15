import { create } from 'zustand';
import { STORE_CONFIG } from './config';

/**
 * Factory for "mock-backed" Zustand stores. Pages call store hooks only and
 * never import mock data directly. Each slice declares how to load in BOTH mock
 * and live mode; the store owns the decision via STORE_CONFIG.
 *
 * Per slice "items": state.items, state.itemsLoading, state.itemsError,
 * state.fetchItems(). When api === null the slice surfaces an
 * "API not implemented" error in live mode (marks a backend gap clearly).
 */
export function createMockBackedStore({ slices }) {
  return create((set) => {
    const initialState = {};
    const actions = {};

    for (const [name, slice] of Object.entries(slices)) {
      const loadingKey = `${name}Loading`;
      const errorKey = `${name}Error`;
      const fetcherName = `fetch${name.charAt(0).toUpperCase()}${name.slice(1)}`;

      initialState[name] = slice.initial !== undefined ? slice.initial : null;
      initialState[loadingKey] = false;
      initialState[errorKey] = null;

      actions[fetcherName] = async (...args) => {
        set({ [loadingKey]: true, [errorKey]: null });
        try {
          const useMock = STORE_CONFIG.getMockMode();
          if (useMock) {
            if (typeof slice.mock !== 'function') throw new Error(`Mock provider for "${name}" is not a function.`);
            const data = await slice.mock(...args);
            set({ [name]: data, [loadingKey]: false });
            return data;
          }
          if (typeof slice.api !== 'function') {
            set({ [errorKey]: `API not implemented for "${name}".`, [loadingKey]: false });
            return null;
          }
          const data = await slice.api(...args);
          set({ [name]: data, [loadingKey]: false });
          return data;
        } catch (error) {
          console.error(`[Store] Failed to fetch "${name}":`, error);
          set({ [errorKey]: error?.message || 'Fetch failed', [loadingKey]: false });
          return null;
        }
      };
    }

    return { ...initialState, ...actions };
  });
}
