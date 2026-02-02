import { z } from 'zod';

// Base types
export const industrySchema = z.enum([
  'electrician',
  'plumber',
  'hvac',
  'general_contractor',
  'painter',
  'landscaper',
  'roofing',
  'cleaning',
  'other',
]);

export const currencySchema = z.enum(['SEK', 'EUR', 'USD']);

export const languageSchema = z.enum(['sv', 'en']);

export const leadStatusSchema = z.enum(['new', 'contacted', 'quoted', 'won', 'lost']);

export const questionTypeSchema = z.enum([
  'multiple_choice',
  'single_choice',
  'number_input',
  'text_input',
  'quantity',
]);

export const priceModifierTypeSchema = z.enum([
  'fixed_add',
  'fixed_subtract',
  'percentage_add',
  'percentage_subtract',
  'multiply',
  'fixed',
  'percentage',
  'per_unit',
]);

// Lead creation request schema
export const createLeadRequestSchema = z.object({
  company_id: z.string().min(1, 'Company ID is required'),
  job_type_id: z.string().min(1, 'Job type ID is required'),
  form_id: z.string().optional(),
  customer_name: z
    .string()
    .min(1, 'Name is required')
    .max(200, 'Name must be less than 200 characters')
    .trim(),
  customer_email: z
    .string()
    .email('Invalid email address')
    .max(254, 'Email must be less than 254 characters')
    .toLowerCase()
    .trim(),
  customer_phone: z
    .string()
    .max(50, 'Phone number must be less than 50 characters')
    .trim()
    .optional()
    .transform((val) => val || undefined),
  customer_address: z
    .string()
    .max(500, 'Address must be less than 500 characters')
    .trim()
    .optional()
    .transform((val) => val || undefined),
  responses: z.array(
    z.object({
      question_id: z.string().min(1),
      answer_option_id: z.string().optional(),
      raw_answer: z.string().max(2000).optional(),
    })
  ),
  source_url: z.string().url().max(2000).optional(),
});

export type CreateLeadRequest = z.infer<typeof createLeadRequestSchema>;

// AI Suggestion request schema
export const aiSuggestionRequestSchema = z.object({
  industry: industrySchema,
  job_type_name: z
    .string()
    .min(1, 'Job type name is required')
    .max(200, 'Job type name must be less than 200 characters')
    .trim(),
  language: languageSchema,
  existing_questions: z.array(z.string()).optional(),
});

export type AISuggestionRequest = z.infer<typeof aiSuggestionRequestSchema>;

// Billing/checkout request schema
export const checkoutRequestSchema = z.object({
  plan: z.enum(['monthly', 'annual']),
  return_url: z.string().url().optional(),
});

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;

// Company settings schema
export const companySettingsSchema = z.object({
  estimate_range_low_percentage: z.number().min(0).max(100).optional(),
  estimate_range_high_percentage: z.number().min(0).max(100).optional(),
  notification_email: z.string().email().optional(),
  widget_primary_color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color')
    .optional(),
  widget_font_family: z.string().max(100).optional(),
  allowed_domains: z.array(z.string().max(253)).optional(),
});

export type CompanySettings = z.infer<typeof companySettingsSchema>;

// Sanitize HTML from strings to prevent XSS
export function sanitizeString(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

// Validate and parse request body with error handling
export async function validateRequestBody<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      // Zod v4 uses .issues instead of .errors
      const issues = result.error.issues || [];
      const errors = issues.map((e) => e.message).join(', ');
      return { success: false, error: errors || 'Validation failed' };
    }

    return { success: true, data: result.data };
  } catch {
    return { success: false, error: 'Invalid JSON in request body' };
  }
}
