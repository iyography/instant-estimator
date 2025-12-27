// Demo mode data - production-grade demo with realistic data

export const DEMO_MODE = true;

// ============================================================================
// COMPANY CONFIGURATION
// ============================================================================

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
    widget_accent_color: '#10b981',
    allowed_domains: ['andersonelectric.com', 'localhost'],
    labor_rate_per_hour: 8500, // $85/hour in cents
    tax_rate: 8.25,
    service_area: ['Austin', 'Round Rock', 'Cedar Park', 'Georgetown', 'Pflugerville', 'Leander'],
    business_hours: { start: '08:00', end: '18:00' },
    logo_url: null,
  },
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-12-01T14:30:00Z',
};

// ============================================================================
// JOB TYPES - Comprehensive electrical services
// ============================================================================

export const DEMO_JOB_TYPES = [
  {
    id: 'jt-panel',
    company_id: DEMO_COMPANY.id,
    name: 'Electrical Panel Upgrade',
    name_sv: 'Elcentral Uppgradering',
    description: 'Upgrade your electrical panel to handle modern power demands safely',
    base_price: 150000, // $1,500
    min_price: 80000,
    max_price: 500000,
    estimated_hours: 6,
    is_active: true,
    display_order: 0,
    icon: 'zap',
    category: 'major',
    created_at: '2024-01-20T10:00:00Z',
  },
  {
    id: 'jt-outlet',
    company_id: DEMO_COMPANY.id,
    name: 'Outlet Installation',
    name_sv: 'Uttag Installation',
    description: 'Install new electrical outlets anywhere in your home',
    base_price: 17500, // $175 per outlet
    min_price: 12500,
    max_price: 75000,
    estimated_hours: 1.5,
    is_active: true,
    display_order: 1,
    icon: 'plug',
    category: 'standard',
    created_at: '2024-01-20T10:00:00Z',
  },
  {
    id: 'jt-lighting',
    company_id: DEMO_COMPANY.id,
    name: 'Lighting Installation',
    name_sv: 'Belysning Installation',
    description: 'Professional installation of all lighting types',
    base_price: 22500, // $225 per fixture
    min_price: 15000,
    max_price: 150000,
    estimated_hours: 2,
    is_active: true,
    display_order: 2,
    icon: 'lightbulb',
    category: 'standard',
    created_at: '2024-01-20T10:00:00Z',
  },
  {
    id: 'jt-ev',
    company_id: DEMO_COMPANY.id,
    name: 'EV Charger Installation',
    name_sv: 'Elbilsladdare Installation',
    description: 'Level 2 electric vehicle charging station installation',
    base_price: 85000, // $850
    min_price: 65000,
    max_price: 250000,
    estimated_hours: 4,
    is_active: true,
    display_order: 3,
    icon: 'battery-charging',
    category: 'specialty',
    created_at: '2024-01-20T10:00:00Z',
  },
  {
    id: 'jt-rewire',
    company_id: DEMO_COMPANY.id,
    name: 'Whole House Rewiring',
    name_sv: 'Hel Hus Omkoppling',
    description: 'Complete electrical system replacement for older homes',
    base_price: 800000, // $8,000
    min_price: 500000,
    max_price: 2500000,
    estimated_hours: 40,
    is_active: true,
    display_order: 4,
    icon: 'home',
    category: 'major',
    created_at: '2024-01-20T10:00:00Z',
  },
  {
    id: 'jt-ceiling-fan',
    company_id: DEMO_COMPANY.id,
    name: 'Ceiling Fan Installation',
    name_sv: 'Takfläkt Installation',
    description: 'Install or replace ceiling fans with optional lighting',
    base_price: 15000, // $150
    min_price: 12500,
    max_price: 45000,
    estimated_hours: 1.5,
    is_active: true,
    display_order: 5,
    icon: 'wind',
    category: 'standard',
    created_at: '2024-01-20T10:00:00Z',
  },
  {
    id: 'jt-generator',
    company_id: DEMO_COMPANY.id,
    name: 'Generator Installation',
    name_sv: 'Generator Installation',
    description: 'Standby or portable generator installation with transfer switch',
    base_price: 350000, // $3,500
    min_price: 150000,
    max_price: 1500000,
    estimated_hours: 8,
    is_active: true,
    display_order: 6,
    icon: 'power',
    category: 'specialty',
    created_at: '2024-01-20T10:00:00Z',
  },
  {
    id: 'jt-smart-home',
    company_id: DEMO_COMPANY.id,
    name: 'Smart Home Wiring',
    name_sv: 'Smart Hem Kabeldragning',
    description: 'Smart switches, dimmers, and home automation wiring',
    base_price: 30000, // $300
    min_price: 20000,
    max_price: 200000,
    estimated_hours: 3,
    is_active: true,
    display_order: 7,
    icon: 'smartphone',
    category: 'specialty',
    created_at: '2024-01-20T10:00:00Z',
  },
];

// ============================================================================
// QUESTIONS - With conditional logic support
// ============================================================================

export const DEMO_QUESTIONS = [
  // ========== PANEL UPGRADE QUESTIONS ==========
  {
    id: 'q-panel-current',
    job_type_id: 'jt-panel',
    question_text: 'What is your current electrical panel amperage?',
    question_text_sv: 'Vad är din nuvarande elcentrals amperetal?',
    question_type: 'single_choice' as const,
    is_required: true,
    display_order: 0,
    help_text: 'Check your main breaker - the number is usually printed on the handle',
    condition: null,
  },
  {
    id: 'q-panel-target',
    job_type_id: 'jt-panel',
    question_text: 'What amperage do you want to upgrade to?',
    question_text_sv: 'Vilket amperetal vill du uppgradera till?',
    question_type: 'single_choice' as const,
    is_required: true,
    display_order: 1,
    help_text: '200A is standard for modern homes, 400A for large homes or workshops',
    condition: null,
  },
  {
    id: 'q-panel-location',
    job_type_id: 'jt-panel',
    question_text: 'Where is your electrical panel located?',
    question_text_sv: 'Var finns din elcentral?',
    question_type: 'single_choice' as const,
    is_required: true,
    display_order: 2,
    help_text: 'Panel location affects installation complexity',
    condition: null,
  },
  {
    id: 'q-panel-meter',
    job_type_id: 'jt-panel',
    question_text: 'Does your utility meter need to be upgraded?',
    question_text_sv: 'Behöver din elmätare uppgraderas?',
    question_type: 'single_choice' as const,
    is_required: true,
    display_order: 3,
    help_text: 'Upgrading beyond 200A usually requires meter upgrade',
    condition: { questionId: 'q-panel-target', answerId: 'a-panel-400' },
  },
  {
    id: 'q-panel-permit',
    job_type_id: 'jt-panel',
    question_text: 'Do you need us to handle the permit?',
    question_text_sv: 'Vill du att vi hanterar tillståndet?',
    question_type: 'single_choice' as const,
    is_required: true,
    display_order: 4,
    help_text: 'Panel upgrades require city permits - we can handle this for you',
    condition: null,
  },

  // ========== OUTLET INSTALLATION QUESTIONS ==========
  {
    id: 'q-outlet-quantity',
    job_type_id: 'jt-outlet',
    question_text: 'How many outlets do you need installed?',
    question_text_sv: 'Hur många uttag behöver du installera?',
    question_type: 'single_choice' as const,
    is_required: true,
    display_order: 0,
    help_text: 'Volume discounts apply for larger quantities',
    condition: null,
  },
  {
    id: 'q-outlet-type',
    job_type_id: 'jt-outlet',
    question_text: 'What type of outlets do you need?',
    question_text_sv: 'Vilken typ av uttag behöver du?',
    question_type: 'single_choice' as const,
    is_required: true,
    display_order: 1,
    help_text: 'GFCI required for bathrooms, kitchens, and outdoor locations',
    condition: null,
  },
  {
    id: 'q-outlet-location',
    job_type_id: 'jt-outlet',
    question_text: 'Where will the outlets be installed?',
    question_text_sv: 'Var ska uttagen installeras?',
    question_type: 'single_choice' as const,
    is_required: true,
    display_order: 2,
    help_text: 'Installation complexity varies by location',
    condition: null,
  },
  {
    id: 'q-outlet-existing',
    job_type_id: 'jt-outlet',
    question_text: 'Is there existing wiring nearby?',
    question_text_sv: 'Finns det befintlig kabeldragning i närheten?',
    question_type: 'single_choice' as const,
    is_required: true,
    display_order: 3,
    help_text: 'New wiring runs cost more than extending existing circuits',
    condition: null,
  },

  // ========== LIGHTING QUESTIONS ==========
  {
    id: 'q-lighting-type',
    job_type_id: 'jt-lighting',
    question_text: 'What type of lighting are you installing?',
    question_text_sv: 'Vilken typ av belysning ska installeras?',
    question_type: 'single_choice' as const,
    is_required: true,
    display_order: 0,
    help_text: 'Different fixture types have different installation requirements',
    condition: null,
  },
  {
    id: 'q-lighting-quantity',
    job_type_id: 'jt-lighting',
    question_text: 'How many fixtures do you need installed?',
    question_text_sv: 'Hur många armaturer behöver installeras?',
    question_type: 'single_choice' as const,
    is_required: true,
    display_order: 1,
    help_text: 'Volume discounts apply for 6+ fixtures',
    condition: null,
  },
  {
    id: 'q-lighting-dimmer',
    job_type_id: 'jt-lighting',
    question_text: 'Do you want dimmer switches?',
    question_text_sv: 'Vill du ha dimmers?',
    question_type: 'single_choice' as const,
    is_required: true,
    display_order: 2,
    help_text: 'Dimmers add ambiance and can reduce energy costs',
    condition: null,
  },
  {
    id: 'q-lighting-recessed-size',
    job_type_id: 'jt-lighting',
    question_text: 'What size recessed lights do you prefer?',
    question_text_sv: 'Vilken storlek på infällda lampor föredrar du?',
    question_type: 'single_choice' as const,
    is_required: true,
    display_order: 3,
    help_text: '4" is modern and sleek, 6" provides more light coverage',
    condition: { questionId: 'q-lighting-type', answerId: 'a-lighting-recessed' },
  },

  // ========== EV CHARGER QUESTIONS ==========
  {
    id: 'q-ev-charger-type',
    job_type_id: 'jt-ev',
    question_text: 'What type of EV charger do you need?',
    question_text_sv: 'Vilken typ av elbilsladdare behöver du?',
    question_type: 'single_choice' as const,
    is_required: true,
    display_order: 0,
    help_text: 'Higher amperage chargers provide faster charging speeds',
    condition: null,
  },
  {
    id: 'q-ev-distance',
    job_type_id: 'jt-ev',
    question_text: 'How far is the installation location from your electrical panel?',
    question_text_sv: 'Hur långt är installationsplatsen från elcentralen?',
    question_type: 'single_choice' as const,
    is_required: true,
    display_order: 1,
    help_text: 'Longer distances require more wiring and conduit',
    condition: null,
  },
  {
    id: 'q-ev-mounting',
    job_type_id: 'jt-ev',
    question_text: 'How do you want the charger mounted?',
    question_text_sv: 'Hur vill du att laddaren ska monteras?',
    question_type: 'single_choice' as const,
    is_required: true,
    display_order: 2,
    help_text: 'Pedestal mounts are better for outdoor or dual-vehicle setups',
    condition: null,
  },
  {
    id: 'q-ev-panel-capacity',
    job_type_id: 'jt-ev',
    question_text: 'Does your panel have room for a new 50A or 60A breaker?',
    question_text_sv: 'Har din elcentral plats för en ny 50A eller 60A brytare?',
    question_type: 'single_choice' as const,
    is_required: true,
    display_order: 3,
    help_text: 'If not, we may need to add a sub-panel or upgrade your main panel',
    condition: null,
  },

  // ========== WHOLE HOUSE REWIRING QUESTIONS ==========
  {
    id: 'q-rewire-sqft',
    job_type_id: 'jt-rewire',
    question_text: 'What is the approximate square footage of your home?',
    question_text_sv: 'Vad är ungefärlig boarea i ditt hem?',
    question_type: 'single_choice' as const,
    is_required: true,
    display_order: 0,
    help_text: 'Square footage is the main factor in rewiring cost',
    condition: null,
  },
  {
    id: 'q-rewire-stories',
    job_type_id: 'jt-rewire',
    question_text: 'How many stories is your home?',
    question_text_sv: 'Hur många våningar har ditt hem?',
    question_type: 'single_choice' as const,
    is_required: true,
    display_order: 1,
    help_text: 'Multi-story homes require more labor for wire runs',
    condition: null,
  },
  {
    id: 'q-rewire-access',
    job_type_id: 'jt-rewire',
    question_text: 'What type of wall access does your home have?',
    question_text_sv: 'Vilken typ av väggåtkomst har ditt hem?',
    question_type: 'single_choice' as const,
    is_required: true,
    display_order: 2,
    help_text: 'Attic/crawlspace access reduces wall patching needed',
    condition: null,
  },
  {
    id: 'q-rewire-panel',
    job_type_id: 'jt-rewire',
    question_text: 'Do you also need a panel upgrade?',
    question_text_sv: 'Behöver du också uppgradera elcentralen?',
    question_type: 'single_choice' as const,
    is_required: true,
    display_order: 3,
    help_text: 'Most rewiring projects include a new 200A panel',
    condition: null,
  },

  // ========== CEILING FAN QUESTIONS ==========
  {
    id: 'q-fan-existing',
    job_type_id: 'jt-ceiling-fan',
    question_text: 'Is there an existing ceiling fixture or fan?',
    question_text_sv: 'Finns det en befintlig takarmatur eller fläkt?',
    question_type: 'single_choice' as const,
    is_required: true,
    display_order: 0,
    help_text: 'New locations require wiring installation',
    condition: null,
  },
  {
    id: 'q-fan-quantity',
    job_type_id: 'jt-ceiling-fan',
    question_text: 'How many ceiling fans do you need installed?',
    question_text_sv: 'Hur många takfläktar behöver installeras?',
    question_type: 'single_choice' as const,
    is_required: true,
    display_order: 1,
    help_text: 'Volume discounts apply for multiple fans',
    condition: null,
  },
  {
    id: 'q-fan-control',
    job_type_id: 'jt-ceiling-fan',
    question_text: 'What type of control do you want?',
    question_text_sv: 'Vilken typ av kontroll vill du ha?',
    question_type: 'single_choice' as const,
    is_required: true,
    display_order: 2,
    help_text: 'Remote control and smart fans offer more convenience',
    condition: null,
  },

  // ========== GENERATOR QUESTIONS ==========
  {
    id: 'q-gen-type',
    job_type_id: 'jt-generator',
    question_text: 'What type of generator do you need?',
    question_text_sv: 'Vilken typ av generator behöver du?',
    question_type: 'single_choice' as const,
    is_required: true,
    display_order: 0,
    help_text: 'Standby generators start automatically during outages',
    condition: null,
  },
  {
    id: 'q-gen-size',
    job_type_id: 'jt-generator',
    question_text: 'What size generator do you need?',
    question_text_sv: 'Vilken storlek generator behöver du?',
    question_type: 'single_choice' as const,
    is_required: true,
    display_order: 1,
    help_text: 'Size depends on what you want to power during an outage',
    condition: { questionId: 'q-gen-type', answerId: 'a-gen-standby' },
  },
  {
    id: 'q-gen-fuel',
    job_type_id: 'jt-generator',
    question_text: 'What fuel type do you prefer?',
    question_text_sv: 'Vilken bränsletyp föredrar du?',
    question_type: 'single_choice' as const,
    is_required: true,
    display_order: 2,
    help_text: 'Natural gas is most convenient if you have a gas line',
    condition: { questionId: 'q-gen-type', answerId: 'a-gen-standby' },
  },
  {
    id: 'q-gen-transfer',
    job_type_id: 'jt-generator',
    question_text: 'Do you need a transfer switch installed?',
    question_text_sv: 'Behöver du en överföringsbrytare installerad?',
    question_type: 'single_choice' as const,
    is_required: true,
    display_order: 3,
    help_text: 'Transfer switches safely connect generators to your home',
    condition: null,
  },

  // ========== SMART HOME QUESTIONS ==========
  {
    id: 'q-smart-type',
    job_type_id: 'jt-smart-home',
    question_text: 'What smart home devices do you want installed?',
    question_text_sv: 'Vilka smarta hem-enheter vill du installera?',
    question_type: 'multiple_choice' as const,
    is_required: true,
    display_order: 0,
    help_text: 'Select all that apply',
    condition: null,
  },
  {
    id: 'q-smart-switches',
    job_type_id: 'jt-smart-home',
    question_text: 'How many smart switches do you need?',
    question_text_sv: 'Hur många smarta strömbrytare behöver du?',
    question_type: 'single_choice' as const,
    is_required: true,
    display_order: 1,
    help_text: 'Smart switches replace your existing light switches',
    condition: null,
  },
  {
    id: 'q-smart-hub',
    job_type_id: 'jt-smart-home',
    question_text: 'Do you have a smart home hub?',
    question_text_sv: 'Har du en smart hem-hub?',
    question_type: 'single_choice' as const,
    is_required: true,
    display_order: 2,
    help_text: 'Some devices require a hub for full functionality',
    condition: null,
  },
];

// ============================================================================
// ANSWER OPTIONS - With various modifier types
// ============================================================================

export const DEMO_ANSWERS = [
  // ========== PANEL UPGRADE ANSWERS ==========
  // Current amperage
  { id: 'a-panel-60', question_id: 'q-panel-current', answer_text: '60 Amp (older home)', answer_text_sv: '60 Amp (äldre hem)', price_modifier_type: 'fixed' as const, price_modifier_value: 30000, display_order: 0 },
  { id: 'a-panel-100', question_id: 'q-panel-current', answer_text: '100 Amp', answer_text_sv: '100 Amp', price_modifier_type: 'fixed' as const, price_modifier_value: 0, display_order: 1 },
  { id: 'a-panel-150', question_id: 'q-panel-current', answer_text: '150 Amp', answer_text_sv: '150 Amp', price_modifier_type: 'fixed' as const, price_modifier_value: -10000, display_order: 2 },
  { id: 'a-panel-200', question_id: 'q-panel-current', answer_text: '200 Amp', answer_text_sv: '200 Amp', price_modifier_type: 'fixed' as const, price_modifier_value: -20000, display_order: 3 },
  // Target amperage
  { id: 'a-panel-200-target', question_id: 'q-panel-target', answer_text: '200 Amp (recommended)', answer_text_sv: '200 Amp (rekommenderat)', price_modifier_type: 'fixed' as const, price_modifier_value: 0, display_order: 0 },
  { id: 'a-panel-400', question_id: 'q-panel-target', answer_text: '400 Amp (large home/workshop)', answer_text_sv: '400 Amp (stort hem/verkstad)', price_modifier_type: 'fixed' as const, price_modifier_value: 150000, display_order: 1 },
  // Panel location
  { id: 'a-panel-garage', question_id: 'q-panel-location', answer_text: 'Garage (easy access)', answer_text_sv: 'Garage (enkel åtkomst)', price_modifier_type: 'fixed' as const, price_modifier_value: 0, display_order: 0 },
  { id: 'a-panel-basement', question_id: 'q-panel-location', answer_text: 'Basement', answer_text_sv: 'Källare', price_modifier_type: 'fixed' as const, price_modifier_value: 15000, display_order: 1 },
  { id: 'a-panel-exterior', question_id: 'q-panel-location', answer_text: 'Exterior wall', answer_text_sv: 'Yttervägg', price_modifier_type: 'fixed' as const, price_modifier_value: 25000, display_order: 2 },
  { id: 'a-panel-interior', question_id: 'q-panel-location', answer_text: 'Interior closet', answer_text_sv: 'Inredningsskåp', price_modifier_type: 'fixed' as const, price_modifier_value: 35000, display_order: 3 },
  // Meter upgrade
  { id: 'a-meter-yes', question_id: 'q-panel-meter', answer_text: 'Yes, upgrade meter', answer_text_sv: 'Ja, uppgradera mätare', price_modifier_type: 'fixed' as const, price_modifier_value: 45000, display_order: 0 },
  { id: 'a-meter-no', question_id: 'q-panel-meter', answer_text: 'No, meter is sufficient', answer_text_sv: 'Nej, mätaren räcker', price_modifier_type: 'fixed' as const, price_modifier_value: 0, display_order: 1 },
  { id: 'a-meter-unsure', question_id: 'q-panel-meter', answer_text: 'Not sure - please assess', answer_text_sv: 'Osäker - vänligen bedöm', price_modifier_type: 'fixed' as const, price_modifier_value: 0, display_order: 2 },
  // Permit handling
  { id: 'a-permit-yes', question_id: 'q-panel-permit', answer_text: 'Yes, handle permit ($150)', answer_text_sv: 'Ja, hantera tillstånd ($150)', price_modifier_type: 'fixed' as const, price_modifier_value: 15000, display_order: 0 },
  { id: 'a-permit-no', question_id: 'q-panel-permit', answer_text: 'No, I will handle it', answer_text_sv: 'Nej, jag hanterar det', price_modifier_type: 'fixed' as const, price_modifier_value: 0, display_order: 1 },

  // ========== OUTLET INSTALLATION ANSWERS ==========
  // Quantity
  { id: 'a-outlet-1', question_id: 'q-outlet-quantity', answer_text: '1 outlet', answer_text_sv: '1 uttag', price_modifier_type: 'fixed' as const, price_modifier_value: 0, display_order: 0 },
  { id: 'a-outlet-2-3', question_id: 'q-outlet-quantity', answer_text: '2-3 outlets', answer_text_sv: '2-3 uttag', price_modifier_type: 'fixed' as const, price_modifier_value: 15000, display_order: 1 },
  { id: 'a-outlet-4-6', question_id: 'q-outlet-quantity', answer_text: '4-6 outlets', answer_text_sv: '4-6 uttag', price_modifier_type: 'fixed' as const, price_modifier_value: 35000, display_order: 2 },
  { id: 'a-outlet-7-plus', question_id: 'q-outlet-quantity', answer_text: '7+ outlets', answer_text_sv: '7+ uttag', price_modifier_type: 'percentage' as const, price_modifier_value: 200, display_order: 3 },
  // Type
  { id: 'a-outlet-standard', question_id: 'q-outlet-type', answer_text: 'Standard 120V 15A', answer_text_sv: 'Standard 120V 15A', price_modifier_type: 'fixed' as const, price_modifier_value: 0, display_order: 0 },
  { id: 'a-outlet-gfci', question_id: 'q-outlet-type', answer_text: 'GFCI (bathroom/kitchen)', answer_text_sv: 'GFCI (badrum/kök)', price_modifier_type: 'fixed' as const, price_modifier_value: 4500, display_order: 1 },
  { id: 'a-outlet-20a', question_id: 'q-outlet-type', answer_text: '20A circuit', answer_text_sv: '20A krets', price_modifier_type: 'fixed' as const, price_modifier_value: 7500, display_order: 2 },
  { id: 'a-outlet-240v', question_id: 'q-outlet-type', answer_text: '240V (appliances)', answer_text_sv: '240V (apparater)', price_modifier_type: 'fixed' as const, price_modifier_value: 25000, display_order: 3 },
  { id: 'a-outlet-usb', question_id: 'q-outlet-type', answer_text: 'USB combo outlet', answer_text_sv: 'USB-kombouttag', price_modifier_type: 'fixed' as const, price_modifier_value: 3500, display_order: 4 },
  // Location
  { id: 'a-outlet-same-room', question_id: 'q-outlet-location', answer_text: 'Same room as panel', answer_text_sv: 'Samma rum som elcentral', price_modifier_type: 'fixed' as const, price_modifier_value: 0, display_order: 0 },
  { id: 'a-outlet-adjacent', question_id: 'q-outlet-location', answer_text: 'Adjacent room', answer_text_sv: 'Intilliggande rum', price_modifier_type: 'fixed' as const, price_modifier_value: 5000, display_order: 1 },
  { id: 'a-outlet-far', question_id: 'q-outlet-location', answer_text: 'Far from panel', answer_text_sv: 'Långt från elcentral', price_modifier_type: 'fixed' as const, price_modifier_value: 15000, display_order: 2 },
  { id: 'a-outlet-outdoor', question_id: 'q-outlet-location', answer_text: 'Outdoor', answer_text_sv: 'Utomhus', price_modifier_type: 'fixed' as const, price_modifier_value: 20000, display_order: 3 },
  // Existing wiring
  { id: 'a-outlet-existing-yes', question_id: 'q-outlet-existing', answer_text: 'Yes, wiring nearby', answer_text_sv: 'Ja, kablar i närheten', price_modifier_type: 'fixed' as const, price_modifier_value: 0, display_order: 0 },
  { id: 'a-outlet-existing-no', question_id: 'q-outlet-existing', answer_text: 'No, new run needed', answer_text_sv: 'Nej, ny kabeldragning behövs', price_modifier_type: 'fixed' as const, price_modifier_value: 12500, display_order: 1 },
  { id: 'a-outlet-existing-unsure', question_id: 'q-outlet-existing', answer_text: 'Not sure', answer_text_sv: 'Osäker', price_modifier_type: 'fixed' as const, price_modifier_value: 0, display_order: 2 },

  // ========== LIGHTING ANSWERS ==========
  // Type
  { id: 'a-lighting-recessed', question_id: 'q-lighting-type', answer_text: 'Recessed (can lights)', answer_text_sv: 'Infällda spotlights', price_modifier_type: 'fixed' as const, price_modifier_value: 0, display_order: 0 },
  { id: 'a-lighting-pendant', question_id: 'q-lighting-type', answer_text: 'Pendant/Chandelier', answer_text_sv: 'Pendel/Ljuskrona', price_modifier_type: 'fixed' as const, price_modifier_value: 5000, display_order: 1 },
  { id: 'a-lighting-track', question_id: 'q-lighting-type', answer_text: 'Track lighting', answer_text_sv: 'Skensystem', price_modifier_type: 'fixed' as const, price_modifier_value: 7500, display_order: 2 },
  { id: 'a-lighting-under-cabinet', question_id: 'q-lighting-type', answer_text: 'Under cabinet', answer_text_sv: 'Under skåp', price_modifier_type: 'fixed' as const, price_modifier_value: 3500, display_order: 3 },
  { id: 'a-lighting-outdoor', question_id: 'q-lighting-type', answer_text: 'Outdoor/Landscape', answer_text_sv: 'Utomhus/Landskap', price_modifier_type: 'fixed' as const, price_modifier_value: 10000, display_order: 4 },
  // Quantity
  { id: 'a-lighting-1-2', question_id: 'q-lighting-quantity', answer_text: '1-2 fixtures', answer_text_sv: '1-2 armaturer', price_modifier_type: 'fixed' as const, price_modifier_value: 0, display_order: 0 },
  { id: 'a-lighting-3-5', question_id: 'q-lighting-quantity', answer_text: '3-5 fixtures', answer_text_sv: '3-5 armaturer', price_modifier_type: 'fixed' as const, price_modifier_value: 15000, display_order: 1 },
  { id: 'a-lighting-6-10', question_id: 'q-lighting-quantity', answer_text: '6-10 fixtures', answer_text_sv: '6-10 armaturer', price_modifier_type: 'percentage' as const, price_modifier_value: 80, display_order: 2 },
  { id: 'a-lighting-10-plus', question_id: 'q-lighting-quantity', answer_text: '10+ fixtures', answer_text_sv: '10+ armaturer', price_modifier_type: 'percentage' as const, price_modifier_value: 150, display_order: 3 },
  // Dimmer
  { id: 'a-lighting-dimmer-yes', question_id: 'q-lighting-dimmer', answer_text: 'Yes, add dimmers', answer_text_sv: 'Ja, lägg till dimmers', price_modifier_type: 'fixed' as const, price_modifier_value: 8500, display_order: 0 },
  { id: 'a-lighting-dimmer-no', question_id: 'q-lighting-dimmer', answer_text: 'No, standard switches', answer_text_sv: 'Nej, standard strömbrytare', price_modifier_type: 'fixed' as const, price_modifier_value: 0, display_order: 1 },
  { id: 'a-lighting-dimmer-smart', question_id: 'q-lighting-dimmer', answer_text: 'Smart dimmers (+$35 each)', answer_text_sv: 'Smarta dimmers (+$35 st)', price_modifier_type: 'fixed' as const, price_modifier_value: 15000, display_order: 2 },
  // Recessed size
  { id: 'a-lighting-4inch', question_id: 'q-lighting-recessed-size', answer_text: '4" (modern, sleek)', answer_text_sv: '4" (modern, smal)', price_modifier_type: 'fixed' as const, price_modifier_value: 0, display_order: 0 },
  { id: 'a-lighting-6inch', question_id: 'q-lighting-recessed-size', answer_text: '6" (more light)', answer_text_sv: '6" (mer ljus)', price_modifier_type: 'fixed' as const, price_modifier_value: 2500, display_order: 1 },

  // ========== EV CHARGER ANSWERS ==========
  // Charger type
  { id: 'a-ev-level2-40', question_id: 'q-ev-charger-type', answer_text: 'Level 2 - 40 Amp (25 mi/hr)', answer_text_sv: 'Nivå 2 - 40 Amp (40 km/h)', price_modifier_type: 'fixed' as const, price_modifier_value: 0, display_order: 0 },
  { id: 'a-ev-level2-48', question_id: 'q-ev-charger-type', answer_text: 'Level 2 - 48 Amp (30 mi/hr)', answer_text_sv: 'Nivå 2 - 48 Amp (48 km/h)', price_modifier_type: 'fixed' as const, price_modifier_value: 15000, display_order: 1 },
  { id: 'a-ev-level2-60', question_id: 'q-ev-charger-type', answer_text: 'Level 2 - 60 Amp (37 mi/hr)', answer_text_sv: 'Nivå 2 - 60 Amp (60 km/h)', price_modifier_type: 'fixed' as const, price_modifier_value: 35000, display_order: 2 },
  // Distance
  { id: 'a-ev-close', question_id: 'q-ev-distance', answer_text: 'Within 25 feet', answer_text_sv: 'Inom 7 meter', price_modifier_type: 'fixed' as const, price_modifier_value: 0, display_order: 0 },
  { id: 'a-ev-medium', question_id: 'q-ev-distance', answer_text: '25-50 feet', answer_text_sv: '7-15 meter', price_modifier_type: 'fixed' as const, price_modifier_value: 25000, display_order: 1 },
  { id: 'a-ev-far', question_id: 'q-ev-distance', answer_text: '50-100 feet', answer_text_sv: '15-30 meter', price_modifier_type: 'fixed' as const, price_modifier_value: 50000, display_order: 2 },
  { id: 'a-ev-very-far', question_id: 'q-ev-distance', answer_text: 'Over 100 feet', answer_text_sv: 'Över 30 meter', price_modifier_type: 'fixed' as const, price_modifier_value: 85000, display_order: 3 },
  // Mounting
  { id: 'a-ev-wall', question_id: 'q-ev-mounting', answer_text: 'Wall mounted', answer_text_sv: 'Väggmonterad', price_modifier_type: 'fixed' as const, price_modifier_value: 0, display_order: 0 },
  { id: 'a-ev-pedestal', question_id: 'q-ev-mounting', answer_text: 'Pedestal mount (+$400)', answer_text_sv: 'Pelarfäste (+$400)', price_modifier_type: 'fixed' as const, price_modifier_value: 40000, display_order: 1 },
  // Panel capacity
  { id: 'a-ev-panel-yes', question_id: 'q-ev-panel-capacity', answer_text: 'Yes, space available', answer_text_sv: 'Ja, plats tillgänglig', price_modifier_type: 'fixed' as const, price_modifier_value: 0, display_order: 0 },
  { id: 'a-ev-panel-no', question_id: 'q-ev-panel-capacity', answer_text: 'No, need sub-panel', answer_text_sv: 'Nej, behöver underpanel', price_modifier_type: 'fixed' as const, price_modifier_value: 75000, display_order: 1 },
  { id: 'a-ev-panel-unsure', question_id: 'q-ev-panel-capacity', answer_text: 'Not sure', answer_text_sv: 'Osäker', price_modifier_type: 'fixed' as const, price_modifier_value: 0, display_order: 2 },

  // ========== REWIRING ANSWERS ==========
  // Square footage
  { id: 'a-rewire-small', question_id: 'q-rewire-sqft', answer_text: 'Under 1,500 sq ft', answer_text_sv: 'Under 140 m²', price_modifier_type: 'fixed' as const, price_modifier_value: 0, display_order: 0 },
  { id: 'a-rewire-medium', question_id: 'q-rewire-sqft', answer_text: '1,500 - 2,500 sq ft', answer_text_sv: '140 - 230 m²', price_modifier_type: 'percentage' as const, price_modifier_value: 50, display_order: 1 },
  { id: 'a-rewire-large', question_id: 'q-rewire-sqft', answer_text: '2,500 - 3,500 sq ft', answer_text_sv: '230 - 325 m²', price_modifier_type: 'percentage' as const, price_modifier_value: 100, display_order: 2 },
  { id: 'a-rewire-xlarge', question_id: 'q-rewire-sqft', answer_text: 'Over 3,500 sq ft', answer_text_sv: 'Över 325 m²', price_modifier_type: 'percentage' as const, price_modifier_value: 175, display_order: 3 },
  // Stories
  { id: 'a-rewire-1story', question_id: 'q-rewire-stories', answer_text: '1 story', answer_text_sv: '1 våning', price_modifier_type: 'fixed' as const, price_modifier_value: 0, display_order: 0 },
  { id: 'a-rewire-2story', question_id: 'q-rewire-stories', answer_text: '2 stories', answer_text_sv: '2 våningar', price_modifier_type: 'percentage' as const, price_modifier_value: 25, display_order: 1 },
  { id: 'a-rewire-3story', question_id: 'q-rewire-stories', answer_text: '3+ stories', answer_text_sv: '3+ våningar', price_modifier_type: 'percentage' as const, price_modifier_value: 50, display_order: 2 },
  // Access
  { id: 'a-rewire-good', question_id: 'q-rewire-access', answer_text: 'Good (attic + crawlspace)', answer_text_sv: 'Bra (vind + krypgrund)', price_modifier_type: 'fixed' as const, price_modifier_value: 0, display_order: 0 },
  { id: 'a-rewire-partial', question_id: 'q-rewire-access', answer_text: 'Partial (attic only)', answer_text_sv: 'Delvis (endast vind)', price_modifier_type: 'percentage' as const, price_modifier_value: 15, display_order: 1 },
  { id: 'a-rewire-limited', question_id: 'q-rewire-access', answer_text: 'Limited (slab foundation)', answer_text_sv: 'Begränsad (plattgrund)', price_modifier_type: 'percentage' as const, price_modifier_value: 35, display_order: 2 },
  // Panel with rewire
  { id: 'a-rewire-panel-yes', question_id: 'q-rewire-panel', answer_text: 'Yes, include 200A panel', answer_text_sv: 'Ja, inkludera 200A central', price_modifier_type: 'fixed' as const, price_modifier_value: 100000, display_order: 0 },
  { id: 'a-rewire-panel-no', question_id: 'q-rewire-panel', answer_text: 'No, keep existing panel', answer_text_sv: 'Nej, behåll befintlig', price_modifier_type: 'fixed' as const, price_modifier_value: 0, display_order: 1 },

  // ========== CEILING FAN ANSWERS ==========
  // Existing
  { id: 'a-fan-existing-fan', question_id: 'q-fan-existing', answer_text: 'Existing fan (simple swap)', answer_text_sv: 'Befintlig fläkt (enkelt byte)', price_modifier_type: 'fixed' as const, price_modifier_value: 0, display_order: 0 },
  { id: 'a-fan-existing-light', question_id: 'q-fan-existing', answer_text: 'Existing light fixture', answer_text_sv: 'Befintlig lampa', price_modifier_type: 'fixed' as const, price_modifier_value: 5000, display_order: 1 },
  { id: 'a-fan-new', question_id: 'q-fan-existing', answer_text: 'New location (no wiring)', answer_text_sv: 'Ny plats (ingen kabeldragning)', price_modifier_type: 'fixed' as const, price_modifier_value: 20000, display_order: 2 },
  // Quantity
  { id: 'a-fan-1', question_id: 'q-fan-quantity', answer_text: '1 fan', answer_text_sv: '1 fläkt', price_modifier_type: 'fixed' as const, price_modifier_value: 0, display_order: 0 },
  { id: 'a-fan-2', question_id: 'q-fan-quantity', answer_text: '2 fans', answer_text_sv: '2 fläktar', price_modifier_type: 'fixed' as const, price_modifier_value: 12500, display_order: 1 },
  { id: 'a-fan-3-plus', question_id: 'q-fan-quantity', answer_text: '3+ fans', answer_text_sv: '3+ fläktar', price_modifier_type: 'percentage' as const, price_modifier_value: 100, display_order: 2 },
  // Control
  { id: 'a-fan-pull', question_id: 'q-fan-control', answer_text: 'Pull chain (basic)', answer_text_sv: 'Dragkedja (enkel)', price_modifier_type: 'fixed' as const, price_modifier_value: 0, display_order: 0 },
  { id: 'a-fan-wall', question_id: 'q-fan-control', answer_text: 'Wall control', answer_text_sv: 'Väggkontroll', price_modifier_type: 'fixed' as const, price_modifier_value: 3500, display_order: 1 },
  { id: 'a-fan-remote', question_id: 'q-fan-control', answer_text: 'Remote control', answer_text_sv: 'Fjärrkontroll', price_modifier_type: 'fixed' as const, price_modifier_value: 5000, display_order: 2 },
  { id: 'a-fan-smart', question_id: 'q-fan-control', answer_text: 'Smart home compatible', answer_text_sv: 'Smart hem-kompatibel', price_modifier_type: 'fixed' as const, price_modifier_value: 8500, display_order: 3 },

  // ========== GENERATOR ANSWERS ==========
  // Type
  { id: 'a-gen-portable', question_id: 'q-gen-type', answer_text: 'Portable with inlet', answer_text_sv: 'Portabel med inlopp', price_modifier_type: 'fixed' as const, price_modifier_value: -200000, display_order: 0 },
  { id: 'a-gen-standby', question_id: 'q-gen-type', answer_text: 'Standby (automatic)', answer_text_sv: 'Standby (automatisk)', price_modifier_type: 'fixed' as const, price_modifier_value: 0, display_order: 1 },
  // Size (standby only)
  { id: 'a-gen-small', question_id: 'q-gen-size', answer_text: '10-14 kW (essentials)', answer_text_sv: '10-14 kW (grundläggande)', price_modifier_type: 'fixed' as const, price_modifier_value: 0, display_order: 0 },
  { id: 'a-gen-medium', question_id: 'q-gen-size', answer_text: '16-20 kW (most homes)', answer_text_sv: '16-20 kW (de flesta hem)', price_modifier_type: 'fixed' as const, price_modifier_value: 250000, display_order: 1 },
  { id: 'a-gen-large', question_id: 'q-gen-size', answer_text: '22-26 kW (large home)', answer_text_sv: '22-26 kW (stort hem)', price_modifier_type: 'fixed' as const, price_modifier_value: 450000, display_order: 2 },
  { id: 'a-gen-whole', question_id: 'q-gen-size', answer_text: '30+ kW (whole house)', answer_text_sv: '30+ kW (hela huset)', price_modifier_type: 'fixed' as const, price_modifier_value: 700000, display_order: 3 },
  // Fuel
  { id: 'a-gen-natural', question_id: 'q-gen-fuel', answer_text: 'Natural gas', answer_text_sv: 'Naturgas', price_modifier_type: 'fixed' as const, price_modifier_value: 0, display_order: 0 },
  { id: 'a-gen-propane', question_id: 'q-gen-fuel', answer_text: 'Propane (LP)', answer_text_sv: 'Propan (LP)', price_modifier_type: 'fixed' as const, price_modifier_value: 15000, display_order: 1 },
  { id: 'a-gen-dual', question_id: 'q-gen-fuel', answer_text: 'Dual fuel (both)', answer_text_sv: 'Dubbelmatad (båda)', price_modifier_type: 'fixed' as const, price_modifier_value: 35000, display_order: 2 },
  // Transfer switch
  { id: 'a-gen-transfer-auto', question_id: 'q-gen-transfer', answer_text: 'Automatic transfer switch', answer_text_sv: 'Automatisk överföringsbrytare', price_modifier_type: 'fixed' as const, price_modifier_value: 0, display_order: 0 },
  { id: 'a-gen-transfer-manual', question_id: 'q-gen-transfer', answer_text: 'Manual transfer switch', answer_text_sv: 'Manuell överföringsbrytare', price_modifier_type: 'fixed' as const, price_modifier_value: -15000, display_order: 1 },
  { id: 'a-gen-transfer-interlock', question_id: 'q-gen-transfer', answer_text: 'Interlock kit only', answer_text_sv: 'Endast förreglingssats', price_modifier_type: 'fixed' as const, price_modifier_value: -25000, display_order: 2 },

  // ========== SMART HOME ANSWERS ==========
  // Smart devices (multiple choice)
  { id: 'a-smart-switches', question_id: 'q-smart-type', answer_text: 'Smart light switches', answer_text_sv: 'Smarta strömbrytare', price_modifier_type: 'fixed' as const, price_modifier_value: 0, display_order: 0 },
  { id: 'a-smart-dimmers', question_id: 'q-smart-type', answer_text: 'Smart dimmers', answer_text_sv: 'Smarta dimmers', price_modifier_type: 'fixed' as const, price_modifier_value: 5000, display_order: 1 },
  { id: 'a-smart-outlets', question_id: 'q-smart-type', answer_text: 'Smart outlets', answer_text_sv: 'Smarta uttag', price_modifier_type: 'fixed' as const, price_modifier_value: 3500, display_order: 2 },
  { id: 'a-smart-thermostat', question_id: 'q-smart-type', answer_text: 'Smart thermostat wiring', answer_text_sv: 'Smart termostat kabeldragning', price_modifier_type: 'fixed' as const, price_modifier_value: 15000, display_order: 3 },
  // Number of switches
  { id: 'a-smart-1-5', question_id: 'q-smart-switches', answer_text: '1-5 switches', answer_text_sv: '1-5 strömbrytare', price_modifier_type: 'fixed' as const, price_modifier_value: 0, display_order: 0 },
  { id: 'a-smart-6-10', question_id: 'q-smart-switches', answer_text: '6-10 switches', answer_text_sv: '6-10 strömbrytare', price_modifier_type: 'fixed' as const, price_modifier_value: 10000, display_order: 1 },
  { id: 'a-smart-11-plus', question_id: 'q-smart-switches', answer_text: '11+ switches', answer_text_sv: '11+ strömbrytare', price_modifier_type: 'percentage' as const, price_modifier_value: 60, display_order: 2 },
  // Hub
  { id: 'a-smart-hub-yes', question_id: 'q-smart-hub', answer_text: 'Yes (Alexa/Google/HomeKit)', answer_text_sv: 'Ja (Alexa/Google/HomeKit)', price_modifier_type: 'fixed' as const, price_modifier_value: 0, display_order: 0 },
  { id: 'a-smart-hub-no', question_id: 'q-smart-hub', answer_text: 'No, need hub setup', answer_text_sv: 'Nej, behöver hub-installation', price_modifier_type: 'fixed' as const, price_modifier_value: 15000, display_order: 1 },
];

// ============================================================================
// LEADS - Comprehensive lead data with estimate details
// ============================================================================

export const DEMO_LEADS = [
  // ========== NEW LEADS ==========
  {
    id: 'lead-1',
    company_id: DEMO_COMPANY.id,
    job_type_id: 'jt-panel',
    customer_name: 'John Smith',
    customer_email: 'john.smith@email.com',
    customer_phone: '+1 (555) 234-5678',
    customer_address: '123 Oak Street, Austin, TX 78701',
    status: 'new' as const,
    estimated_price_low: 162000,
    estimated_price_high: 207000,
    lead_score: 85,
    source: 'website',
    source_url: 'https://andersonelectric.com/services',
    answers: { 'q-panel-current': 'a-panel-60', 'q-panel-target': 'a-panel-200-target', 'q-panel-location': 'a-panel-garage', 'q-panel-permit': 'a-permit-yes' },
    estimate_breakdown: [
      { item: 'Base Panel Upgrade', amount: 150000 },
      { item: 'Older Panel Removal (60A)', amount: 30000 },
      { item: 'Permit Handling', amount: 15000 },
    ],
    notes: null,
    lead_responses: [
      { question_id: 'q-panel-current', answer_option_id: 'a-panel-60', raw_answer: null },
      { question_id: 'q-panel-target', answer_option_id: 'a-panel-200-target', raw_answer: null },
    ],
    created_at: '2024-12-15T09:30:00Z',
    updated_at: '2024-12-15T09:30:00Z',
  },
  {
    id: 'lead-2',
    company_id: DEMO_COMPANY.id,
    job_type_id: 'jt-ev',
    customer_name: 'Sarah Johnson',
    customer_email: 'sarah.j@gmail.com',
    customer_phone: '+1 (555) 345-6789',
    customer_address: '456 Maple Ave, Austin, TX 78702',
    status: 'new' as const,
    estimated_price_low: 99000,
    estimated_price_high: 126000,
    lead_score: 92,
    source: 'google',
    source_url: null,
    answers: { 'q-ev-charger-type': 'a-ev-level2-48', 'q-ev-distance': 'a-ev-close', 'q-ev-mounting': 'a-ev-wall', 'q-ev-panel-capacity': 'a-ev-panel-yes' },
    estimate_breakdown: [
      { item: 'Level 2 48A Charger Install', amount: 85000 },
      { item: '48A Charger Upgrade', amount: 15000 },
      { item: 'Wiring (within 25 ft)', amount: 0 },
    ],
    notes: null,
    lead_responses: [],
    created_at: '2024-12-14T14:20:00Z',
    updated_at: '2024-12-14T14:20:00Z',
  },
  {
    id: 'lead-3',
    company_id: DEMO_COMPANY.id,
    job_type_id: 'jt-outlet',
    customer_name: 'Mike Williams',
    customer_email: 'mike.w@outlook.com',
    customer_phone: '+1 (555) 456-7890',
    customer_address: '789 Pine Road, Round Rock, TX 78664',
    status: 'new' as const,
    estimated_price_low: 31500,
    estimated_price_high: 40000,
    lead_score: 68,
    source: 'referral',
    source_url: null,
    answers: { 'q-outlet-quantity': 'a-outlet-2-3', 'q-outlet-type': 'a-outlet-gfci', 'q-outlet-location': 'a-outlet-same-room', 'q-outlet-existing': 'a-outlet-existing-yes' },
    estimate_breakdown: [
      { item: 'Base Outlet Installation', amount: 17500 },
      { item: '2-3 Outlets', amount: 15000 },
      { item: 'GFCI Upgrade', amount: 4500 },
    ],
    notes: null,
    lead_responses: [],
    created_at: '2024-12-13T11:45:00Z',
    updated_at: '2024-12-13T11:45:00Z',
  },
  {
    id: 'lead-4',
    company_id: DEMO_COMPANY.id,
    job_type_id: 'jt-lighting',
    customer_name: 'Jennifer Martinez',
    customer_email: 'jen.m@company.com',
    customer_phone: '+1 (555) 567-8901',
    customer_address: '321 Elm Drive, Cedar Park, TX 78613',
    status: 'new' as const,
    estimated_price_low: 54000,
    estimated_price_high: 69000,
    lead_score: 78,
    source: 'website',
    source_url: null,
    answers: { 'q-lighting-type': 'a-lighting-recessed', 'q-lighting-quantity': 'a-lighting-6-10', 'q-lighting-dimmer': 'a-lighting-dimmer-yes', 'q-lighting-recessed-size': 'a-lighting-4inch' },
    estimate_breakdown: [
      { item: 'Base Recessed Lighting', amount: 22500 },
      { item: '6-10 Fixtures (80% increase)', amount: 18000 },
      { item: 'Dimmer Switches', amount: 8500 },
    ],
    notes: null,
    lead_responses: [],
    created_at: '2024-12-12T16:30:00Z',
    updated_at: '2024-12-12T16:30:00Z',
  },

  // ========== CONTACTED LEADS ==========
  {
    id: 'lead-5',
    company_id: DEMO_COMPANY.id,
    job_type_id: 'jt-panel',
    customer_name: 'Emily Davis',
    customer_email: 'emily.davis@business.com',
    customer_phone: '+1 (555) 678-9012',
    customer_address: '654 Cedar Lane, Georgetown, TX 78626',
    status: 'contacted' as const,
    estimated_price_low: 135000,
    estimated_price_high: 172000,
    lead_score: 88,
    source: 'website',
    source_url: null,
    answers: { 'q-panel-current': 'a-panel-100', 'q-panel-target': 'a-panel-200-target', 'q-panel-location': 'a-panel-garage', 'q-panel-permit': 'a-permit-yes' },
    estimate_breakdown: [
      { item: 'Base Panel Upgrade', amount: 150000 },
      { item: 'Permit Handling', amount: 15000 },
    ],
    notes: 'Called 12/12 - Scheduled site visit for 12/18. Homeowner wants to ensure capacity for future EV charger.',
    lead_responses: [],
    created_at: '2024-12-10T10:00:00Z',
    updated_at: '2024-12-12T14:30:00Z',
  },
  {
    id: 'lead-6',
    company_id: DEMO_COMPANY.id,
    job_type_id: 'jt-smart-home',
    customer_name: 'Robert Chen',
    customer_email: 'r.chen@email.com',
    customer_phone: '+1 (555) 789-0123',
    customer_address: '987 Birch Street, Pflugerville, TX 78660',
    status: 'contacted' as const,
    estimated_price_low: 40500,
    estimated_price_high: 51750,
    lead_score: 72,
    source: 'google',
    source_url: null,
    answers: { 'q-smart-type': 'a-smart-switches', 'q-smart-switches': 'a-smart-6-10', 'q-smart-hub': 'a-smart-hub-yes' },
    estimate_breakdown: [
      { item: 'Smart Home Base', amount: 30000 },
      { item: '6-10 Smart Switches', amount: 10000 },
    ],
    notes: 'Interested in whole-house smart lighting. Uses Apple HomeKit. Follow up with switch compatibility info.',
    lead_responses: [],
    created_at: '2024-12-08T13:15:00Z',
    updated_at: '2024-12-11T09:00:00Z',
  },
  {
    id: 'lead-7',
    company_id: DEMO_COMPANY.id,
    job_type_id: 'jt-ceiling-fan',
    customer_name: 'Amanda Thompson',
    customer_email: 'amanda.t@yahoo.com',
    customer_phone: '+1 (555) 890-1234',
    customer_address: '147 Oak Court, Leander, TX 78641',
    status: 'contacted' as const,
    estimated_price_low: 31500,
    estimated_price_high: 40000,
    lead_score: 65,
    source: 'referral',
    source_url: null,
    answers: { 'q-fan-existing': 'a-fan-existing-light', 'q-fan-quantity': 'a-fan-2', 'q-fan-control': 'a-fan-remote' },
    estimate_breakdown: [
      { item: 'Base Ceiling Fan Install', amount: 15000 },
      { item: 'Light-to-Fan Conversion', amount: 5000 },
      { item: 'Second Fan', amount: 12500 },
      { item: 'Remote Controls (2)', amount: 10000 },
    ],
    notes: 'Referred by Lisa Anderson. Installing fans in master bedroom and living room.',
    lead_responses: [],
    created_at: '2024-12-06T11:00:00Z',
    updated_at: '2024-12-10T15:45:00Z',
  },

  // ========== QUOTED LEADS ==========
  {
    id: 'lead-8',
    company_id: DEMO_COMPANY.id,
    job_type_id: 'jt-ev',
    customer_name: 'David Wilson',
    customer_email: 'dwilson@tech.com',
    customer_phone: '+1 (555) 901-2345',
    customer_address: '258 Spruce Way, Austin, TX 78745',
    status: 'quoted' as const,
    estimated_price_low: 144000,
    estimated_price_high: 184000,
    lead_score: 95,
    source: 'website',
    source_url: null,
    answers: { 'q-ev-charger-type': 'a-ev-level2-48', 'q-ev-distance': 'a-ev-medium', 'q-ev-mounting': 'a-ev-wall', 'q-ev-panel-capacity': 'a-ev-panel-yes' },
    estimate_breakdown: [
      { item: 'Level 2 48A Charger Install', amount: 85000 },
      { item: '48A Upgrade', amount: 15000 },
      { item: '25-50 ft Wiring Run', amount: 25000 },
    ],
    notes: 'Sent detailed quote on 12/9. Tesla Model Y owner. Very interested, comparing with one other quote.',
    lead_responses: [],
    created_at: '2024-12-05T14:00:00Z',
    updated_at: '2024-12-09T10:30:00Z',
  },
  {
    id: 'lead-9',
    company_id: DEMO_COMPANY.id,
    job_type_id: 'jt-panel',
    customer_name: 'Patricia Brown',
    customer_email: 'pbrown@realestate.com',
    customer_phone: '+1 (555) 012-3456',
    customer_address: '369 Walnut Ave, Austin, TX 78759',
    status: 'quoted' as const,
    estimated_price_low: 315000,
    estimated_price_high: 402000,
    lead_score: 90,
    source: 'referral',
    source_url: null,
    answers: { 'q-panel-current': 'a-panel-100', 'q-panel-target': 'a-panel-400', 'q-panel-location': 'a-panel-basement', 'q-panel-meter': 'a-meter-yes', 'q-panel-permit': 'a-permit-yes' },
    estimate_breakdown: [
      { item: 'Base Panel Upgrade', amount: 150000 },
      { item: '400A Upgrade', amount: 150000 },
      { item: 'Basement Location', amount: 15000 },
      { item: 'Meter Upgrade', amount: 45000 },
      { item: 'Permit Handling', amount: 15000 },
    ],
    notes: 'Commercial property owner. Quote sent 12/7. Needs 400A for workshop equipment. High priority.',
    lead_responses: [],
    created_at: '2024-12-01T09:00:00Z',
    updated_at: '2024-12-07T16:00:00Z',
  },
  {
    id: 'lead-10',
    company_id: DEMO_COMPANY.id,
    job_type_id: 'jt-generator',
    customer_name: 'Michael Garcia',
    customer_email: 'mgarcia@consulting.com',
    customer_phone: '+1 (555) 123-4567',
    customer_address: '741 Hickory Blvd, Westlake, TX 78746',
    status: 'quoted' as const,
    estimated_price_low: 720000,
    estimated_price_high: 918000,
    lead_score: 88,
    source: 'google',
    source_url: null,
    answers: { 'q-gen-type': 'a-gen-standby', 'q-gen-size': 'a-gen-medium', 'q-gen-fuel': 'a-gen-natural', 'q-gen-transfer': 'a-gen-transfer-auto' },
    estimate_breakdown: [
      { item: 'Base Generator Install', amount: 350000 },
      { item: '16-20 kW Generator', amount: 250000 },
      { item: 'Natural Gas Connection', amount: 0 },
      { item: 'Automatic Transfer Switch', amount: 0 },
    ],
    notes: 'After recent power outages, wants whole-house backup. Has existing natural gas line. Generac preferred.',
    lead_responses: [],
    created_at: '2024-11-28T10:00:00Z',
    updated_at: '2024-12-06T11:30:00Z',
  },
  {
    id: 'lead-11',
    company_id: DEMO_COMPANY.id,
    job_type_id: 'jt-lighting',
    customer_name: 'Susan Lee',
    customer_email: 'susan.lee@design.com',
    customer_phone: '+1 (555) 234-5678',
    customer_address: '852 Poplar Drive, Austin, TX 78704',
    status: 'quoted' as const,
    estimated_price_low: 72000,
    estimated_price_high: 92000,
    lead_score: 75,
    source: 'website',
    source_url: null,
    answers: { 'q-lighting-type': 'a-lighting-recessed', 'q-lighting-quantity': 'a-lighting-10-plus', 'q-lighting-dimmer': 'a-lighting-dimmer-smart', 'q-lighting-recessed-size': 'a-lighting-4inch' },
    estimate_breakdown: [
      { item: 'Base Recessed Lighting', amount: 22500 },
      { item: '10+ Fixtures (150% increase)', amount: 33750 },
      { item: 'Smart Dimmers', amount: 15000 },
    ],
    notes: 'Interior designer doing kitchen remodel. Wants 12 recessed lights with smart dimming. Quote sent 12/4.',
    lead_responses: [],
    created_at: '2024-11-25T15:00:00Z',
    updated_at: '2024-12-04T14:00:00Z',
  },

  // ========== WON LEADS ==========
  {
    id: 'lead-12',
    company_id: DEMO_COMPANY.id,
    job_type_id: 'jt-outlet',
    customer_name: 'Lisa Anderson',
    customer_email: 'lisa.a@yahoo.com',
    customer_phone: '+1 (555) 345-6789',
    customer_address: '963 Ash Lane, Austin, TX 78701',
    status: 'won' as const,
    estimated_price_low: 54000,
    estimated_price_high: 69000,
    lead_score: 80,
    source: 'website',
    source_url: null,
    answers: { 'q-outlet-quantity': 'a-outlet-4-6', 'q-outlet-type': 'a-outlet-gfci', 'q-outlet-location': 'a-outlet-same-room', 'q-outlet-existing': 'a-outlet-existing-yes' },
    estimate_breakdown: [
      { item: 'Base Outlet Installation', amount: 17500 },
      { item: '4-6 Outlets', amount: 35000 },
      { item: 'GFCI Upgrade', amount: 4500 },
    ],
    notes: 'COMPLETED 12/10 - Installed 5 GFCI outlets in kitchen. Customer very satisfied. Left 5-star review.',
    lead_responses: [],
    created_at: '2024-11-20T12:00:00Z',
    updated_at: '2024-12-10T17:00:00Z',
  },
  {
    id: 'lead-13',
    company_id: DEMO_COMPANY.id,
    job_type_id: 'jt-panel',
    customer_name: 'James Wilson',
    customer_email: 'jwilson@email.com',
    customer_phone: '+1 (555) 456-7890',
    customer_address: '159 Elm Court, Austin, TX 78703',
    status: 'won' as const,
    estimated_price_low: 148500,
    estimated_price_high: 189000,
    lead_score: 92,
    source: 'google',
    source_url: null,
    answers: { 'q-panel-current': 'a-panel-100', 'q-panel-target': 'a-panel-200-target', 'q-panel-location': 'a-panel-garage', 'q-panel-permit': 'a-permit-yes' },
    estimate_breakdown: [
      { item: 'Base Panel Upgrade', amount: 150000 },
      { item: 'Permit Handling', amount: 15000 },
    ],
    notes: 'COMPLETED 12/5 - 200A Siemens panel installed. Passed inspection 12/6. Referred Amanda Thompson.',
    lead_responses: [],
    created_at: '2024-11-15T09:00:00Z',
    updated_at: '2024-12-05T15:30:00Z',
  },
  {
    id: 'lead-14',
    company_id: DEMO_COMPANY.id,
    job_type_id: 'jt-ev',
    customer_name: 'Karen Miller',
    customer_email: 'karen.m@company.org',
    customer_phone: '+1 (555) 567-8901',
    customer_address: '753 Birch Ave, Cedar Park, TX 78613',
    status: 'won' as const,
    estimated_price_low: 94500,
    estimated_price_high: 120600,
    lead_score: 88,
    source: 'referral',
    source_url: null,
    answers: { 'q-ev-charger-type': 'a-ev-level2-40', 'q-ev-distance': 'a-ev-close', 'q-ev-mounting': 'a-ev-wall', 'q-ev-panel-capacity': 'a-ev-panel-yes' },
    estimate_breakdown: [
      { item: 'Level 2 40A Charger Install', amount: 85000 },
      { item: 'Close Distance Wiring', amount: 0 },
    ],
    notes: 'COMPLETED 11/28 - Tesla Wall Connector installed. Customer happy with clean install.',
    lead_responses: [],
    created_at: '2024-11-10T14:00:00Z',
    updated_at: '2024-11-28T16:00:00Z',
  },
  {
    id: 'lead-15',
    company_id: DEMO_COMPANY.id,
    job_type_id: 'jt-lighting',
    customer_name: 'Thomas Wright',
    customer_email: 't.wright@business.com',
    customer_phone: '+1 (555) 678-9012',
    customer_address: '357 Oak Blvd, Round Rock, TX 78664',
    status: 'won' as const,
    estimated_price_low: 40500,
    estimated_price_high: 51750,
    lead_score: 70,
    source: 'website',
    source_url: null,
    answers: { 'q-lighting-type': 'a-lighting-recessed', 'q-lighting-quantity': 'a-lighting-3-5', 'q-lighting-dimmer': 'a-lighting-dimmer-yes', 'q-lighting-recessed-size': 'a-lighting-6inch' },
    estimate_breakdown: [
      { item: 'Base Recessed Lighting', amount: 22500 },
      { item: '3-5 Fixtures', amount: 15000 },
      { item: 'Dimmer Switches', amount: 8500 },
      { item: '6" Size Upgrade', amount: 2500 },
    ],
    notes: 'COMPLETED 11/22 - 4 recessed lights in home office. Added dedicated circuit for equipment.',
    lead_responses: [],
    created_at: '2024-11-05T10:00:00Z',
    updated_at: '2024-11-22T14:00:00Z',
  },
  {
    id: 'lead-16',
    company_id: DEMO_COMPANY.id,
    job_type_id: 'jt-ceiling-fan',
    customer_name: 'Nancy Taylor',
    customer_email: 'nancy.t@gmail.com',
    customer_phone: '+1 (555) 789-0123',
    customer_address: '951 Pine Court, Pflugerville, TX 78660',
    status: 'won' as const,
    estimated_price_low: 18000,
    estimated_price_high: 23000,
    lead_score: 62,
    source: 'google',
    source_url: null,
    answers: { 'q-fan-existing': 'a-fan-existing-fan', 'q-fan-quantity': 'a-fan-1', 'q-fan-control': 'a-fan-smart' },
    estimate_breakdown: [
      { item: 'Base Ceiling Fan Install', amount: 15000 },
      { item: 'Smart Home Control', amount: 8500 },
    ],
    notes: 'COMPLETED 11/18 - Replaced old fan with Hunter smart fan. Integrated with Alexa.',
    lead_responses: [],
    created_at: '2024-11-01T11:00:00Z',
    updated_at: '2024-11-18T16:30:00Z',
  },

  // ========== LOST LEADS ==========
  {
    id: 'lead-17',
    company_id: DEMO_COMPANY.id,
    job_type_id: 'jt-rewire',
    customer_name: 'Kevin Moore',
    customer_email: 'kmoore@email.com',
    customer_phone: '+1 (555) 890-1234',
    customer_address: '246 Maple Lane, Austin, TX 78704',
    status: 'lost' as const,
    estimated_price_low: 1080000,
    estimated_price_high: 1377000,
    lead_score: 45,
    source: 'website',
    source_url: null,
    answers: { 'q-rewire-sqft': 'a-rewire-medium', 'q-rewire-stories': 'a-rewire-2story', 'q-rewire-access': 'a-rewire-partial', 'q-rewire-panel': 'a-rewire-panel-yes' },
    estimate_breakdown: [
      { item: 'Base Rewiring', amount: 800000 },
      { item: '1,500-2,500 sq ft (50%)', amount: 400000 },
      { item: '2 Stories (25%)', amount: 200000 },
      { item: 'Partial Access (15%)', amount: 120000 },
      { item: '200A Panel Included', amount: 100000 },
    ],
    notes: 'LOST - Budget constraints. Customer decided to do partial rewiring with another contractor instead of full rewire.',
    lead_responses: [],
    created_at: '2024-10-20T09:00:00Z',
    updated_at: '2024-11-15T10:00:00Z',
  },
  {
    id: 'lead-18',
    company_id: DEMO_COMPANY.id,
    job_type_id: 'jt-generator',
    customer_name: 'Barbara Jackson',
    customer_email: 'bjackson@tech.com',
    customer_phone: '+1 (555) 901-2345',
    customer_address: '468 Cedar Blvd, Georgetown, TX 78626',
    status: 'lost' as const,
    estimated_price_low: 405000,
    estimated_price_high: 517000,
    lead_score: 55,
    source: 'referral',
    source_url: null,
    answers: { 'q-gen-type': 'a-gen-standby', 'q-gen-size': 'a-gen-small', 'q-gen-fuel': 'a-gen-propane', 'q-gen-transfer': 'a-gen-transfer-auto' },
    estimate_breakdown: [
      { item: 'Base Generator Install', amount: 350000 },
      { item: '10-14 kW Generator', amount: 0 },
      { item: 'Propane Setup', amount: 15000 },
    ],
    notes: 'LOST - Went with competitor offering Kohler at lower price. Follow up in 6 months for maintenance.',
    lead_responses: [],
    created_at: '2024-10-15T14:00:00Z',
    updated_at: '2024-11-01T09:30:00Z',
  },
  {
    id: 'lead-19',
    company_id: DEMO_COMPANY.id,
    job_type_id: 'jt-panel',
    customer_name: 'Steven Harris',
    customer_email: 's.harris@outlook.com',
    customer_phone: '+1 (555) 012-3456',
    customer_address: '579 Walnut Drive, Bee Cave, TX 78738',
    status: 'lost' as const,
    estimated_price_low: 162000,
    estimated_price_high: 207000,
    lead_score: 40,
    source: 'google',
    source_url: null,
    answers: { 'q-panel-current': 'a-panel-60', 'q-panel-target': 'a-panel-200-target', 'q-panel-location': 'a-panel-interior', 'q-panel-permit': 'a-permit-no' },
    estimate_breakdown: [
      { item: 'Base Panel Upgrade', amount: 150000 },
      { item: 'Older Panel (60A)', amount: 30000 },
      { item: 'Interior Location', amount: 35000 },
    ],
    notes: 'LOST - Project postponed. Selling house instead of upgrading. May reach out to new owner.',
    lead_responses: [],
    created_at: '2024-10-01T10:00:00Z',
    updated_at: '2024-10-25T11:00:00Z',
  },

  // More recent leads for better demo feel
  {
    id: 'lead-20',
    company_id: DEMO_COMPANY.id,
    job_type_id: 'jt-outlet',
    customer_name: 'Rachel Green',
    customer_email: 'rachel.g@email.com',
    customer_phone: '+1 (555) 111-2222',
    customer_address: '111 Sunset Blvd, Austin, TX 78702',
    status: 'new' as const,
    estimated_price_low: 45000,
    estimated_price_high: 57500,
    lead_score: 75,
    source: 'website',
    source_url: null,
    answers: { 'q-outlet-quantity': 'a-outlet-2-3', 'q-outlet-type': 'a-outlet-240v', 'q-outlet-location': 'a-outlet-adjacent', 'q-outlet-existing': 'a-outlet-existing-no' },
    estimate_breakdown: [
      { item: 'Base Outlet Installation', amount: 17500 },
      { item: '2-3 Outlets', amount: 15000 },
      { item: '240V Outlets', amount: 25000 },
      { item: 'New Wiring Run', amount: 12500 },
    ],
    notes: null,
    lead_responses: [],
    created_at: '2024-12-16T08:15:00Z',
    updated_at: '2024-12-16T08:15:00Z',
  },
  {
    id: 'lead-21',
    company_id: DEMO_COMPANY.id,
    job_type_id: 'jt-smart-home',
    customer_name: 'Chris Evans',
    customer_email: 'chris.e@techcompany.com',
    customer_phone: '+1 (555) 333-4444',
    customer_address: '222 Innovation Way, Austin, TX 78758',
    status: 'new' as const,
    estimated_price_low: 54000,
    estimated_price_high: 69000,
    lead_score: 82,
    source: 'google',
    source_url: null,
    answers: { 'q-smart-type': 'a-smart-switches', 'q-smart-switches': 'a-smart-11-plus', 'q-smart-hub': 'a-smart-hub-yes' },
    estimate_breakdown: [
      { item: 'Smart Home Base', amount: 30000 },
      { item: '11+ Switches (60%)', amount: 18000 },
    ],
    notes: null,
    lead_responses: [],
    created_at: '2024-12-16T07:30:00Z',
    updated_at: '2024-12-16T07:30:00Z',
  },
];

// ============================================================================
// FORMS
// ============================================================================

export const DEMO_FORMS = [
  {
    id: 'form-1',
    company_id: DEMO_COMPANY.id,
    name: 'Residential Services',
    slug: 'residential',
    description: 'Complete electrical services for homes',
    is_active: true,
    job_type_ids: ['jt-panel', 'jt-outlet', 'jt-lighting', 'jt-ev', 'jt-ceiling-fan', 'jt-smart-home'],
    settings: {
      show_price_range: true,
      require_phone: false,
      require_address: true,
      success_message: 'Thank you! We\'ll contact you within 24 hours with your detailed quote.',
    },
    created_at: '2024-02-01T10:00:00Z',
    updated_at: '2024-02-01T10:00:00Z',
  },
  {
    id: 'form-2',
    company_id: DEMO_COMPANY.id,
    name: 'Commercial Services',
    slug: 'commercial',
    description: 'For commercial and industrial electrical projects',
    is_active: true,
    job_type_ids: ['jt-panel', 'jt-rewire', 'jt-generator'],
    settings: {
      show_price_range: true,
      require_phone: true,
      require_address: true,
      success_message: 'Thank you for your commercial inquiry. A project manager will contact you within 1 business day.',
    },
    created_at: '2024-02-15T10:00:00Z',
    updated_at: '2024-02-15T10:00:00Z',
  },
];

// ============================================================================
// ANALYTICS DATA
// ============================================================================

export function getDemoStats() {
  const leads = DEMO_LEADS;
  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === 'new').length;
  const contactedLeads = leads.filter(l => l.status === 'contacted').length;
  const quotedLeads = leads.filter(l => l.status === 'quoted').length;
  const wonLeads = leads.filter(l => l.status === 'won').length;
  const lostLeads = leads.filter(l => l.status === 'lost').length;

  const estimatedRevenue = leads
    .filter(l => l.status === 'won')
    .reduce((sum, l) => sum + ((l.estimated_price_low + l.estimated_price_high) / 2), 0);

  const pipelineValue = leads
    .filter(l => ['new', 'contacted', 'quoted'].includes(l.status))
    .reduce((sum, l) => sum + ((l.estimated_price_low + l.estimated_price_high) / 2), 0);

  const avgEstimateValue = leads.length > 0
    ? leads.reduce((sum, l) => sum + ((l.estimated_price_low + l.estimated_price_high) / 2), 0) / leads.length
    : 0;

  const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;
  const closeRate = (wonLeads + lostLeads) > 0 ? Math.round((wonLeads / (wonLeads + lostLeads)) * 100) : 0;

  // Popular services
  const servicePopularity = DEMO_JOB_TYPES.map(jt => ({
    name: jt.name,
    count: leads.filter(l => l.job_type_id === jt.id).length,
    revenue: leads
      .filter(l => l.job_type_id === jt.id && l.status === 'won')
      .reduce((sum, l) => sum + ((l.estimated_price_low + l.estimated_price_high) / 2), 0),
  })).sort((a, b) => b.count - a.count);

  // Lead sources
  const leadSources = {
    website: leads.filter(l => l.source === 'website').length,
    google: leads.filter(l => l.source === 'google').length,
    referral: leads.filter(l => l.source === 'referral').length,
  };

  // Time series data (last 30 days)
  const timeSeriesData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const dateStr = date.toISOString().split('T')[0];
    const dayLeads = leads.filter(l => l.created_at.startsWith(dateStr)).length;
    return {
      date: dateStr,
      leads: dayLeads + Math.floor(Math.random() * 3), // Add some variance
      estimates: Math.floor(dayLeads * 1.5) + Math.floor(Math.random() * 2),
    };
  });

  return {
    totalLeads,
    newLeads,
    contactedLeads,
    quotedLeads,
    wonLeads,
    lostLeads,
    estimatedRevenue,
    pipelineValue,
    avgEstimateValue,
    conversionRate,
    closeRate,
    servicePopularity,
    leadSources,
    timeSeriesData,
  };
}

// ============================================================================
// DEMO USER
// ============================================================================

export const DEMO_USER = {
  id: 'demo-user-id',
  email: 'demo@instantestimator.com',
  user_metadata: {
    full_name: 'Demo User',
  },
};
