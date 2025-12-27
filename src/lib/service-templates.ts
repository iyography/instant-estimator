// Pre-built service templates for common contractor services
// These templates include questions, answers, and pricing modifiers

export interface ServiceTemplate {
  id: string;
  name: string;
  description: string;
  industry: string;
  icon: string;
  category: 'major' | 'standard' | 'specialty';
  basePrice: number; // in cents
  minPrice: number;
  maxPrice: number;
  estimatedHours: number;
  questions: TemplateQuestion[];
}

export interface TemplateQuestion {
  id: string;
  questionText: string;
  helpText?: string;
  type: 'single_choice' | 'multiple_choice';
  required: boolean;
  order: number;
  answers: TemplateAnswer[];
}

export interface TemplateAnswer {
  id: string;
  answerText: string;
  priceModifierType: 'fixed' | 'percentage' | 'multiply';
  priceModifierValue: number;
  order: number;
}

export const SERVICE_TEMPLATES: ServiceTemplate[] = [
  // ELECTRICAL SERVICES
  {
    id: 'electrical-panel-upgrade',
    name: 'Electrical Panel Upgrade',
    description: 'Upgrade or replace main electrical service panel',
    industry: 'electrician',
    icon: 'zap',
    category: 'major',
    basePrice: 150000, // $1,500
    minPrice: 100000,
    maxPrice: 400000,
    estimatedHours: 8,
    questions: [
      {
        id: 'q1',
        questionText: 'What is your current panel amperage?',
        helpText: 'Usually found on the main breaker',
        type: 'single_choice',
        required: true,
        order: 1,
        answers: [
          { id: 'a1', answerText: '60 Amps', priceModifierType: 'percentage', priceModifierValue: 20, order: 1 },
          { id: 'a2', answerText: '100 Amps', priceModifierType: 'fixed', priceModifierValue: 0, order: 2 },
          { id: 'a3', answerText: '150 Amps', priceModifierType: 'percentage', priceModifierValue: -10, order: 3 },
          { id: 'a4', answerText: 'Not sure', priceModifierType: 'fixed', priceModifierValue: 5000, order: 4 },
        ],
      },
      {
        id: 'q2',
        questionText: 'What amperage do you need?',
        type: 'single_choice',
        required: true,
        order: 2,
        answers: [
          { id: 'a5', answerText: '100 Amps', priceModifierType: 'fixed', priceModifierValue: 0, order: 1 },
          { id: 'a6', answerText: '200 Amps', priceModifierType: 'percentage', priceModifierValue: 40, order: 2 },
          { id: 'a7', answerText: '400 Amps', priceModifierType: 'percentage', priceModifierValue: 100, order: 3 },
        ],
      },
      {
        id: 'q3',
        questionText: 'Where is your panel located?',
        type: 'single_choice',
        required: true,
        order: 3,
        answers: [
          { id: 'a8', answerText: 'Garage (easy access)', priceModifierType: 'fixed', priceModifierValue: 0, order: 1 },
          { id: 'a9', answerText: 'Basement', priceModifierType: 'fixed', priceModifierValue: 15000, order: 2 },
          { id: 'a10', answerText: 'Exterior', priceModifierType: 'fixed', priceModifierValue: 20000, order: 3 },
          { id: 'a11', answerText: 'Difficult access', priceModifierType: 'fixed', priceModifierValue: 35000, order: 4 },
        ],
      },
    ],
  },
  {
    id: 'electrical-outlet-installation',
    name: 'Outlet Installation',
    description: 'Install new electrical outlets or upgrade existing ones',
    industry: 'electrician',
    icon: 'plug',
    category: 'standard',
    basePrice: 15000, // $150 per outlet
    minPrice: 10000,
    maxPrice: 50000,
    estimatedHours: 2,
    questions: [
      {
        id: 'q1',
        questionText: 'How many outlets do you need installed?',
        type: 'single_choice',
        required: true,
        order: 1,
        answers: [
          { id: 'a1', answerText: '1 outlet', priceModifierType: 'multiply', priceModifierValue: 1, order: 1 },
          { id: 'a2', answerText: '2-3 outlets', priceModifierType: 'multiply', priceModifierValue: 2.5, order: 2 },
          { id: 'a3', answerText: '4-6 outlets', priceModifierType: 'multiply', priceModifierValue: 4.5, order: 3 },
          { id: 'a4', answerText: '7+ outlets', priceModifierType: 'multiply', priceModifierValue: 7, order: 4 },
        ],
      },
      {
        id: 'q2',
        questionText: 'What type of outlets?',
        type: 'single_choice',
        required: true,
        order: 2,
        answers: [
          { id: 'a5', answerText: 'Standard 120V', priceModifierType: 'fixed', priceModifierValue: 0, order: 1 },
          { id: 'a6', answerText: 'GFCI (bathroom/kitchen)', priceModifierType: 'fixed', priceModifierValue: 5000, order: 2 },
          { id: 'a7', answerText: '240V (appliance)', priceModifierType: 'fixed', priceModifierValue: 15000, order: 3 },
          { id: 'a8', answerText: 'USB outlets', priceModifierType: 'fixed', priceModifierValue: 3000, order: 4 },
        ],
      },
    ],
  },

  // PLUMBING SERVICES
  {
    id: 'plumbing-water-heater',
    name: 'Water Heater Installation',
    description: 'Install or replace water heater (tank or tankless)',
    industry: 'plumber',
    icon: 'flame',
    category: 'major',
    basePrice: 120000, // $1,200
    minPrice: 80000,
    maxPrice: 350000,
    estimatedHours: 6,
    questions: [
      {
        id: 'q1',
        questionText: 'What type of water heater do you want?',
        type: 'single_choice',
        required: true,
        order: 1,
        answers: [
          { id: 'a1', answerText: 'Tank (40 gallon)', priceModifierType: 'fixed', priceModifierValue: 0, order: 1 },
          { id: 'a2', answerText: 'Tank (50 gallon)', priceModifierType: 'fixed', priceModifierValue: 15000, order: 2 },
          { id: 'a3', answerText: 'Tank (75 gallon)', priceModifierType: 'fixed', priceModifierValue: 35000, order: 3 },
          { id: 'a4', answerText: 'Tankless', priceModifierType: 'percentage', priceModifierValue: 80, order: 4 },
        ],
      },
      {
        id: 'q2',
        questionText: 'Fuel type?',
        type: 'single_choice',
        required: true,
        order: 2,
        answers: [
          { id: 'a5', answerText: 'Electric', priceModifierType: 'fixed', priceModifierValue: 0, order: 1 },
          { id: 'a6', answerText: 'Gas (existing hookup)', priceModifierType: 'fixed', priceModifierValue: 10000, order: 2 },
          { id: 'a7', answerText: 'Gas (new hookup needed)', priceModifierType: 'fixed', priceModifierValue: 45000, order: 3 },
        ],
      },
      {
        id: 'q3',
        questionText: 'Is this a replacement or new installation?',
        type: 'single_choice',
        required: true,
        order: 3,
        answers: [
          { id: 'a8', answerText: 'Replacement (same location)', priceModifierType: 'fixed', priceModifierValue: 0, order: 1 },
          { id: 'a9', answerText: 'New installation', priceModifierType: 'percentage', priceModifierValue: 50, order: 2 },
          { id: 'a10', answerText: 'Relocation needed', priceModifierType: 'percentage', priceModifierValue: 75, order: 3 },
        ],
      },
    ],
  },
  {
    id: 'plumbing-drain-cleaning',
    name: 'Drain Cleaning',
    description: 'Professional drain clearing and cleaning service',
    industry: 'plumber',
    icon: 'droplets',
    category: 'standard',
    basePrice: 15000, // $150
    minPrice: 10000,
    maxPrice: 60000,
    estimatedHours: 2,
    questions: [
      {
        id: 'q1',
        questionText: 'Which drain needs cleaning?',
        type: 'single_choice',
        required: true,
        order: 1,
        answers: [
          { id: 'a1', answerText: 'Kitchen sink', priceModifierType: 'fixed', priceModifierValue: 0, order: 1 },
          { id: 'a2', answerText: 'Bathroom sink', priceModifierType: 'fixed', priceModifierValue: 0, order: 2 },
          { id: 'a3', answerText: 'Shower/tub', priceModifierType: 'fixed', priceModifierValue: 5000, order: 3 },
          { id: 'a4', answerText: 'Toilet', priceModifierType: 'fixed', priceModifierValue: 7500, order: 4 },
          { id: 'a5', answerText: 'Main sewer line', priceModifierType: 'percentage', priceModifierValue: 200, order: 5 },
        ],
      },
      {
        id: 'q2',
        questionText: 'How severe is the clog?',
        type: 'single_choice',
        required: true,
        order: 2,
        answers: [
          { id: 'a6', answerText: 'Slow draining', priceModifierType: 'fixed', priceModifierValue: 0, order: 1 },
          { id: 'a7', answerText: 'Completely blocked', priceModifierType: 'fixed', priceModifierValue: 5000, order: 2 },
          { id: 'a8', answerText: 'Recurring issue', priceModifierType: 'fixed', priceModifierValue: 10000, order: 3 },
        ],
      },
    ],
  },

  // HVAC SERVICES
  {
    id: 'hvac-ac-installation',
    name: 'AC Unit Installation',
    description: 'Install new central air conditioning system',
    industry: 'hvac',
    icon: 'snowflake',
    category: 'major',
    basePrice: 400000, // $4,000
    minPrice: 300000,
    maxPrice: 1000000,
    estimatedHours: 16,
    questions: [
      {
        id: 'q1',
        questionText: 'What size is your home?',
        type: 'single_choice',
        required: true,
        order: 1,
        answers: [
          { id: 'a1', answerText: 'Under 1,000 sq ft', priceModifierType: 'percentage', priceModifierValue: -20, order: 1 },
          { id: 'a2', answerText: '1,000 - 1,500 sq ft', priceModifierType: 'fixed', priceModifierValue: 0, order: 2 },
          { id: 'a3', answerText: '1,500 - 2,500 sq ft', priceModifierType: 'percentage', priceModifierValue: 25, order: 3 },
          { id: 'a4', answerText: '2,500 - 3,500 sq ft', priceModifierType: 'percentage', priceModifierValue: 50, order: 4 },
          { id: 'a5', answerText: 'Over 3,500 sq ft', priceModifierType: 'percentage', priceModifierValue: 80, order: 5 },
        ],
      },
      {
        id: 'q2',
        questionText: 'Do you have existing ductwork?',
        type: 'single_choice',
        required: true,
        order: 2,
        answers: [
          { id: 'a6', answerText: 'Yes, in good condition', priceModifierType: 'fixed', priceModifierValue: 0, order: 1 },
          { id: 'a7', answerText: 'Yes, needs repair', priceModifierType: 'fixed', priceModifierValue: 75000, order: 2 },
          { id: 'a8', answerText: 'No ductwork', priceModifierType: 'percentage', priceModifierValue: 100, order: 3 },
        ],
      },
      {
        id: 'q3',
        questionText: 'Efficiency level desired?',
        type: 'single_choice',
        required: true,
        order: 3,
        answers: [
          { id: 'a9', answerText: 'Standard (14 SEER)', priceModifierType: 'fixed', priceModifierValue: 0, order: 1 },
          { id: 'a10', answerText: 'High efficiency (16+ SEER)', priceModifierType: 'percentage', priceModifierValue: 30, order: 2 },
          { id: 'a11', answerText: 'Premium (20+ SEER)', priceModifierType: 'percentage', priceModifierValue: 60, order: 3 },
        ],
      },
    ],
  },

  // ROOFING SERVICES
  {
    id: 'roofing-full-replacement',
    name: 'Full Roof Replacement',
    description: 'Complete tear-off and replacement of roof',
    industry: 'roofing',
    icon: 'home',
    category: 'major',
    basePrice: 800000, // $8,000
    minPrice: 500000,
    maxPrice: 2500000,
    estimatedHours: 24,
    questions: [
      {
        id: 'q1',
        questionText: 'What is the approximate roof size?',
        type: 'single_choice',
        required: true,
        order: 1,
        answers: [
          { id: 'a1', answerText: 'Small (under 1,500 sq ft)', priceModifierType: 'percentage', priceModifierValue: -25, order: 1 },
          { id: 'a2', answerText: 'Medium (1,500 - 2,500 sq ft)', priceModifierType: 'fixed', priceModifierValue: 0, order: 2 },
          { id: 'a3', answerText: 'Large (2,500 - 3,500 sq ft)', priceModifierType: 'percentage', priceModifierValue: 35, order: 3 },
          { id: 'a4', answerText: 'Extra Large (3,500+ sq ft)', priceModifierType: 'percentage', priceModifierValue: 75, order: 4 },
        ],
      },
      {
        id: 'q2',
        questionText: 'What roofing material do you want?',
        type: 'single_choice',
        required: true,
        order: 2,
        answers: [
          { id: 'a5', answerText: 'Asphalt shingles (standard)', priceModifierType: 'fixed', priceModifierValue: 0, order: 1 },
          { id: 'a6', answerText: 'Architectural shingles', priceModifierType: 'percentage', priceModifierValue: 20, order: 2 },
          { id: 'a7', answerText: 'Metal roofing', priceModifierType: 'percentage', priceModifierValue: 75, order: 3 },
          { id: 'a8', answerText: 'Tile/slate', priceModifierType: 'percentage', priceModifierValue: 150, order: 4 },
        ],
      },
      {
        id: 'q3',
        questionText: 'Roof complexity?',
        type: 'single_choice',
        required: true,
        order: 3,
        answers: [
          { id: 'a9', answerText: 'Simple (1-2 slopes)', priceModifierType: 'fixed', priceModifierValue: 0, order: 1 },
          { id: 'a10', answerText: 'Moderate (multiple slopes)', priceModifierType: 'percentage', priceModifierValue: 15, order: 2 },
          { id: 'a11', answerText: 'Complex (steep, dormers)', priceModifierType: 'percentage', priceModifierValue: 35, order: 3 },
        ],
      },
    ],
  },
  {
    id: 'roofing-repair',
    name: 'Roof Repair',
    description: 'Repair leaks, damaged shingles, or flashing',
    industry: 'roofing',
    icon: 'wrench',
    category: 'standard',
    basePrice: 40000, // $400
    minPrice: 20000,
    maxPrice: 150000,
    estimatedHours: 4,
    questions: [
      {
        id: 'q1',
        questionText: 'What type of repair is needed?',
        type: 'single_choice',
        required: true,
        order: 1,
        answers: [
          { id: 'a1', answerText: 'Small leak repair', priceModifierType: 'fixed', priceModifierValue: 0, order: 1 },
          { id: 'a2', answerText: 'Missing/damaged shingles', priceModifierType: 'fixed', priceModifierValue: 10000, order: 2 },
          { id: 'a3', answerText: 'Flashing repair', priceModifierType: 'fixed', priceModifierValue: 15000, order: 3 },
          { id: 'a4', answerText: 'Storm damage', priceModifierType: 'percentage', priceModifierValue: 75, order: 4 },
        ],
      },
      {
        id: 'q2',
        questionText: 'How large is the damaged area?',
        type: 'single_choice',
        required: true,
        order: 2,
        answers: [
          { id: 'a5', answerText: 'Small (under 50 sq ft)', priceModifierType: 'fixed', priceModifierValue: 0, order: 1 },
          { id: 'a6', answerText: 'Medium (50-200 sq ft)', priceModifierType: 'percentage', priceModifierValue: 50, order: 2 },
          { id: 'a7', answerText: 'Large (200+ sq ft)', priceModifierType: 'percentage', priceModifierValue: 150, order: 3 },
        ],
      },
    ],
  },

  // PAINTING SERVICES
  {
    id: 'painting-interior',
    name: 'Interior Painting',
    description: 'Professional interior painting service',
    industry: 'painter',
    icon: 'paintbrush',
    category: 'standard',
    basePrice: 30000, // $300 per room
    minPrice: 20000,
    maxPrice: 500000,
    estimatedHours: 8,
    questions: [
      {
        id: 'q1',
        questionText: 'How many rooms need painting?',
        type: 'single_choice',
        required: true,
        order: 1,
        answers: [
          { id: 'a1', answerText: '1 room', priceModifierType: 'multiply', priceModifierValue: 1, order: 1 },
          { id: 'a2', answerText: '2-3 rooms', priceModifierType: 'multiply', priceModifierValue: 2.5, order: 2 },
          { id: 'a3', answerText: '4-6 rooms', priceModifierType: 'multiply', priceModifierValue: 4.5, order: 3 },
          { id: 'a4', answerText: 'Whole house', priceModifierType: 'multiply', priceModifierValue: 10, order: 4 },
        ],
      },
      {
        id: 'q2',
        questionText: 'What needs to be painted?',
        type: 'single_choice',
        required: true,
        order: 2,
        answers: [
          { id: 'a5', answerText: 'Walls only', priceModifierType: 'fixed', priceModifierValue: 0, order: 1 },
          { id: 'a6', answerText: 'Walls and ceiling', priceModifierType: 'percentage', priceModifierValue: 40, order: 2 },
          { id: 'a7', answerText: 'Walls, ceiling, and trim', priceModifierType: 'percentage', priceModifierValue: 75, order: 3 },
        ],
      },
      {
        id: 'q3',
        questionText: 'Paint quality?',
        type: 'single_choice',
        required: true,
        order: 3,
        answers: [
          { id: 'a8', answerText: 'Standard', priceModifierType: 'fixed', priceModifierValue: 0, order: 1 },
          { id: 'a9', answerText: 'Premium', priceModifierType: 'percentage', priceModifierValue: 25, order: 2 },
          { id: 'a10', answerText: 'Ultra Premium', priceModifierType: 'percentage', priceModifierValue: 50, order: 3 },
        ],
      },
    ],
  },

  // LANDSCAPING SERVICES
  {
    id: 'landscaping-lawn-care',
    name: 'Lawn Care Package',
    description: 'Regular lawn maintenance and care',
    industry: 'landscaper',
    icon: 'tree-deciduous',
    category: 'standard',
    basePrice: 7500, // $75 per visit
    minPrice: 5000,
    maxPrice: 30000,
    estimatedHours: 2,
    questions: [
      {
        id: 'q1',
        questionText: 'What is your lawn size?',
        type: 'single_choice',
        required: true,
        order: 1,
        answers: [
          { id: 'a1', answerText: 'Small (under 5,000 sq ft)', priceModifierType: 'fixed', priceModifierValue: 0, order: 1 },
          { id: 'a2', answerText: 'Medium (5,000 - 10,000 sq ft)', priceModifierType: 'percentage', priceModifierValue: 50, order: 2 },
          { id: 'a3', answerText: 'Large (10,000 - 20,000 sq ft)', priceModifierType: 'percentage', priceModifierValue: 100, order: 3 },
          { id: 'a4', answerText: 'Extra Large (20,000+ sq ft)', priceModifierType: 'percentage', priceModifierValue: 175, order: 4 },
        ],
      },
      {
        id: 'q2',
        questionText: 'What services do you need?',
        type: 'single_choice',
        required: true,
        order: 2,
        answers: [
          { id: 'a5', answerText: 'Mowing only', priceModifierType: 'fixed', priceModifierValue: 0, order: 1 },
          { id: 'a6', answerText: 'Mowing + edging', priceModifierType: 'fixed', priceModifierValue: 2500, order: 2 },
          { id: 'a7', answerText: 'Full service (mow, edge, trim, blow)', priceModifierType: 'percentage', priceModifierValue: 50, order: 3 },
        ],
      },
    ],
  },

  // CLEANING SERVICES
  {
    id: 'cleaning-deep-clean',
    name: 'Deep House Cleaning',
    description: 'Thorough deep cleaning service',
    industry: 'cleaning',
    icon: 'sparkles',
    category: 'standard',
    basePrice: 25000, // $250
    minPrice: 15000,
    maxPrice: 80000,
    estimatedHours: 6,
    questions: [
      {
        id: 'q1',
        questionText: 'How many bedrooms?',
        type: 'single_choice',
        required: true,
        order: 1,
        answers: [
          { id: 'a1', answerText: '1-2 bedrooms', priceModifierType: 'fixed', priceModifierValue: 0, order: 1 },
          { id: 'a2', answerText: '3 bedrooms', priceModifierType: 'percentage', priceModifierValue: 25, order: 2 },
          { id: 'a3', answerText: '4 bedrooms', priceModifierType: 'percentage', priceModifierValue: 50, order: 3 },
          { id: 'a4', answerText: '5+ bedrooms', priceModifierType: 'percentage', priceModifierValue: 75, order: 4 },
        ],
      },
      {
        id: 'q2',
        questionText: 'How many bathrooms?',
        type: 'single_choice',
        required: true,
        order: 2,
        answers: [
          { id: 'a5', answerText: '1 bathroom', priceModifierType: 'fixed', priceModifierValue: 0, order: 1 },
          { id: 'a6', answerText: '2 bathrooms', priceModifierType: 'fixed', priceModifierValue: 5000, order: 2 },
          { id: 'a7', answerText: '3 bathrooms', priceModifierType: 'fixed', priceModifierValue: 10000, order: 3 },
          { id: 'a8', answerText: '4+ bathrooms', priceModifierType: 'fixed', priceModifierValue: 15000, order: 4 },
        ],
      },
      {
        id: 'q3',
        questionText: 'Current condition?',
        type: 'single_choice',
        required: true,
        order: 3,
        answers: [
          { id: 'a9', answerText: 'Regular maintenance needed', priceModifierType: 'fixed', priceModifierValue: 0, order: 1 },
          { id: 'a10', answerText: 'Hasn\'t been cleaned in months', priceModifierType: 'percentage', priceModifierValue: 50, order: 2 },
          { id: 'a11', answerText: 'Post-construction/renovation', priceModifierType: 'percentage', priceModifierValue: 100, order: 3 },
        ],
      },
    ],
  },
];

// Helper function to get templates by industry
export function getTemplatesByIndustry(industry: string): ServiceTemplate[] {
  return SERVICE_TEMPLATES.filter(t => t.industry === industry);
}

// Helper function to get all unique industries
export function getTemplateIndustries(): string[] {
  return [...new Set(SERVICE_TEMPLATES.map(t => t.industry))];
}

// Helper function to get a template by ID
export function getTemplateById(id: string): ServiceTemplate | undefined {
  return SERVICE_TEMPLATES.find(t => t.id === id);
}
