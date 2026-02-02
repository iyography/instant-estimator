import { NextResponse } from 'next/server';
import { createLeadRequestSchema, validateRequestBody } from '@/lib/validations';

export async function POST(request: Request) {
  // Validate request body
  const validation = await validateRequestBody(request, createLeadRequestSchema);

  if (!validation.success) {
    return NextResponse.json(
      { success: false, error: validation.error },
      { status: 400 }
    );
  }

  const data = validation.data;

  // Demo mode - simulate successful lead creation
  // In production, this would save to the database
  return NextResponse.json({
    success: true,
    lead: {
      id: `lead-${Date.now()}`,
      company_id: data.company_id,
      job_type_id: data.job_type_id,
      customer_name: data.customer_name,
      customer_email: data.customer_email,
      estimated_price_low: 150000,
      estimated_price_high: 200000,
      status: 'new',
      created_at: new Date().toISOString(),
    },
  });
}

export async function GET() {
  // Demo mode - return empty array
  // In production, this would fetch leads from the database with authentication
  return NextResponse.json({ leads: [] });
}
