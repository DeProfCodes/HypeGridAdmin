import { httpClient } from '@/api/http/httpClient';
import { unwrapResult } from '@/api/http/unwrapResult';

// Site settings. Each group (company / communication / finance / site) is a flat
// key -> value map. GET returns the map; PUT upserts the supplied keys and
// returns the refreshed map.
export const settingsApi = {
  async getGroup(group) {
    return unwrapResult(await httpClient.get(`/api/admin/settings/${group}`)) || {};
  },
  async updateGroup(group, values) {
    return unwrapResult(await httpClient.put(`/api/admin/settings/${group}`, values)) || values;
  },
};
