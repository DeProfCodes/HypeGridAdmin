// Mode-aware HypeGrid data service. This is the single service layer the pages
// talk to: they call `hypegrid.entities.X.{list,filter,get,create,update,delete}`
// and `hypegrid.auth.*`, while the mock-vs-live decision lives here (one place)
// driven by STORE_CONFIG. No page wires the API or mock data directly.
import { STORE_CONFIG } from '@/stores/config';
import { adminApi } from '@/api/adminApi';
import { authApi } from '@/api/authApi';
import { httpClient } from '@/api/http/httpClient';
import { unwrapResult } from '@/api/http/unwrapResult';
import { tokenStorage } from '@/api/http/tokenStorage';
import { useAuthStore } from '@/stores/authStore';
import { mockEntityStore } from '@/data/mock/mockEntityStore';
import { mockDemoUser, mockAnalytics } from '@/data/mock/adminData';

// Team/Users is read-only via this surface (CRUD lives on the Team page actions).
const usersClient = {
  list: async (sort = '-created_date', limit = 100) =>
    unwrapResult(await httpClient.get('/api/admin/users', { params: { sort, limit } })),
  filter: async () => unwrapResult(await httpClient.get('/api/admin/users')),
  get: async (id) => unwrapResult(await httpClient.get(`/api/admin/users/${id}`)),
  create: async (data) => unwrapResult(await httpClient.post('/api/admin/users', data)),
  update: async (id, data) => unwrapResult(await httpClient.put(`/api/admin/users/${id}`, data)),
  remove: async (id) => unwrapResult(await httpClient.delete(`/api/admin/users/${id}`)),
};

// entity name -> { client (live api), key (mock dataset key) }
const ENTITY = {
  Campaign: { client: adminApi.campaigns, key: 'campaigns' },
  CampaignRequest: { client: adminApi.campaignRequests, key: 'campaignRequests' },
  Client: { client: adminApi.clients, key: 'clients' },
  Creator: { client: adminApi.creators, key: 'creators' },
  Deliverable: { client: adminApi.deliverables, key: 'deliverables' },
  Invoice: { client: adminApi.invoices, key: 'invoices' },
  Note: { client: adminApi.notes, key: 'notes' },
  Payout: { client: adminApi.payouts, key: 'payouts' },
  Quote: { client: adminApi.quotes, key: 'quotes' },
  Task: { client: adminApi.tasks, key: 'tasks' },
  Enquiry: { client: adminApi.enquiries, key: 'enquiries' },
  CreatorApplication: { client: adminApi.creatorApplications, key: 'creatorApplications' },
  HeroPlacement: { client: adminApi.heroPlacements, key: 'heroPlacements' },
  Deal: { client: adminApi.deals, key: 'deals' },
  FeaturedVideo: { client: adminApi.featuredVideos, key: 'featuredVideos' },
  User: { client: usersClient, key: 'users' },
};

const mock = () => STORE_CONFIG.getMockMode();

function makeEntity(name) {
  const { client, key } = ENTITY[name];
  return {
    async list(sort = '-created_date', limit = 100) {
      if (mock()) return mockEntityStore.list(key, sort, limit);
      return client.list(sort, limit);
    },
    async filter(query = {}, sort = '-created_date', limit = 100) {
      if (mock()) return mockEntityStore.filter(key, query, sort, limit);
      return client.filter(query, sort, limit);
    },
    async get(id) {
      if (mock()) return mockEntityStore.get(key, id);
      return client.get(id);
    },
    async create(data) {
      if (mock()) return mockEntityStore.create(key, data);
      return client.create(data);
    },
    async update(id, data) {
      if (mock()) return mockEntityStore.update(key, id, data);
      // The backend PUT is a full replace; pages often send a partial patch
      // (e.g. just { status }). Read-merge-write keeps partial updates safe.
      const current = await client.get(id).catch(() => ({}));
      return client.update(id, { ...current, ...data });
    },
    async delete(id) {
      if (mock()) return mockEntityStore.remove(key, id);
      return client.remove(id);
    },
  };
}

const entities = Object.fromEntries(Object.keys(ENTITY).map((n) => [n, makeEntity(n)]));

function storeRealSession(authData) {
  tokenStorage.setAccessToken(authData.access_token);
  tokenStorage.setRefreshToken(authData.refresh_token);
  tokenStorage.setExpiresAtUtc(authData.expires_at_utc);
  if (authData.user) tokenStorage.setUser(authData.user);
  useAuthStore.getState().setSession(authData);
}

const auth = {
  async me() {
    if (mock()) return mockDemoUser;
    return authApi.me();
  },

  // Real email/password login.
  async loginViaEmailPassword(email, password) {
    const authData = await authApi.login(email, password);
    storeRealSession(authData);
    STORE_CONFIG.setMockMode(false);
    return authData.user;
  },

  // Demo/mock login — no API call; seeds mock data + flips mock mode on.
  async loginDemo() {
    mockEntityStore.reset();
    STORE_CONFIG.setMockMode(true);
    useAuthStore.getState().setDemo(mockDemoUser);
    return mockDemoUser;
  },

  async logout(redirectUrl) {
    try {
      const rt = tokenStorage.getRefreshToken();
      if (rt && !mock()) await authApi.logout(rt);
    } catch { /* best effort */ }
    tokenStorage.clear();
    STORE_CONFIG.setMockMode(false);
    useAuthStore.getState().clear();
    if (redirectUrl !== undefined && typeof window !== 'undefined') {
      if (window.location.pathname !== '/login') window.location.href = '/login';
    }
  },

  redirectToLogin() {
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  },

  setToken(token) {
    tokenStorage.setAccessToken(token);
  },

  async register(payload) {
    return authApi.register(payload);
  },
  async resetPasswordRequest(email) {
    return authApi.forgotPassword(email);
  },
  async resetPassword({ resetToken, newPassword, email }) {
    return authApi.resetPassword({ email, token: resetToken, newPassword });
  },

  // Not enabled in phase 1 — surface a clear message rather than failing silently.
  async verifyOtp() { throw new Error('Email verification is not enabled for the admin portal.'); },
  async resendOtp() { throw new Error('Email verification is not enabled for the admin portal.'); },
  loginWithProvider() { throw new Error('Social login is not available. Please use email and password.'); },
};

// Read-only marketing analytics surface. Mock mode returns demo summaries; live
// mode hits the admin analytics endpoints. Pages call hypegrid.analytics.*.
const analytics = {
  placements: async () => (mock() ? mockAnalytics.placements : adminApi.analytics.placements()),
  deals: async () => (mock() ? mockAnalytics.deals : adminApi.analytics.deals()),
  recentEvents: async (limit = 50) => (mock() ? mockAnalytics.recentEvents : adminApi.analytics.recentEvents(limit)),
};

// The HypeGrid data + auth + analytics service used across the admin portal.
export const hypegrid = { entities, auth, analytics };
