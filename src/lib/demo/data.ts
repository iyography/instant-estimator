// Demo mode data - fully functional skeleton with realistic dummy data

export const DEMO_MODE = true; // Set to false when ready for production

export const DEMO_COMPANY = {
  id: 'demo-company-id',
  user_id: 'demo-user-id',
  name: 'Anderson Electric LLC',
  slug: 'anderson-electric',
  email: 'info@andersonelectric.com',
  phone: '+1 (555) 123-4567',
  website_url: 'https://andersonelectric.com',
  industry: 'electrician' as const,
  default_currency: 'USD' as const,
  default_language: 'en' as const,
  subscription_status: 'active' as const,
  stripe_customer_id: 'cus_demo123',
  settings: {
    estimate_range_low_percentage: 10,
    estimate_range_high_percentage: 15,
    notification_email: 'leads@andersonelectric.com',
    widget_primary_color: '#2563eb',
    allowed_domains: ['andersonelectric.com'],
  },
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-12-01T14:30:00Z',
};

export const DEMO_JOB_TYPES = [
  {
    id: 'jt-1',
    company_id: DEMO_COMPANY.id,
    name: 'Electrical Panel Upgrade',
    name_sv: 'Elcentral Uppgradering',
    description: 'Upgrade your electrical panel to handle modern power demands',
    base_price: 150000, // $1,500 in cents
    is_active: true,
    display_order: 0,
    created_at: '2024-01-20T10:00:00Z',
  },
  {
    id: 'jt-2',
    company_id: DEMO_COMPANY.id,
    name: 'Outlet Installation',
    name_sv: 'Uttag Installation',
    description: 'Install new electrical outlets',
    base_price: 15000, // $150 in cents
    is_active: true,
    display_order: 1,
    created_at: '2024-01-20T10:00:00Z',
  },
  {
    id: 'jt-3',
    company_id: DEMO_COMPANY.id,
    name: 'Lighting Installation',
    name_sv: 'Belysning Installation',
    description: 'Install new lighting fixtures',
    base_price: 25000, // $250 in cents
    is_active: true,
    display_order: 2,
    created_at: '2024-01-20T10:00:00Z',
  },
  {
    id: 'jt-4',
    company_id: DEMO_COMPANY.id,
    name: 'EV Charger Installation',
    name_sv: 'Elbilsladdare Installation',
    description: 'Install electric vehicle charging station',
    base_price: 80000, // $800 in cents
    is_active: true,
    display_order: 3,
    created_at: '2024-01-20T10:00:00Z',
  },
];

export const DEMO_QUESTIONS = [
  // Panel Upgrade Questions
  {
    id: 'q-1',
    job_type_id: 'jt-1',
    question_text: 'What is your current panel amperage?',
    question_text_sv: 'Vad är din nuvarande panelkapacitet?',
    question_type: 'single_choice' as const,
    is_required: true,
    display_order: 0,
    ai_generated: true,
  },
  {
    id: 'q-2',
    job_type_id: 'jt-1',
    question_text: 'What amperage do you need?',
    question_text_sv: 'Vilken kapacitet behöver du?',
    question_type: 'single_choice' as const,
    is_required: true,
    display_order: 1,
    ai_generated: true,
  },
  // Outlet Installation Questions
  {
    id: 'q-3',
    job_type_id: 'jt-2',
    question_text: 'How many outlets do you need installed?',
    question_text_sv: 'Hur många uttag behöver du?',
    question_type: 'single_choice' as const,
    is_required: true,
    display_order: 0,
    ai_generated: true,
  },
  {
    id: 'q-4',
    job_type_id: 'jt-2',
    question_text: 'What type of outlets?',
    question_text_sv: 'Vilken typ av uttag?',
    question_type: 'single_choice' as const,
    is_required: true,
    display_order: 1,
    ai_generated: true,
  },
];

export const DEMO_ANSWERS = [
  // Panel Upgrade - Current amperage
  { id: 'a-1', question_id: 'q-1', answer_text: '100 Amp', answer_text_sv: '100 Amp', price_modifier_type: 'fixed' as const, price_modifier_value: 0, display_order: 0 },
  { id: 'a-2', question_id: 'q-1', answer_text: '150 Amp', answer_text_sv: '150 Amp', price_modifier_type: 'fixed' as const, price_modifier_value: 20000, display_order: 1 },
  { id: 'a-3', question_id: 'q-1', answer_text: '200 Amp', answer_text_sv: '200 Amp', price_modifier_type: 'fixed' as const, price_modifier_value: 35000, display_order: 2 },
  // Panel Upgrade - Target amperage
  { id: 'a-4', question_id: 'q-2', answer_text: '200 Amp', answer_text_sv: '200 Amp', price_modifier_type: 'fixed' as const, price_modifier_value: 0, display_order: 0 },
  { id: 'a-5', question_id: 'q-2', answer_text: '400 Amp', answer_text_sv: '400 Amp', price_modifier_type: 'fixed' as const, price_modifier_value: 100000, display_order: 1 },
  // Outlet - Count
  { id: 'a-6', question_id: 'q-3', answer_text: '1-2 outlets', answer_text_sv: '1-2 uttag', price_modifier_type: 'fixed' as const, price_modifier_value: 0, display_order: 0 },
  { id: 'a-7', question_id: 'q-3', answer_text: '3-5 outlets', answer_text_sv: '3-5 uttag', price_modifier_type: 'fixed' as const, price_modifier_value: 15000, display_order: 1 },
  { id: 'a-8', question_id: 'q-3', answer_text: '6+ outlets', answer_text_sv: '6+ uttag', price_modifier_type: 'fixed' as const, price_modifier_value: 35000, display_order: 2 },
  // Outlet - Type
  { id: 'a-9', question_id: 'q-4', answer_text: 'Standard 120V', answer_text_sv: 'Standard 120V', price_modifier_type: 'fixed' as const, price_modifier_value: 0, display_order: 0 },
  { id: 'a-10', question_id: 'q-4', answer_text: 'GFCI (bathroom/kitchen)', answer_text_sv: 'GFCI (badrum/kök)', price_modifier_type: 'fixed' as const, price_modifier_value: 5000, display_order: 1 },
  { id: 'a-11', question_id: 'q-4', answer_text: '240V (appliances)', answer_text_sv: '240V (apparater)', price_modifier_type: 'fixed' as const, price_modifier_value: 15000, display_order: 2 },
];

export const DEMO_LEADS = [
  // New leads
  {
    id: 'lead-1',
    company_id: DEMO_COMPANY.id,
    job_type_id: 'jt-1',
    customer_name: 'John Smith',
    customer_email: 'john.smith@email.com',
    customer_phone: '+1 (555) 234-5678',
    customer_address: '123 Oak Street, Austin, TX 78701',
    status: 'new' as const,
    estimated_price_low: 180000,
    estimated_price_high: 230000,
    answers: { 'q-1': 'a-1', 'q-2': 'a-5' },
    notes: null,
    created_at: '2024-12-15T09:30:00Z',
    updated_at: '2024-12-15T09:30:00Z',
  },
  {
    id: 'lead-2',
    company_id: DEMO_COMPANY.id,
    job_type_id: 'jt-4',
    customer_name: 'Sarah Johnson',
    customer_email: 'sarah.j@gmail.com',
    customer_phone: '+1 (555) 345-6789',
    customer_address: '456 Maple Ave, Austin, TX 78702',
    status: 'new' as const,
    estimated_price_low: 72000,
    estimated_price_high: 92000,
    answers: {},
    notes: null,
    created_at: '2024-12-14T14:20:00Z',
    updated_at: '2024-12-14T14:20:00Z',
  },
  {
    id: 'lead-3',
    company_id: DEMO_COMPANY.id,
    job_type_id: 'jt-2',
    customer_name: 'Mike Williams',
    customer_email: 'mike.w@outlook.com',
    customer_phone: '+1 (555) 456-7890',
    customer_address: '789 Pine Road, Round Rock, TX 78664',
    status: 'new' as const,
    estimated_price_low: 27000,
    estimated_price_high: 35000,
    answers: { 'q-3': 'a-7', 'q-4': 'a-9' },
    notes: null,
    created_at: '2024-12-13T11:45:00Z',
    updated_at: '2024-12-13T11:45:00Z',
  },
  // Contacted leads
  {
    id: 'lead-4',
    company_id: DEMO_COMPANY.id,
    job_type_id: 'jt-1',
    customer_name: 'Emily Davis',
    customer_email: 'emily.davis@company.com',
    customer_phone: '+1 (555) 567-8901',
    customer_address: '321 Cedar Lane, Georgetown, TX 78626',
    status: 'contacted' as const,
    estimated_price_low: 135000,
    estimated_price_high: 175000,
    answers: { 'q-1': 'a-1', 'q-2': 'a-4' },
    notes: 'Called on 12/12, scheduled site visit for 12/18',
    created_at: '2024-12-10T16:00:00Z',
    updated_at: '2024-12-12T10:30:00Z',
  },
  {
    id: 'lead-5',
    company_id: DEMO_COMPANY.id,
    job_type_id: 'jt-3',
    customer_name: 'Robert Chen',
    customer_email: 'r.chen@email.com',
    customer_phone: '+1 (555) 678-9012',
    customer_address: '654 Birch Street, Pflugerville, TX 78660',
    status: 'contacted' as const,
    estimated_price_low: 22500,
    estimated_price_high: 28750,
    answers: {},
    notes: 'Interested in recessed lighting for living room',
    created_at: '2024-12-08T13:15:00Z',
    updated_at: '2024-12-11T09:00:00Z',
  },
  // Quoted leads
  {
    id: 'lead-6',
    company_id: DEMO_COMPANY.id,
    job_type_id: 'jt-4',
    customer_name: 'Jennifer Martinez',
    customer_email: 'jen.martinez@gmail.com',
    customer_phone: '+1 (555) 789-0123',
    customer_address: '987 Elm Drive, Cedar Park, TX 78613',
    status: 'quoted' as const,
    estimated_price_low: 72000,
    estimated_price_high: 92000,
    answers: {},
    notes: 'Sent quote for Tesla Wall Connector installation - $850',
    created_at: '2024-12-05T10:00:00Z',
    updated_at: '2024-12-09T14:45:00Z',
  },
  {
    id: 'lead-7',
    company_id: DEMO_COMPANY.id,
    job_type_id: 'jt-1',
    customer_name: 'David Thompson',
    customer_email: 'dthompson@business.com',
    customer_phone: '+1 (555) 890-1234',
    customer_address: '147 Walnut Court, Leander, TX 78641',
    status: 'quoted' as const,
    estimated_price_low: 225000,
    estimated_price_high: 288000,
    answers: { 'q-1': 'a-2', 'q-2': 'a-5' },
    notes: 'Commercial property - 400 amp upgrade quote sent',
    created_at: '2024-12-01T08:30:00Z',
    updated_at: '2024-12-07T16:20:00Z',
  },
  // Won leads
  {
    id: 'lead-8',
    company_id: DEMO_COMPANY.id,
    job_type_id: 'jt-2',
    customer_name: 'Lisa Anderson',
    customer_email: 'lisa.a@yahoo.com',
    customer_phone: '+1 (555) 901-2345',
    customer_address: '258 Spruce Way, Austin, TX 78745',
    status: 'won' as const,
    estimated_price_low: 45000,
    estimated_price_high: 58000,
    answers: { 'q-3': 'a-8', 'q-4': 'a-10' },
    notes: 'Job completed 12/10 - 8 GFCI outlets installed',
    created_at: '2024-11-25T12:00:00Z',
    updated_at: '2024-12-10T17:00:00Z',
  },
  {
    id: 'lead-9',
    company_id: DEMO_COMPANY.id,
    job_type_id: 'jt-1',
    customer_name: 'James Wilson',
    customer_email: 'jwilson@email.com',
    customer_phone: '+1 (555) 012-3456',
    customer_address: '369 Ash Boulevard, Austin, TX 78759',
    status: 'won' as const,
    estimated_price_low: 135000,
    estimated_price_high: 175000,
    answers: { 'q-1': 'a-1', 'q-2': 'a-4' },
    notes: 'Panel upgrade completed - customer very satisfied',
    created_at: '2024-11-20T09:00:00Z',
    updated_at: '2024-12-05T11:30:00Z',
  },
  {
    id: 'lead-10',
    company_id: DEMO_COMPANY.id,
    job_type_id: 'jt-4',
    customer_name: 'Amanda Brown',
    customer_email: 'amanda.b@company.org',
    customer_phone: '+1 (555) 123-4567',
    customer_address: '741 Hickory Lane, Westlake, TX 78746',
    status: 'won' as const,
    estimated_price_low: 72000,
    estimated_price_high: 92000,
    answers: {},
    notes: 'ChargePoint Home Flex installed in garage',
    created_at: '2024-11-15T14:00:00Z',
    updated_at: '2024-11-28T10:00:00Z',
  },
  // Lost leads
  {
    id: 'lead-11',
    company_id: DEMO_COMPANY.id,
    job_type_id: 'jt-3',
    customer_name: 'Kevin Taylor',
    customer_email: 'ktaylor@gmail.com',
    customer_phone: '+1 (555) 234-5678',
    customer_address: '852 Poplar Street, Austin, TX 78704',
    status: 'lost' as const,
    estimated_price_low: 22500,
    estimated_price_high: 28750,
    answers: {},
    notes: 'Went with competitor - price too high',
    created_at: '2024-11-10T11:00:00Z',
    updated_at: '2024-11-18T15:00:00Z',
  },
  {
    id: 'lead-12',
    company_id: DEMO_COMPANY.id,
    job_type_id: 'jt-1',
    customer_name: 'Michelle Garcia',
    customer_email: 'mgarcia@outlook.com',
    customer_phone: '+1 (555) 345-6789',
    customer_address: '963 Willow Drive, Bee Cave, TX 78738',
    status: 'lost' as const,
    estimated_price_low: 180000,
    estimated_price_high: 230000,
    answers: { 'q-1': 'a-1', 'q-2': 'a-5' },
    notes: 'Project postponed indefinitely',
    created_at: '2024-11-05T16:30:00Z',
    updated_at: '2024-11-22T09:00:00Z',
  },
];

// Helper function to get demo stats
export function getDemoStats() {
  const totalLeads = DEMO_LEADS.length;
  const newLeads = DEMO_LEADS.filter(l => l.status === 'new').length;
  const wonLeads = DEMO_LEADS.filter(l => l.status === 'won').length;
  const estimatedRevenue = DEMO_LEADS
    .filter(l => l.status === 'won')
    .reduce((sum, l) => sum + ((l.estimated_price_low + l.estimated_price_high) / 2), 0);

  return {
    totalLeads,
    newLeads,
    wonLeads,
    estimatedRevenue,
    conversionRate: totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0,
  };
}

// Demo estimator forms
export const DEMO_FORMS = [
  {
    id: 'form-1',
    company_id: DEMO_COMPANY.id,
    name: 'Residential Estimator',
    slug: 'residential',
    description: 'For residential electrical work',
    is_active: true,
    job_type_ids: ['jt-1', 'jt-2', 'jt-3', 'jt-4'],
    created_at: '2024-02-01T10:00:00Z',
    updated_at: '2024-02-01T10:00:00Z',
  },
  {
    id: 'form-2',
    company_id: DEMO_COMPANY.id,
    name: 'Commercial Estimator',
    slug: 'commercial',
    description: 'For commercial electrical projects',
    is_active: true,
    job_type_ids: ['jt-1'],
    created_at: '2024-02-15T10:00:00Z',
    updated_at: '2024-02-15T10:00:00Z',
  },
];

// Demo user for auth bypass
export const DEMO_USER = {
  id: 'demo-user-id',
  email: 'demo@instantestimator.com',
  user_metadata: {
    full_name: 'Demo User',
  },
};
