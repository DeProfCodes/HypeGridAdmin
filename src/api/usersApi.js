import { httpClient } from '@/api/http/httpClient';
import { unwrapResult } from '@/api/http/unwrapResult';

// Team / internal users. SuperAdmin-only mutations are enforced by the backend
// policy; the UI also gates the controls on the current user's role.
const BASE = '/api/admin/users';

export const usersApi = {
  async list(sort = '-created_date', limit = 200) {
    return unwrapResult(await httpClient.get(BASE, { params: { sort, limit } }));
  },
  async get(id) {
    return unwrapResult(await httpClient.get(`${BASE}/${id}`));
  },
  async create({ email, password, firstName, lastName, role }) {
    return unwrapResult(await httpClient.post(BASE, {
      email, password, first_name: firstName, last_name: lastName, role,
    }));
  },
  async update(id, { firstName, lastName, email }) {
    return unwrapResult(await httpClient.put(`${BASE}/${id}`, {
      first_name: firstName, last_name: lastName, email,
    }));
  },
  async setRole(id, role) {
    return unwrapResult(await httpClient.patch(`${BASE}/${id}/role`, { role }));
  },
  async setStatus(id, active) {
    return unwrapResult(await httpClient.patch(`${BASE}/${id}/status`, { status: active ? 'Active' : 'Inactive' }));
  },
  async remove(id) {
    return unwrapResult(await httpClient.delete(`${BASE}/${id}`));
  },
};
