export type Industry =
  | 'electrician'
  | 'plumber'
  | 'hvac'
  | 'general_contractor'
  | 'painter'
  | 'landscaper'
  | 'roofing'
  | 'cleaning'
  | 'other';

export type Currency = 'SEK' | 'EUR' | 'USD';

export type Language = 'sv' | 'en';

export type SubscriptionStatus = 'trial' | 'active' | 'past_due' | 'canceled' | 'inactive';

export type QuestionType = 'multiple_choice' | 'single_choice' | 'number_input' | 'text_input' | 'quantity';

export type PriceModifierType =
  | 'fixed_add'
  | 'fixed_subtract'
  | 'percentage_add'
  | 'percentage_subtract'
  | 'multiply'
  | 'fixed'
  | 'percentage'
  | 'per_unit';

export type LeadStatus = 'new' | 'contacted' | 'quoted' | 'won' | 'lost';

export interface CompanySettings {
  estimate_range_low_percentage?: number;
  estimate_range_high_percentage?: number;
  notification_email?: string;
  widget_primary_color?: string;
  widget_font_family?: string;
  allowed_domains?: string[];
}

export interface Company {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  website_url: string | null;
  industry: Industry;
  default_currency: Currency;
  default_language: Language;
  stripe_customer_id: string | null;
  subscription_status: SubscriptionStatus;
  settings: CompanySettings;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface JobType {
  id: string;
  company_id: string;
  name: string;
  name_sv: string | null;
  description: string | null;
  description_sv: string | null;
  base_price: number; // stored in smallest currency unit
  min_price?: number; // minimum price floor
  max_price?: number; // maximum price ceiling
  estimated_hours?: number; // estimated labor hours
  icon?: string; // lucide icon name
  category?: 'major' | 'standard' | 'specialty';
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  job_type_id: string;
  question_text: string;
  question_text_sv: string | null;
  question_type: QuestionType;
  is_required: boolean;
  display_order: number;
  ai_generated: boolean;
  created_at: string;
  updated_at: string;
}

export interface AnswerOption {
  id: string;
  question_id: string;
  answer_text: string;
  answer_text_sv: string | null;
  price_modifier_type: PriceModifierType;
  price_modifier_value: number;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  company_id: string;
  job_type_id: string;
  form_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  customer_address: string | null;
  estimated_price_low: number;
  estimated_price_high: number;
  status: LeadStatus;
  notes: string | null;
  source_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadResponse {
  id: string;
  lead_id: string;
  question_id: string;
  answer_option_id: string | null;
  raw_answer: string | null;
  created_at: string;
}

export interface FormStyling {
  primary_color?: string;
  background_color?: string;
  text_color?: string;
  font_family?: string;
  border_radius?: number;
  logo_url?: string;
}

export interface EstimatorForm {
  id: string;
  company_id: string;
  name: string;
  slug: string;
  is_active: boolean;
  styling: FormStyling;
  job_type_ids: string[];
  created_at: string;
  updated_at: string;
}

// Extended types with relations
export interface QuestionWithOptions extends Question {
  answer_options: AnswerOption[];
}

export interface JobTypeWithQuestions extends JobType {
  questions: QuestionWithOptions[];
}

export interface LeadWithResponses extends Lead {
  lead_responses: (LeadResponse & {
    question?: Question;
    answer_option?: AnswerOption;
  })[];
  job_type?: JobType;
}

export interface EstimatorFormWithJobTypes extends EstimatorForm {
  job_types: JobType[];
}

// API request/response types
export interface CreateLeadRequest {
  company_id: string;
  job_type_id: string;
  form_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_address?: string;
  responses: {
    question_id: string;
    answer_option_id?: string;
    raw_answer?: string;
  }[];
  source_url?: string;
}

export interface EstimateResult {
  base_price: number;
  final_price: number;
  price_low: number;
  price_high: number;
  currency: Currency;
  modifiers_applied: {
    question_id: string;
    modifier_type: PriceModifierType;
    modifier_value: number;
    price_before: number;
    price_after: number;
  }[];
}

export interface AISuggestionRequest {
  industry: Industry;
  job_type_name: string;
  language: Language;
  existing_questions?: string[];
}

export interface AISuggestedQuestion {
  question_text: string;
  question_type: QuestionType;
  answer_options: {
    answer_text: string;
    price_modifier_type: PriceModifierType;
    price_modifier_value: number;
  }[];
}

export interface AISuggestionResponse {
  questions: AISuggestedQuestion[];
}
