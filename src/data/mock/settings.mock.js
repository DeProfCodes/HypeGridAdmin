// Mock site settings for demo/mock mode. Mutable at module scope so demo-mode
// saves persist for the session. Keys match the backend SiteSetting keys so a
// page binds identically in mock and live mode.
export const settingsMock = {
  company: {
    company_name: 'HypeGrid',
    email: 'hello@hypegrid.co.za',
    phone: '+27 60 555 0123',
    website: 'https://hypegrid.co.za',
    address: 'Cape Town, South Africa',
  },
  communication: {
    support_email: 'support@hypegrid.co.za',
    noreply_email: 'noreply@hypegrid.co.za',
    campaigns_email: 'campaigns@hypegrid.co.za',
    creators_email: 'creators@hypegrid.co.za',
    notification_email: 'leads@hypegrid.co.za',
  },
  finance: {
    invoice_prefix: 'HG-INV',
    quote_prefix: 'HG-Q',
    tax_rate: '15',
    currency: 'ZAR (R)',
  },
  // No public site/SEO settings UI yet — backend group exists and is ready.
  site: {},
};
