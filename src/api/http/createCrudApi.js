import { httpClient } from './httpClient';
import { unwrapResult } from './unwrapResult';

// Factory for a standard admin CRUD client over /api/admin/<resource>.
// Matches the entity surface the pages already use
// (list/filter/get/create/update/delete) plus helpers for custom actions
// (status patches, conversions) and sub-resources.
export function createCrudApi(basePath) {
  return {
    basePath,

    async list(sort = '-created_date', limit = 100, params = {}) {
      return unwrapResult(await httpClient.get(basePath, { params: { sort, limit, ...params } }));
    },

    async filter(query = {}, sort = '-created_date', limit = 100) {
      return unwrapResult(await httpClient.get(basePath, { params: { sort, limit, ...query } }));
    },

    async get(id) {
      return unwrapResult(await httpClient.get(`${basePath}/${id}`));
    },

    async create(data) {
      return unwrapResult(await httpClient.post(basePath, data));
    },

    async update(id, data) {
      return unwrapResult(await httpClient.put(`${basePath}/${id}`, data));
    },

    async remove(id) {
      return unwrapResult(await httpClient.delete(`${basePath}/${id}`));
    },

    // Custom-action helpers used by status/convert/approve endpoints.
    async patchAction(id, action, body = {}) {
      return unwrapResult(await httpClient.patch(`${basePath}/${id}/${action}`, body));
    },
    async postAction(id, action, body = {}) {
      return unwrapResult(await httpClient.post(`${basePath}/${id}/${action}`, body));
    },
    async sub(id, name, params = {}) {
      return unwrapResult(await httpClient.get(`${basePath}/${id}/${name}`, { params }));
    },
  };
}
