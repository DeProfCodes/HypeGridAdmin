import { buildMockData } from './adminData';

// In-memory, session-local entity store for demo/mock mode. Mirrors the
// entity CRUD surface so the HypeGrid data service can serve the same calls
// offline. Mutations (create/update/delete) persist for the session so the
// demo feels real, and reset() restores the seed on each demo login.
let store = null;

function db() {
  if (!store) store = buildMockData();
  return store;
}

function nowIso() {
  return new Date().toISOString();
}

function genId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function applySort(rows, sort) {
  if (!sort) return rows;
  const desc = sort.startsWith('-');
  const field = sort.replace(/^[-+]/, '');
  return [...rows].sort((a, b) => {
    const av = a[field];
    const bv = b[field];
    if (av === bv) return 0;
    const cmp = av > bv ? 1 : -1;
    return desc ? -cmp : cmp;
  });
}

function matches(row, query) {
  return Object.entries(query || {}).every(([k, v]) => row[k] === v);
}

export const mockEntityStore = {
  reset() {
    store = buildMockData();
  },

  list(key, sort = '-created_date', limit = 100) {
    const rows = applySort(db()[key] || [], sort);
    return Promise.resolve(rows.slice(0, limit ?? rows.length));
  },

  filter(key, query = {}, sort = '-created_date', limit = 100) {
    const rows = applySort((db()[key] || []).filter((r) => matches(r, query)), sort);
    return Promise.resolve(rows.slice(0, limit ?? rows.length));
  },

  get(key, id) {
    return Promise.resolve((db()[key] || []).find((r) => r.id === id) || null);
  },

  create(key, data) {
    const prefix = key.slice(0, 3);
    const row = { id: genId(prefix), created_date: nowIso(), updated_date: null, ...data };
    db()[key] = [row, ...(db()[key] || [])];
    return Promise.resolve(row);
  },

  update(key, id, data) {
    const rows = db()[key] || [];
    const idx = rows.findIndex((r) => r.id === id);
    if (idx === -1) return Promise.resolve(null);
    rows[idx] = { ...rows[idx], ...data, id, updated_date: nowIso() };
    return Promise.resolve(rows[idx]);
  },

  remove(key, id) {
    db()[key] = (db()[key] || []).filter((r) => r.id !== id);
    return Promise.resolve(true);
  },
};
