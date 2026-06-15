import { create } from 'zustand';
import { STORE_CONFIG } from './config';
import { usersApi } from '@/api/usersApi';
import { mockEntityStore } from '@/data/mock/mockEntityStore';

// Team / users store. Owns the mock-vs-live decision for listing + managing
// internal users. Live mutations are SuperAdmin-only (backend-enforced); the
// page also gates the controls on the current user's role.
export const useUsersStore = create((set, get) => ({
  users: [],
  usersLoading: false,
  usersError: null,
  mutating: false,

  async fetchUsers() {
    set({ usersLoading: true, usersError: null });
    try {
      const data = STORE_CONFIG.getMockMode()
        ? await mockEntityStore.list('users', '-created_date', 200)
        : await usersApi.list();
      set({ users: data || [], usersLoading: false });
      return data;
    } catch (e) {
      set({ usersError: e?.message || 'Failed to load users.', usersLoading: false });
      return null;
    }
  },

  async createUser(payload) {
    set({ mutating: true });
    try {
      if (STORE_CONFIG.getMockMode()) {
        await mockEntityStore.create('users', {
          email: payload.email,
          full_name: `${payload.firstName} ${payload.lastName}`.trim(),
          first_name: payload.firstName,
          last_name: payload.lastName,
          role: payload.role,
          roles: [payload.role],
          is_active: true,
        });
      } else {
        await usersApi.create(payload);
      }
      await get().fetchUsers();
      return true;
    } catch (e) {
      set({ usersError: e?.message || 'Failed to create user.' });
      return false;
    } finally {
      set({ mutating: false });
    }
  },

  async changeRole(id, role) {
    set({ mutating: true });
    try {
      if (STORE_CONFIG.getMockMode()) await mockEntityStore.update('users', id, { role, roles: [role] });
      else await usersApi.setRole(id, role);
      await get().fetchUsers();
      return true;
    } catch (e) {
      set({ usersError: e?.message || 'Failed to change role.' });
      return false;
    } finally {
      set({ mutating: false });
    }
  },

  async changeStatus(id, active) {
    set({ mutating: true });
    try {
      if (STORE_CONFIG.getMockMode()) await mockEntityStore.update('users', id, { is_active: active });
      else await usersApi.setStatus(id, active);
      await get().fetchUsers();
      return true;
    } catch (e) {
      set({ usersError: e?.message || 'Failed to change status.' });
      return false;
    } finally {
      set({ mutating: false });
    }
  },

  async removeUser(id) {
    set({ mutating: true });
    try {
      if (STORE_CONFIG.getMockMode()) await mockEntityStore.remove('users', id);
      else await usersApi.remove(id);
      await get().fetchUsers();
      return true;
    } catch (e) {
      set({ usersError: e?.message || 'Failed to delete user.' });
      return false;
    } finally {
      set({ mutating: false });
    }
  },
}));
