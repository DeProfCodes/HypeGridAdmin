import { create } from 'zustand';
import { STORE_CONFIG } from './config';
import { alertsApi } from '@/api/alertsApi';
import { mockEntityStore } from '@/data/mock/mockEntityStore';

const MOCK_KEY = 'alertSubscribers';

// Computes the same summary shape the backend /api/admin/alerts/summary returns,
// from an in-memory list (used in demo/mock mode).
function computeSummary(rows) {
  const total = rows.length;
  const active = rows.filter((r) => r.is_active && r.status === 'Active').length;
  const optedOut = rows.filter((r) => r.status === 'OptedOut').length;
  const clicked = rows.filter((r) => r.channel_join_clicked).length;
  const byInterest = {};
  const byProvince = {};
  for (const r of rows) {
    for (const i of r.interests || []) byInterest[i] = (byInterest[i] || 0) + 1;
    if (r.province) byProvince[r.province] = (byProvince[r.province] || 0) + 1;
  }
  return {
    total,
    active,
    opted_out: optedOut,
    channel_clicked: clicked,
    click_through_rate: total > 0 ? Math.round((clicked / total) * 10000) / 10000 : 0,
    by_interest: byInterest,
    by_province: byProvince,
    recent_subscribers: rows.slice(0, 8),
  };
}

// Alerts / Deals Club subscriber store. Page → store → live API or mock data,
// matching the rest of the admin portal (see usersStore).
export const useAlertsStore = create((set, get) => ({
  subscribers: [],
  subscribersLoading: false,
  subscribersError: null,
  summary: null,
  mutating: false,

  async fetchSubscribers(params = {}) {
    set({ subscribersLoading: true, subscribersError: null });
    try {
      const data = STORE_CONFIG.getMockMode()
        ? await mockEntityStore.list(MOCK_KEY, '-created_date', 500)
        : await alertsApi.list(params);
      set({ subscribers: data || [], subscribersLoading: false });
      return data;
    } catch (e) {
      set({ subscribersError: e?.message || 'Failed to load subscribers.', subscribersLoading: false });
      return null;
    }
  },

  async fetchSummary() {
    try {
      if (STORE_CONFIG.getMockMode()) {
        const rows = await mockEntityStore.list(MOCK_KEY, '-created_date', 500);
        set({ summary: computeSummary(rows || []) });
        return;
      }
      set({ summary: await alertsApi.summary() });
    } catch (e) {
      // Summary is non-critical; leave previous value and surface nothing fatal.
      console.error('[alertsStore] summary failed:', e);
    }
  },

  async setStatus(id, status) {
    set({ mutating: true });
    try {
      if (STORE_CONFIG.getMockMode()) {
        const optedOut = status === 'OptedOut' || status === 'Archived';
        await mockEntityStore.update(MOCK_KEY, id, {
          status,
          is_active: !optedOut,
          unsubscribed_at: status === 'OptedOut' ? new Date().toISOString() : (status === 'Active' ? null : undefined),
        });
      } else {
        await alertsApi.setStatus(id, status);
      }
      await get().fetchSubscribers();
      await get().fetchSummary();
      return true;
    } catch (e) {
      set({ subscribersError: e?.message || 'Failed to update status.' });
      return false;
    } finally {
      set({ mutating: false });
    }
  },

  async removeSubscriber(id) {
    set({ mutating: true });
    try {
      if (STORE_CONFIG.getMockMode()) await mockEntityStore.remove(MOCK_KEY, id);
      else await alertsApi.remove(id);
      await get().fetchSubscribers();
      await get().fetchSummary();
      return true;
    } catch (e) {
      set({ subscribersError: e?.message || 'Failed to delete subscriber.' });
      return false;
    } finally {
      set({ mutating: false });
    }
  },
}));
