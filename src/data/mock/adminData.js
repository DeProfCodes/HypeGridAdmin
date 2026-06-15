// Mock dataset for the admin demo/mock mode. Field names are snake_case to
// match the live backend exactly, so every page renders identically whether
// data comes from here (demo login) or the API (real login).
//
// buildMockData() returns FRESH deep copies each call so in-session demo
// mutations (create/update/delete via the HypeGrid data service) don't leak across
// reloads. Keyed by the same names the data service uses.

const demoUser = {
  id: 'usr-demo',
  email: 'demo@hypegrid.co.za',
  full_name: 'Demo Admin',
  first_name: 'Demo',
  last_name: 'Admin',
  email_confirmed: true,
  account_status: 'Active',
  role: 'SuperAdmin',
  roles: ['SuperAdmin'],
  is_active: true,
  created_date: '2026-01-05T08:00:00Z',
};

const data = {
  clients: [
    { id: 'cli-1', brand_name: 'Soweto Eats', contact_person: 'Naledi Khumalo', email: 'naledi@sowetoeats.co.za', phone: '+27 82 111 2233', client_type: 'Business', industry: 'Food & Beverage', status: 'Active', website: 'https://sowetoeats.co.za', location: 'Johannesburg, GP', total_spend: 48500, active_campaigns: 2, notes: '', created_date: '2026-02-10T09:00:00Z' },
    { id: 'cli-2', brand_name: 'DJ Vibe', contact_person: 'Sipho Dlamini', email: 'bookings@djvibe.co.za', phone: '+27 83 222 3344', client_type: 'Artist / Musician', industry: 'Music', status: 'VIP', website: '', location: 'Pretoria, GP', total_spend: 92000, active_campaigns: 1, notes: 'Repeat release client.', created_date: '2026-01-22T10:30:00Z' },
    { id: 'cli-3', brand_name: 'FitHub App', contact_person: 'Tara Naidoo', email: 'tara@fithub.app', phone: '+27 84 333 4455', client_type: 'Startup / App', industry: 'Health Tech', status: 'Active', website: 'https://fithub.app', location: 'Durban, KZN', total_spend: 33000, active_campaigns: 1, notes: '', created_date: '2026-03-01T14:00:00Z' },
    { id: 'cli-4', brand_name: 'Cape Town Jazz Fest', contact_person: 'Marcus Abrahams', email: 'marcus@ctjazz.co.za', phone: '+27 21 444 5566', client_type: 'Event Organizer', industry: 'Events', status: 'Active', website: 'https://ctjazz.co.za', location: 'Cape Town, WC', total_spend: 67000, active_campaigns: 1, notes: '', created_date: '2026-02-18T11:15:00Z' },
    { id: 'cli-5', brand_name: 'Glow Skincare', contact_person: 'Ayesha Patel', email: 'hello@glowskincare.co.za', phone: '+27 71 555 6677', client_type: 'Product Brand', industry: 'Beauty', status: 'Lead', website: '', location: 'Sandton, GP', total_spend: 0, active_campaigns: 0, notes: 'Inbound from website.', created_date: '2026-06-01T08:45:00Z' },
  ],
  creators: [
    { id: 'crt-1', full_name: 'Lerato M', email: 'lerato@creators.co.za', phone: '+27 82 777 1111', handle: 'leratovibes', platform: 'TikTok', niche: 'Lifestyle', followers: 84000, city: 'Johannesburg', province: 'Gauteng', status: 'Active', bio: 'Lifestyle + food creator.', total_earned: 18500, total_paid: 14000, campaigns_count: 5, created_date: '2026-01-15T09:00:00Z' },
    { id: 'crt-2', full_name: 'Thabo K', email: 'thabo@creators.co.za', phone: '+27 83 777 2222', handle: 'thabocomedy', platform: 'Instagram', niche: 'Comedy', followers: 152000, city: 'Pretoria', province: 'Gauteng', status: 'Active', bio: 'Skits & brand collabs.', total_earned: 41000, total_paid: 38000, campaigns_count: 9, created_date: '2026-01-09T09:00:00Z' },
    { id: 'crt-3', full_name: 'Zinhle N', email: 'zinhle@creators.co.za', phone: '+27 84 777 3333', handle: 'zinhlebeauty', platform: 'Instagram', niche: 'Beauty', followers: 67000, city: 'Durban', province: 'KwaZulu-Natal', status: 'Approved', bio: 'Beauty & skincare.', total_earned: 9200, total_paid: 9200, campaigns_count: 3, created_date: '2026-02-20T09:00:00Z' },
    { id: 'crt-4', full_name: 'Kabelo S', email: 'kabelo@creators.co.za', phone: '+27 71 777 4444', handle: 'kabelobeats', platform: 'YouTube', niche: 'Music', followers: 210000, city: 'Johannesburg', province: 'Gauteng', status: 'Active', bio: 'Music reactions.', total_earned: 55000, total_paid: 50000, campaigns_count: 11, created_date: '2025-12-11T09:00:00Z' },
    { id: 'crt-5', full_name: 'Amahle D', email: 'amahle@creators.co.za', phone: '+27 82 777 5555', handle: 'amahlefit', platform: 'TikTok', niche: 'Fitness', followers: 38000, city: 'Cape Town', province: 'Western Cape', status: 'Under Review', bio: 'Fitness & wellness.', total_earned: 0, total_paid: 0, campaigns_count: 0, created_date: '2026-06-05T09:00:00Z' },
    { id: 'crt-6', full_name: 'Junaid F', email: 'junaid@creators.co.za', phone: '+27 83 777 6666', handle: 'junaideats', platform: 'TikTok', niche: 'Food', followers: 49000, city: 'Cape Town', province: 'Western Cape', status: 'Applied', bio: 'Food reviews.', total_earned: 0, total_paid: 0, campaigns_count: 0, created_date: '2026-06-09T09:00:00Z' },
  ],
  campaigns: [
    { id: 'cmp-1', name: 'Soweto Eats Winter Push', client_id: 'cli-1', client_name: 'Soweto Eats', type: 'Business Promotion', status: 'Active', budget: 25000, progress: 65, start_date: '2026-06-01', end_date: '2026-07-15', manager: 'Demo Admin', objective: 'Drive WhatsApp orders', target_audience: 'Food lovers, 18-35', platforms: ['TikTok', 'Instagram', 'WhatsApp'], brief: 'Winter menu promo with creators.', phase: 'Campaign Live', created_date: '2026-05-25T09:00:00Z' },
    { id: 'cmp-2', name: 'DJ Vibe — New Single', client_id: 'cli-2', client_name: 'DJ Vibe', type: 'Song / Music Release', status: 'Content Pending', budget: 40000, progress: 40, start_date: '2026-06-10', end_date: '2026-06-30', manager: 'Demo Admin', objective: 'Streams + TikTok sound', target_audience: 'Music fans', platforms: ['TikTok', 'YouTube'], brief: 'Release-week push.', phase: 'Content Creation', created_date: '2026-06-02T09:00:00Z' },
    { id: 'cmp-3', name: 'FitHub Launch', client_id: 'cli-3', client_name: 'FitHub App', type: 'App / Startup Launch', status: 'In Planning', budget: 33000, progress: 15, start_date: '2026-07-01', end_date: '2026-08-01', manager: 'Demo Admin', objective: 'App installs', target_audience: 'Fitness 20-40', platforms: ['Instagram', 'TikTok'], brief: 'Launch campaign.', phase: 'Strategy / Planning', created_date: '2026-06-08T09:00:00Z' },
    { id: 'cmp-4', name: 'CT Jazz Fest Countdown', client_id: 'cli-4', client_name: 'Cape Town Jazz Fest', type: 'Event Promotion', status: 'Client Review', budget: 67000, progress: 80, start_date: '2026-05-15', end_date: '2026-06-20', manager: 'Demo Admin', objective: 'Ticket sales', target_audience: 'Jazz fans', platforms: ['Instagram', 'Facebook'], brief: 'Event countdown.', phase: 'Reporting', created_date: '2026-05-10T09:00:00Z' },
    { id: 'cmp-5', name: 'Glow Skincare Teaser', client_id: 'cli-5', client_name: 'Glow Skincare', type: 'Product Promotion', status: 'Awaiting Payment', budget: 18000, progress: 0, start_date: '2026-06-20', end_date: '2026-07-10', manager: 'Demo Admin', objective: 'Awareness', target_audience: 'Beauty 18-30', platforms: ['Instagram'], brief: 'Product teaser.', phase: 'Quote Sent', created_date: '2026-06-11T09:00:00Z' },
  ],
  campaignRequests: [
    { id: 'req-1', full_name: 'Ayesha Patel', brand_name: 'Glow Skincare', email: 'hello@glowskincare.co.za', phone: '+27 71 555 6677', campaign_type: 'Product Promotion', target_audience: 'Beauty 18-30', platforms: ['Instagram', 'TikTok'], budget_range: 'Growth', campaign_goal: 'Awareness', message: 'Launching a new serum.', status: 'New', created_date: '2026-06-11T08:45:00Z' },
    { id: 'req-2', full_name: 'Bongani M', brand_name: 'Bongani Motors', email: 'bongani@motors.co.za', phone: '+27 82 100 2003', campaign_type: 'Business Promotion', target_audience: 'Car buyers', platforms: ['Facebook', 'WhatsApp'], budget_range: 'Premium', campaign_goal: 'Leads', message: 'Dealership promo.', status: 'Contacted', created_date: '2026-06-10T13:20:00Z' },
    { id: 'req-3', full_name: 'Lwazi T', brand_name: 'Lwazi (Artist)', email: 'lwazi@music.co.za', phone: '+27 83 200 3004', campaign_type: 'Song / Music Release', target_audience: 'Amapiano fans', platforms: ['TikTok'], budget_range: 'Starter', campaign_goal: 'Streams', message: 'Dropping a single next month.', status: 'Qualified', created_date: '2026-06-09T17:00:00Z' },
    { id: 'req-4', full_name: 'Megan R', brand_name: 'Pop-Up Market CT', email: 'megan@popupct.co.za', phone: '+27 21 300 4005', campaign_type: 'Event Promotion', target_audience: 'CT locals', platforms: ['Instagram'], budget_range: 'Growth', campaign_goal: 'Event Attendance', message: 'Weekend market.', status: 'Quote Needed', created_date: '2026-06-07T11:00:00Z' },
    { id: 'req-5', full_name: 'Sam P', brand_name: 'TechFlow', email: 'sam@techflow.io', phone: '+27 84 400 5006', campaign_type: 'App / Startup Launch', target_audience: 'SMEs', platforms: ['Instagram', 'YouTube'], budget_range: 'Custom', campaign_goal: 'App Installs', message: 'B2B SaaS launch.', status: 'New', created_date: '2026-06-06T09:30:00Z' },
    { id: 'req-6', full_name: 'Nomsa K', brand_name: 'Nomsa Cakes', email: 'nomsa@cakes.co.za', phone: '+27 82 500 6007', campaign_type: 'Business Promotion', target_audience: 'Local', platforms: ['WhatsApp', 'Instagram'], budget_range: 'Starter', campaign_goal: 'Sales', message: 'Home bakery.', status: 'Converted', created_date: '2026-05-28T15:45:00Z' },
  ],
  deliverables: [
    { id: 'del-1', title: 'Winter menu reel', campaign_id: 'cmp-1', campaign_name: 'Soweto Eats Winter Push', client_name: 'Soweto Eats', creator_id: 'crt-1', creator_name: 'Lerato M', type: 'Reel', platform: 'Instagram', status: 'Approved', due_date: '2026-06-12', file_url: '', notes: '', created_date: '2026-06-03T09:00:00Z' },
    { id: 'del-2', title: 'TikTok food review', campaign_id: 'cmp-1', campaign_name: 'Soweto Eats Winter Push', client_name: 'Soweto Eats', creator_id: 'crt-6', creator_name: 'Junaid F', type: 'TikTok Video', platform: 'TikTok', status: 'In Progress', due_date: '2026-06-18', file_url: '', notes: '', created_date: '2026-06-04T09:00:00Z' },
    { id: 'del-3', title: 'Single snippet edit', campaign_id: 'cmp-2', campaign_name: 'DJ Vibe — New Single', client_name: 'DJ Vibe', creator_id: 'crt-4', creator_name: 'Kabelo S', type: 'TikTok Video', platform: 'TikTok', status: 'Uploaded', due_date: '2026-06-15', file_url: '', notes: '', created_date: '2026-06-05T09:00:00Z' },
    { id: 'del-4', title: 'Cover art motion', campaign_id: 'cmp-2', campaign_name: 'DJ Vibe — New Single', client_name: 'DJ Vibe', creator_id: null, creator_name: '', type: 'Motion Graphic', platform: 'Instagram', status: 'Needs Changes', due_date: '2026-06-16', file_url: '', notes: 'Adjust colours.', created_date: '2026-06-06T09:00:00Z' },
    { id: 'del-5', title: 'Launch teaser', campaign_id: 'cmp-3', campaign_name: 'FitHub Launch', client_name: 'FitHub App', creator_id: 'crt-5', creator_name: 'Amahle D', type: 'Reel', platform: 'Instagram', status: 'Not Started', due_date: '2026-06-28', file_url: '', notes: '', created_date: '2026-06-09T09:00:00Z' },
    { id: 'del-6', title: 'Festival flyer', campaign_id: 'cmp-4', campaign_name: 'CT Jazz Fest Countdown', client_name: 'Cape Town Jazz Fest', creator_id: null, creator_name: '', type: 'Flyer', platform: 'Facebook', status: 'Posted', due_date: '2026-06-01', file_url: '', notes: '', created_date: '2026-05-20T09:00:00Z' },
    { id: 'del-7', title: 'Countdown stories', campaign_id: 'cmp-4', campaign_name: 'CT Jazz Fest Countdown', client_name: 'Cape Town Jazz Fest', creator_id: 'crt-2', creator_name: 'Thabo K', type: 'Story', platform: 'Instagram', status: 'Approved', due_date: '2026-06-10', file_url: '', notes: '', created_date: '2026-05-22T09:00:00Z' },
    { id: 'del-8', title: 'Skincare unboxing', campaign_id: 'cmp-5', campaign_name: 'Glow Skincare Teaser', client_name: 'Glow Skincare', creator_id: 'crt-3', creator_name: 'Zinhle N', type: 'Reel', platform: 'Instagram', status: 'Not Started', due_date: '2026-06-25', file_url: '', notes: '', created_date: '2026-06-11T09:00:00Z' },
  ],
  invoices: [
    { id: 'inv-1', invoice_number: 'HG-INV-1001', client_id: 'cli-1', client_name: 'Soweto Eats', campaign_id: 'cmp-1', campaign_name: 'Soweto Eats Winter Push', amount: 25000, paid_amount: 25000, outstanding: 0, status: 'Paid', due_date: '2026-06-05', line_items: [{ description: 'Winter campaign', amount: 25000 }], notes: '', created_date: '2026-05-26T09:00:00Z' },
    { id: 'inv-2', invoice_number: 'HG-INV-1002', client_id: 'cli-2', client_name: 'DJ Vibe', campaign_id: 'cmp-2', campaign_name: 'DJ Vibe — New Single', amount: 40000, paid_amount: 20000, outstanding: 20000, status: 'Partially Paid', due_date: '2026-06-20', line_items: [{ description: 'Release push', amount: 40000 }], notes: '', created_date: '2026-06-02T09:00:00Z' },
    { id: 'inv-3', invoice_number: 'HG-INV-1003', client_id: 'cli-4', client_name: 'Cape Town Jazz Fest', campaign_id: 'cmp-4', campaign_name: 'CT Jazz Fest Countdown', amount: 67000, paid_amount: 67000, outstanding: 0, status: 'Paid', due_date: '2026-05-20', line_items: [{ description: 'Event campaign', amount: 67000 }], notes: '', created_date: '2026-05-11T09:00:00Z' },
    { id: 'inv-4', invoice_number: 'HG-INV-1004', client_id: 'cli-5', client_name: 'Glow Skincare', campaign_id: 'cmp-5', campaign_name: 'Glow Skincare Teaser', amount: 18000, paid_amount: 0, outstanding: 18000, status: 'Sent', due_date: '2026-06-25', line_items: [{ description: 'Teaser campaign', amount: 18000 }], notes: '', created_date: '2026-06-12T09:00:00Z' },
  ],
  payouts: [
    { id: 'pay-1', creator_id: 'crt-1', creator_name: 'Lerato M', campaign_id: 'cmp-1', campaign_name: 'Soweto Eats Winter Push', deliverable: 'Winter menu reel', amount: 3500, status: 'Paid', due_date: '2026-06-14', paid_date: '2026-06-14', notes: '', created_date: '2026-06-12T09:00:00Z' },
    { id: 'pay-2', creator_id: 'crt-4', creator_name: 'Kabelo S', campaign_id: 'cmp-2', campaign_name: 'DJ Vibe — New Single', deliverable: 'Single snippet edit', amount: 5000, status: 'Approved', due_date: '2026-06-22', paid_date: null, notes: '', created_date: '2026-06-13T09:00:00Z' },
    { id: 'pay-3', creator_id: 'crt-2', creator_name: 'Thabo K', campaign_id: 'cmp-4', campaign_name: 'CT Jazz Fest Countdown', deliverable: 'Countdown stories', amount: 4000, status: 'Paid', due_date: '2026-06-11', paid_date: '2026-06-11', notes: '', created_date: '2026-06-10T09:00:00Z' },
    { id: 'pay-4', creator_id: 'crt-3', creator_name: 'Zinhle N', campaign_id: 'cmp-5', campaign_name: 'Glow Skincare Teaser', deliverable: 'Skincare unboxing', amount: 2500, status: 'Pending', due_date: '2026-06-30', paid_date: null, notes: '', created_date: '2026-06-12T09:00:00Z' },
  ],
  quotes: [
    { id: 'qte-1', quote_number: 'HG-Q-2001', client_id: 'cli-5', client_name: 'Glow Skincare', campaign_type: 'Product Promotion', package_name: 'Growth Hype', amount: 18000, status: 'Sent', line_items: [{ description: 'Growth Hype package', amount: 18000 }], notes: '', terms: '50% upfront', created_date: '2026-06-11T10:00:00Z' },
    { id: 'qte-2', quote_number: 'HG-Q-2002', client_id: 'cli-3', client_name: 'FitHub App', campaign_type: 'App / Startup Launch', package_name: 'Premium Launch', amount: 33000, status: 'Accepted', line_items: [{ description: 'Premium Launch package', amount: 33000 }], notes: '', terms: '', created_date: '2026-06-05T10:00:00Z' },
    { id: 'qte-3', quote_number: 'HG-Q-2003', client_id: 'cli-2', client_name: 'DJ Vibe', campaign_type: 'Song / Music Release', package_name: 'Music Release Push', amount: 40000, status: 'Converted to Invoice', line_items: [{ description: 'Music Release Push', amount: 40000 }], notes: '', terms: '', created_date: '2026-06-01T10:00:00Z' },
  ],
  tasks: [
    { id: 'tsk-1', title: 'Brief creators for winter push', campaign_id: 'cmp-1', campaign_name: 'Soweto Eats Winter Push', assigned_to: 'Demo Admin', due_date: '2026-06-14', priority: 'High', status: 'Done', notes: '', created_date: '2026-06-03T09:00:00Z' },
    { id: 'tsk-2', title: 'Approve single snippet', campaign_id: 'cmp-2', campaign_name: 'DJ Vibe — New Single', assigned_to: 'Demo Admin', due_date: '2026-06-16', priority: 'Urgent', status: 'In Progress', notes: '', created_date: '2026-06-06T09:00:00Z' },
    { id: 'tsk-3', title: 'Draft FitHub strategy', campaign_id: 'cmp-3', campaign_name: 'FitHub Launch', assigned_to: 'Demo Admin', due_date: '2026-06-20', priority: 'Medium', status: 'To Do', notes: '', created_date: '2026-06-09T09:00:00Z' },
    { id: 'tsk-4', title: 'Compile jazz fest report', campaign_id: 'cmp-4', campaign_name: 'CT Jazz Fest Countdown', assigned_to: 'Demo Admin', due_date: '2026-06-18', priority: 'Medium', status: 'Review', notes: '', created_date: '2026-06-12T09:00:00Z' },
  ],
  notes: [
    { id: 'not-1', content: 'Client loves the winter reel — wants 2 more.', entity_type: 'Campaign', entity_id: 'cmp-1', entity_name: 'Soweto Eats Winter Push', author: 'Demo Admin', visibility: 'Internal', created_date: '2026-06-13T09:00:00Z' },
    { id: 'not-2', content: 'DJ Vibe is a VIP — prioritise turnaround.', entity_type: 'Client', entity_id: 'cli-2', entity_name: 'DJ Vibe', author: 'Demo Admin', visibility: 'Internal', created_date: '2026-06-10T09:00:00Z' },
    { id: 'not-3', content: 'Follow up Glow Skincare quote by Friday.', entity_type: 'Internal', entity_id: null, entity_name: '', author: 'Demo Admin', visibility: 'Internal', created_date: '2026-06-12T09:00:00Z' },
  ],
  heroPlacements: [
    { id: 'hero-1', title: "What's hot right now on HypeGrid", subtitle: 'Discover featured campaigns, deals, and brands making noise across South Africa.', badge: 'Featured', sponsor_name: null, desktop_image_url: '', mobile_image_url: '', cta_text: 'Explore the grid', cta_url: '/deals', cta_target_type: 'internal', campaign_reference: null, start_date: null, end_date: null, priority: 0, is_active: true, tracking_enabled: true, created_date: '2026-06-01T09:00:00Z' },
    { id: 'hero-2', title: 'Put your campaign on the grid', subtitle: "Promote your business, music, event, or product to an audience that's actually paying attention.", badge: 'Advertise', sponsor_name: null, desktop_image_url: '', mobile_image_url: '', cta_text: 'Start a campaign', cta_url: '/campaigns', cta_target_type: 'internal', campaign_reference: null, start_date: null, end_date: null, priority: 1, is_active: true, tracking_enabled: true, created_date: '2026-06-01T09:00:00Z' },
    { id: 'hero-3', title: 'Latest specials, worth noticing', subtitle: 'Hand-picked deals and discounts from shops and brands around you.', badge: 'Deals', sponsor_name: null, desktop_image_url: '', mobile_image_url: '', cta_text: 'See all specials', cta_url: '/deals', cta_target_type: 'internal', campaign_reference: null, start_date: null, end_date: null, priority: 2, is_active: false, tracking_enabled: true, created_date: '2026-06-01T09:00:00Z' },
  ],
  deals: [
    { id: 'deal-1', title: 'Mid-month airtime & data bundles', slug: 'mid-month-airtime-data-1', brand_name: 'Mobile Networks', category: 'Mobile', short_description: 'Bonus data and airtime specials running across major networks this month.', full_description: '', image_url: '', mobile_image_url: '', original_price: null, deal_price: null, discount_label: 'Bonus data', cta_text: 'View deal', cta_url: '', location: null, province: null, valid_from: null, valid_until: '2026-07-15T00:00:00Z', is_active: true, is_featured: true, is_sponsored: false, priority: 0, source_name: 'Mobile Networks', source_url: null, terms: null, created_date: '2026-06-01T09:00:00Z' },
    { id: 'deal-2', title: 'Weekend grocery savings', slug: 'weekend-grocery-savings-2', brand_name: 'Local Grocers', category: 'Grocery', short_description: 'Stock up specials on everyday essentials at participating stores.', full_description: '', image_url: '', mobile_image_url: '', original_price: null, deal_price: null, discount_label: 'Save up to 30%', cta_text: 'View deal', cta_url: '', location: 'Nationwide', province: null, valid_from: null, valid_until: '2026-07-10T00:00:00Z', is_active: true, is_featured: true, is_sponsored: false, priority: 1, source_name: 'Local Grocers', source_url: null, terms: 'While stocks last.', created_date: '2026-06-02T09:00:00Z' },
    { id: 'deal-3', title: 'Fresh streetwear drop', slug: 'fresh-streetwear-drop-3', brand_name: 'Local Brands', category: 'Fashion', short_description: 'New-season streetwear from South African brands, while stocks last.', full_description: '', image_url: '', mobile_image_url: '', original_price: 899, deal_price: 599, discount_label: 'Save R300', cta_text: 'Shop drop', cta_url: '', location: 'Online', province: null, valid_from: null, valid_until: '2026-07-20T00:00:00Z', is_active: true, is_featured: false, is_sponsored: false, priority: 2, source_name: 'Local Brands', source_url: null, terms: null, created_date: '2026-06-03T09:00:00Z' },
    { id: 'deal-4', title: 'Two-for-one meal specials', slug: 'two-for-one-meals-4', brand_name: 'Local Eateries', category: 'Food', short_description: 'Midweek two-for-one deals at selected restaurants and takeaways.', full_description: '', image_url: '', mobile_image_url: '', original_price: null, deal_price: null, discount_label: '2 for 1', cta_text: 'View deal', cta_url: '', location: 'Selected stores', province: null, valid_from: null, valid_until: '2026-07-05T00:00:00Z', is_active: true, is_featured: false, is_sponsored: false, priority: 3, source_name: 'Local Eateries', source_url: null, terms: 'Midweek only.', created_date: '2026-06-04T09:00:00Z' },
    { id: 'deal-5', title: 'Tech accessory clearance', slug: 'tech-accessory-clearance-5', brand_name: 'Tech Stores', category: 'Tech', short_description: 'Clearance pricing on headphones, chargers, and accessories.', full_description: '', image_url: '', mobile_image_url: '', original_price: 499, deal_price: 299, discount_label: 'Clearance', cta_text: 'View deal', cta_url: '', location: 'Online', province: null, valid_from: null, valid_until: '2026-07-25T00:00:00Z', is_active: true, is_featured: false, is_sponsored: true, priority: 4, source_name: 'Tech Stores', source_url: null, terms: null, created_date: '2026-06-05T09:00:00Z' },
  ],
  featuredVideos: [
    { id: 'fv-1', title: 'HypeGrid in motion', subtitle: 'See how brands, creators, and campaigns come together on the grid.', you_tube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail_url: '', cta_text: 'Start your campaign', cta_url: '/campaigns', is_active: true, start_date: null, end_date: null, sort_order: 0, created_date: '2026-06-01T09:00:00Z' },
  ],
  users: [
    { ...demoUser },
    { id: 'usr-2', email: 'manager@hypegrid.co.za', full_name: 'Thandi Manager', first_name: 'Thandi', last_name: 'Manager', role: 'CampaignManager', roles: ['CampaignManager'], is_active: true, created_date: '2026-02-01T09:00:00Z' },
    { id: 'usr-3', email: 'finance@hypegrid.co.za', full_name: 'Pieter Finance', first_name: 'Pieter', last_name: 'Finance', role: 'Finance', roles: ['Finance'], is_active: true, created_date: '2026-02-03T09:00:00Z' },
  ],
  alertSubscribers: [
    { id: 'alr-1', full_name: 'Lerato Mokoena', email: 'lerato@example.co.za', phone_number: '+27821234567', city: 'Soweto', province: 'Gauteng', interests: ['Grocery', 'Mobile', 'All Deals'], frequency_preference: 'Daily', source_page: 'alerts', status: 'Active', is_active: true, consent_given: true, consent_text_version: 'hypegrid-alerts-v1', consent_snapshot: "I agree that HypeGrid may store the details I've provided and send me relevant deals, specials, campaigns, events, and promotions. I understand I can opt out at any time. See HypeGrid's Privacy Policy.", consent_at: '2026-06-14T10:12:00Z', consent_ip_hash: 'A1B2C3', consent_user_agent: 'Mozilla/5.0 (Android)', channel_join_clicked: true, channel_join_clicked_at: '2026-06-14T10:13:00Z', direct_message_opt_in: false, unsubscribed_at: null, created_date: '2026-06-14T10:12:00Z' },
    { id: 'alr-2', full_name: 'Sipho Dlamini', email: null, phone_number: '+27734567890', city: 'Durban', province: 'KwaZulu-Natal', interests: ['Fashion', 'Tech'], frequency_preference: 'Weekly', source_page: 'deals', status: 'Active', is_active: true, consent_given: true, consent_text_version: 'hypegrid-alerts-v1', consent_snapshot: "I agree that HypeGrid may store the details I've provided and send me relevant deals, specials, campaigns, events, and promotions. I understand I can opt out at any time. See HypeGrid's Privacy Policy.", consent_at: '2026-06-13T16:40:00Z', consent_ip_hash: 'D4E5F6', consent_user_agent: 'Mozilla/5.0 (iPhone)', channel_join_clicked: false, channel_join_clicked_at: null, direct_message_opt_in: false, unsubscribed_at: null, created_date: '2026-06-13T16:40:00Z' },
    { id: 'alr-3', full_name: 'Amahle Nkosi', email: 'amahle@example.co.za', phone_number: '+27829876543', city: 'Cape Town', province: 'Western Cape', interests: ['Beauty', 'Events', 'Travel'], frequency_preference: 'Best deals only', source_page: 'home', status: 'Active', is_active: true, consent_given: true, consent_text_version: 'hypegrid-alerts-v1', consent_snapshot: "I agree that HypeGrid may store the details I've provided and send me relevant deals, specials, campaigns, events, and promotions. I understand I can opt out at any time. See HypeGrid's Privacy Policy.", consent_at: '2026-06-12T08:05:00Z', consent_ip_hash: '778899', consent_user_agent: 'Mozilla/5.0 (Windows)', channel_join_clicked: true, channel_join_clicked_at: '2026-06-12T08:06:30Z', direct_message_opt_in: false, unsubscribed_at: null, created_date: '2026-06-12T08:05:00Z' },
    { id: 'alr-4', full_name: 'Johan van der Merwe', email: 'johan@example.co.za', phone_number: '+27761112233', city: 'Pretoria', province: 'Gauteng', interests: ['Food', 'Home'], frequency_preference: 'Weekends only', source_page: 'alerts', status: 'OptedOut', is_active: false, consent_given: true, consent_text_version: 'hypegrid-alerts-v1', consent_snapshot: "I agree that HypeGrid may store the details I've provided and send me relevant deals, specials, campaigns, events, and promotions. I understand I can opt out at any time. See HypeGrid's Privacy Policy.", consent_at: '2026-06-10T12:00:00Z', consent_ip_hash: 'AA00BB', consent_user_agent: 'Mozilla/5.0 (Macintosh)', channel_join_clicked: false, channel_join_clicked_at: null, direct_message_opt_in: false, unsubscribed_at: '2026-06-14T09:00:00Z', created_date: '2026-06-10T12:00:00Z' },
  ],
};

export const mockDemoUser = demoUser;

// Demo-mode analytics summaries (shape mirrors the admin analytics API).
export const mockAnalytics = {
  placements: {
    total_impressions: 4820,
    total_clicks: 612,
    ctr: 0.127,
    items: [
      { entity_id: 'hero-1', entity_type: 'HeroPlacement', title: "What's hot right now on HypeGrid", is_active: true, impressions: 2100, clicks: 320, ctr: 0.152 },
      { entity_id: 'hero-2', entity_type: 'HeroPlacement', title: 'Put your campaign on the grid', is_active: true, impressions: 1850, clicks: 232, ctr: 0.125 },
      { entity_id: 'hero-3', entity_type: 'HeroPlacement', title: 'Latest specials, worth noticing', is_active: false, impressions: 870, clicks: 60, ctr: 0.069 },
    ],
  },
  deals: {
    total_impressions: 3180,
    total_clicks: 410,
    ctr: 0.129,
    items: [
      { entity_id: 'deal-1', entity_type: 'Deal', title: 'Mid-month airtime & data bundles', is_active: true, impressions: 980, clicks: 168, ctr: 0.171 },
      { entity_id: 'deal-2', entity_type: 'Deal', title: 'Weekend grocery savings', is_active: true, impressions: 860, clicks: 120, ctr: 0.140 },
      { entity_id: 'deal-3', entity_type: 'Deal', title: 'Fresh streetwear drop', is_active: true, impressions: 540, clicks: 58, ctr: 0.107 },
      { entity_id: 'deal-4', entity_type: 'Deal', title: 'Two-for-one meal specials', is_active: true, impressions: 480, clicks: 40, ctr: 0.083 },
      { entity_id: 'deal-5', entity_type: 'Deal', title: 'Tech accessory clearance', is_active: true, impressions: 320, clicks: 24, ctr: 0.075 },
    ],
  },
  recentEvents: [
    { id: 'evt-1', event_type: 'cta_click', entity_type: 'HeroPlacement', entity_id: 'hero-1', page_path: '/', device_type: 'mobile', created_date: '2026-06-15T08:30:00Z' },
    { id: 'evt-2', event_type: 'impression', entity_type: 'HeroPlacement', entity_id: 'hero-2', page_path: '/', device_type: 'desktop', created_date: '2026-06-15T08:28:00Z' },
    { id: 'evt-3', event_type: 'card_click', entity_type: 'Deal', entity_id: 'deal-1', page_path: '/deals', device_type: 'mobile', created_date: '2026-06-15T08:25:00Z' },
    { id: 'evt-4', event_type: 'video_cta_click', entity_type: 'FeaturedVideo', entity_id: 'fv-1', page_path: '/', device_type: 'desktop', created_date: '2026-06-15T08:20:00Z' },
    { id: 'evt-5', event_type: 'card_view', entity_type: 'Deal', entity_id: 'deal-2', page_path: '/deals', device_type: 'tablet', created_date: '2026-06-15T08:18:00Z' },
    { id: 'evt-6', event_type: 'cta_click', entity_type: 'HeroPlacement', entity_id: 'hero-2', page_path: '/', device_type: 'mobile', created_date: '2026-06-15T08:15:00Z' },
  ],
};

export function buildMockData() {
  // Deep clone so demo-mode mutations stay session-local.
  return JSON.parse(JSON.stringify(data));
}
