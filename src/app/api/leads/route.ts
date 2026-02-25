import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createLeadRequestSchema, validateRequestBody } from '@/lib/validations';

export async function POST(request: Request) {
  const validation = await validateRequestBody(request, createLeadRequestSchema);

  if (!validation.success) {
    return NextResponse.json(
      { success: false, error: validation.error },
      { status: 400 }
    );
  }

  const data = validation.data;
  const supabase = await createClient();

  // Insert the lead
  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .insert({
      company_id: data.company_id,
      job_type_id: data.job_type_id,
      form_id: data.form_id || null,
      customer_name: data.customer_name,
      customer_email: data.customer_email,
      customer_phone: data.customer_phone || null,
      customer_address: data.customer_address || null,
      estimated_price_low: 0,
      estimated_price_high: 0,
      source_url: data.source_url || null,
    })
    .select()
    .single();

  if (leadError) {
    return NextResponse.json(
      { success: false, error: leadError.message },
      { status: 500 }
    );
  }

  // Insert lead responses if provided
  if (data.responses?.length) {
    const responses = data.responses.map((r: { question_id: string; answer_option_id?: string; raw_answer?: string }) => ({
      lead_id: lead.id,
      question_id: r.question_id,
      answer_option_id: r.answer_option_id || null,
      raw_answer: r.raw_answer || null,
    }));

    await supabase.from('lead_responses').insert(responses);
  }

  return NextResponse.json({ success: true, lead });
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ leads: [] });
  }

  // Get company for the user
  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!company) {
    return NextResponse.json({ leads: [] });
  }

  const { data: leads } = await supabase
    .from('leads')
    .select('*, lead_responses(*)')
    .eq('company_id', company.id)
    .order('created_at', { ascending: false });

  return NextResponse.json({ leads: leads || [] });
}
