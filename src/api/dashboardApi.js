import { httpClient } from '@/api/http/httpClient';
import { unwrapResult } from '@/api/http/unwrapResult';

// Server-computed dashboard widgets. The current Dashboard page also computes
// stats client-side from entity lists; these endpoints are available for pages
// that prefer the server-side rollups.
const get = async (path, params) => unwrapResult(await httpClient.get(path, { params }));

export const dashboardApi = {
  summary: () => get('/api/admin/dashboard/summary'),
  recentEnquiries: (take = 5) => get('/api/admin/dashboard/recent-enquiries', { take }),
  recentCampaignRequests: (take = 5) => get('/api/admin/dashboard/recent-campaign-requests', { take }),
  recentCreatorApplications: (take = 5) => get('/api/admin/dashboard/recent-creator-applications', { take }),
  activeCampaigns: (take = 5) => get('/api/admin/dashboard/active-campaigns', { take }),
  pendingDeliverables: (take = 5) => get('/api/admin/dashboard/pending-deliverables', { take }),
  campaignsByStatus: () => get('/api/admin/dashboard/campaigns-by-status'),
  campaignsByType: () => get('/api/admin/dashboard/campaigns-by-type'),
  leadsByType: () => get('/api/admin/dashboard/leads-by-type'),
  monthlyLeads: (months = 6) => get('/api/admin/dashboard/monthly-leads', { months }),
};
