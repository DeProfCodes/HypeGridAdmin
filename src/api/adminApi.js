import { createCrudApi } from './http/createCrudApi';
import { httpClient } from './http/httpClient';
import { unwrapResult } from './http/unwrapResult';

// Maps each entity name to its backend resource path. Used by the
// HypeGrid data service and by stores that call the API directly.
export const ADMIN_PATHS = {
  Campaign: '/api/admin/campaigns',
  CampaignRequest: '/api/admin/campaign-requests',
  Client: '/api/admin/clients',
  Creator: '/api/admin/creators',
  Deliverable: '/api/admin/deliverables',
  Invoice: '/api/admin/invoices',
  Note: '/api/admin/notes',
  Payout: '/api/admin/payouts',
  Quote: '/api/admin/quotes',
  Task: '/api/admin/tasks',
  Enquiry: '/api/admin/enquiries',
  CreatorApplication: '/api/admin/creator-applications',
  HeroPlacement: '/api/admin/hero-placements',
  Deal: '/api/admin/deals',
  FeaturedVideo: '/api/admin/featured-videos',
};

// Per-resource CRUD clients + the custom-action endpoints documented in
// HypeGrid/docs/FRONTEND_INTEGRATION.md. Pages may use these directly via the
// stores; the HypeGrid data service also delegates here in live mode.
export const adminApi = {
  campaigns: {
    ...createCrudApi(ADMIN_PATHS.Campaign),
    setStatus: (id, status) => createCrudApi(ADMIN_PATHS.Campaign).patchAction(id, 'status', { status }),
    setProgress: (id, progress) => createCrudApi(ADMIN_PATHS.Campaign).patchAction(id, 'progress', { progress }),
    tasks: (id) => createCrudApi(ADMIN_PATHS.Campaign).sub(id, 'tasks'),
    deliverables: (id) => createCrudApi(ADMIN_PATHS.Campaign).sub(id, 'deliverables'),
    notes: (id) => createCrudApi(ADMIN_PATHS.Campaign).sub(id, 'notes'),
    invoices: (id) => createCrudApi(ADMIN_PATHS.Campaign).sub(id, 'invoices'),
  },
  campaignRequests: {
    ...createCrudApi(ADMIN_PATHS.CampaignRequest),
    setStatus: (id, status) => createCrudApi(ADMIN_PATHS.CampaignRequest).patchAction(id, 'status', { status }),
    assign: (id, assignedToUserId) => createCrudApi(ADMIN_PATHS.CampaignRequest).patchAction(id, 'assign', { assigned_to_user_id: assignedToUserId }),
    convertToClient: (id) => createCrudApi(ADMIN_PATHS.CampaignRequest).postAction(id, 'convert-to-client'),
    convertToCampaign: (id) => createCrudApi(ADMIN_PATHS.CampaignRequest).postAction(id, 'convert-to-campaign'),
  },
  clients: {
    ...createCrudApi(ADMIN_PATHS.Client),
    campaigns: (id) => createCrudApi(ADMIN_PATHS.Client).sub(id, 'campaigns'),
    quotes: (id) => createCrudApi(ADMIN_PATHS.Client).sub(id, 'quotes'),
    invoices: (id) => createCrudApi(ADMIN_PATHS.Client).sub(id, 'invoices'),
  },
  creators: {
    ...createCrudApi(ADMIN_PATHS.Creator),
    setStatus: (id, status) => createCrudApi(ADMIN_PATHS.Creator).patchAction(id, 'status', { status }),
    deliverables: (id) => createCrudApi(ADMIN_PATHS.Creator).sub(id, 'deliverables'),
    payouts: (id) => createCrudApi(ADMIN_PATHS.Creator).sub(id, 'payouts'),
  },
  deliverables: {
    ...createCrudApi(ADMIN_PATHS.Deliverable),
    setStatus: (id, status) => createCrudApi(ADMIN_PATHS.Deliverable).patchAction(id, 'status', { status }),
    approve: (id) => createCrudApi(ADMIN_PATHS.Deliverable).postAction(id, 'approve'),
    requestChanges: (id) => createCrudApi(ADMIN_PATHS.Deliverable).postAction(id, 'request-changes'),
    markPosted: (id) => createCrudApi(ADMIN_PATHS.Deliverable).postAction(id, 'mark-posted'),
  },
  creatorApplications: {
    ...createCrudApi(ADMIN_PATHS.CreatorApplication),
    setStatus: (id, status) => createCrudApi(ADMIN_PATHS.CreatorApplication).patchAction(id, 'status', { status }),
    approve: (id) => createCrudApi(ADMIN_PATHS.CreatorApplication).postAction(id, 'approve'),
    reject: (id) => createCrudApi(ADMIN_PATHS.CreatorApplication).postAction(id, 'reject'),
    convertToCreator: (id) => createCrudApi(ADMIN_PATHS.CreatorApplication).postAction(id, 'convert-to-creator'),
  },
  enquiries: createCrudApi(ADMIN_PATHS.Enquiry),
  quotes: {
    ...createCrudApi(ADMIN_PATHS.Quote),
    setStatus: (id, status) => createCrudApi(ADMIN_PATHS.Quote).patchAction(id, 'status', { status }),
    convertToInvoice: (id) => createCrudApi(ADMIN_PATHS.Quote).postAction(id, 'convert-to-invoice'),
  },
  invoices: {
    ...createCrudApi(ADMIN_PATHS.Invoice),
    setStatus: (id, status) => createCrudApi(ADMIN_PATHS.Invoice).patchAction(id, 'status', { status }),
    recordPayment: (id, amount) => createCrudApi(ADMIN_PATHS.Invoice).postAction(id, 'record-payment', { amount }),
  },
  payouts: {
    ...createCrudApi(ADMIN_PATHS.Payout),
    setStatus: (id, status) => createCrudApi(ADMIN_PATHS.Payout).patchAction(id, 'status', { status }),
    markPaid: (id) => createCrudApi(ADMIN_PATHS.Payout).postAction(id, 'mark-paid'),
  },
  notes: createCrudApi(ADMIN_PATHS.Note),
  tasks: createCrudApi(ADMIN_PATHS.Task),

  // ── Marketing ────────────────────────────────────────────────────────────
  heroPlacements: {
    ...createCrudApi(ADMIN_PATHS.HeroPlacement),
    setActive: (id, isActive) => createCrudApi(ADMIN_PATHS.HeroPlacement).patchAction(id, 'status', { is_active: isActive }),
    analytics: (id) => createCrudApi(ADMIN_PATHS.HeroPlacement).sub(id, 'analytics'),
  },
  deals: {
    ...createCrudApi(ADMIN_PATHS.Deal),
    setActive: (id, isActive) => createCrudApi(ADMIN_PATHS.Deal).patchAction(id, 'status', { is_active: isActive }),
    setFeatured: (id, isFeatured) => createCrudApi(ADMIN_PATHS.Deal).patchAction(id, 'featured', { is_featured: isFeatured }),
    analytics: (id) => createCrudApi(ADMIN_PATHS.Deal).sub(id, 'analytics'),
  },
  featuredVideos: {
    ...createCrudApi(ADMIN_PATHS.FeaturedVideo),
    setActive: (id, isActive) => createCrudApi(ADMIN_PATHS.FeaturedVideo).patchAction(id, 'status', { is_active: isActive }),
  },

  // Read-only marketing analytics summaries.
  analytics: {
    placements: async () => unwrapResult(await httpClient.get('/api/admin/analytics/placements')),
    deals: async () => unwrapResult(await httpClient.get('/api/admin/analytics/deals')),
    recentEvents: async (limit = 50) => unwrapResult(await httpClient.get('/api/admin/analytics/recent-events', { params: { limit } })),
  },
};
