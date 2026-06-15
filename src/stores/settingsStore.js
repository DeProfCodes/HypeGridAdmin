import { create } from 'zustand';
import { STORE_CONFIG } from './config';
import { settingsApi } from '@/api/settingsApi';
import { settingsMock } from '@/data/mock/settings.mock';

// Settings store. Owns the mock-vs-live decision and the per-group load/save
// state so the page JSX stays clean. Field<->key mapping lives in the page's
// field config (no transformation needed — backend returns a flat key map).
export const useSettingsStore = create((set, get) => ({
  groups: { company: {}, communication: {}, finance: {}, site: {} },
  loading: {},
  saving: {},
  error: {},
  savedAt: {},

  async fetchGroup(group) {
    set((s) => ({ loading: { ...s.loading, [group]: true }, error: { ...s.error, [group]: null } }));
    try {
      const data = STORE_CONFIG.getMockMode()
        ? { ...(settingsMock[group] || {}) }
        : await settingsApi.getGroup(group);
      set((s) => ({ groups: { ...s.groups, [group]: data || {} }, loading: { ...s.loading, [group]: false } }));
      return data;
    } catch (e) {
      set((s) => ({ error: { ...s.error, [group]: e?.message || 'Failed to load settings.' }, loading: { ...s.loading, [group]: false } }));
      return null;
    }
  },

  async saveGroup(group, values) {
    set((s) => ({ saving: { ...s.saving, [group]: true }, error: { ...s.error, [group]: null } }));
    try {
      let saved;
      if (STORE_CONFIG.getMockMode()) {
        settingsMock[group] = { ...(settingsMock[group] || {}), ...values };
        saved = { ...settingsMock[group] };
      } else {
        saved = await settingsApi.updateGroup(group, values);
      }
      set((s) => ({
        groups: { ...s.groups, [group]: saved || values },
        saving: { ...s.saving, [group]: false },
        savedAt: { ...s.savedAt, [group]: Date.now() },
      }));
      return true;
    } catch (e) {
      // Do NOT clear the page's form state on failure — the page keeps the
      // user's edits; we only surface the error here.
      set((s) => ({ error: { ...s.error, [group]: e?.message || 'Failed to save settings.' }, saving: { ...s.saving, [group]: false } }));
      return false;
    }
  },
}));
