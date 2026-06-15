import { createCrudApi } from './http/createCrudApi';
import { httpClient } from './http/httpClient';
import { unwrapResult } from './http/unwrapResult';

// HypeGrid Alerts / Deals Club subscribers (admin). Read + light management;
// the backend exposes list (with filters), get, status patch, delete, summary.
const base = '/api/admin/alerts/subscribers';
const crud = createCrudApi(base);

export const alertsApi = {
  list: (params = {}) => crud.list('-created_date', params.limit ?? 200, params),
  get: (id) => crud.get(id),
  setStatus: (id, status) => crud.patchAction(id, 'status', { status }),
  remove: (id) => crud.remove(id),
  summary: async () => unwrapResult(await httpClient.get('/api/admin/alerts/summary')),
};
