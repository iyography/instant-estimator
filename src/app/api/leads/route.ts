import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createLeadRequestSchema, validateRequestBody } from '@/lib/validations';
import { calculateEstimate } from '@/lib/pricing-engine';
import { sendNewLeadNotification } from '@/lib/email/resend';
import { calculateLeadValue } from '@/lib/lead-scoring';
import type { AnswerOption, JobType, CompanySettings, Currency } from '@/types/database';

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

  // Fetch job type, company settings, and selected answer options for pricing
  let estimatedPriceLow = 0;
  let estimatedPriceHigh = 0;

  const answerOptionIds = data.responses
    .map(r => r.answer_option_id)
    .filter((id): id is string => !!id);

  if (answerOptionIds.length > 0) {
    const [jobTypeResult, companyResult, answersResult] = await Promise.all([
      supabase.from('job_types').select('*').eq('id', data.job_type_id).single(),
      supabase.from('companies').select('settings, currency').eq('id', data.company_id).single(),
      supabase.from('answer_options').select('*').in('id', answerOptionIds),
    ]);

    if (jobTypeResult.data && companyResult.data && answersResult.data) {
      const estimate = calculateEstimate(
        jobTypeResult.data as JobType,
        answersResult.data as AnswerOption[],
        (companyResult.data.settings || {}) as CompanySettings,
        companyResult.data.currency || 'USD'
      );
      estimatedPriceLow = estimate.price_low;
      estimatedPriceHigh = estimate.price_high;
    }
  }

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
      estimated_price_low: estimatedPriceLow,
      estimated_price_high: estimatedPriceHigh,
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

    const { error: responsesError } = await supabase.from('lead_responses').insert(responses);
    if (responsesError) {
      console.error('Failed to insert lead responses:', responsesError.message);
    }
  }

  // Send email notification (non-blocking)
  (async () => {
    try {
      // Fetch company details for the notification
      const { data: companyData } = await supabase
        .from('companies')
        .select('name, email, notification_email, currency')
        .eq('id', data.company_id)
        .single();

      const { data: jobTypeData } = await supabase
        .from('job_types')
        .select('name')
        .eq('id', data.job_type_id)
        .single();

      if (companyData && (companyData.email || companyData.notification_email)) {
        const currency = companyData.currency as Currency || 'USD';
        const currencySymbol = { USD: '$', EUR: '\u20AC', SEK: '' }[currency] || '$';
        const currencySuffix = currency === 'SEK' ? ' kr' : '';

        const formatPrice = (cents: number) => {
          const amount = Math.round(cents / 100);
          return `${currencySymbol}${amount.toLocaleString()}${currencySuffix}`;
        };

        const leadValue = calculateLeadValue(
          { estimated_price_low: estimatedPriceLow, estimated_price_high: estimatedPriceHigh } as Parameters<typeof calculateLeadValue>[0],
          currency
        );

        await sendNewLeadNotification({
          companyName: companyData.name,
          companyEmail: companyData.email || '',
          notificationEmail: companyData.notification_email || undefined,
          customerName: data.customer_name,
          customerEmail: data.customer_email,
          customerPhone: data.customer_phone || undefined,
          customerAddress: data.customer_address || undefined,
          jobTypeName: jobTypeData?.name || 'Unknown Service',
          estimateLow: formatPrice(estimatedPriceLow),
          estimateHigh: formatPrice(estimatedPriceHigh),
          leadValue,
          dashboardUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://scopeform.io',
        });
      }
    } catch (emailError) {
      console.error('Failed to send lead notification email:', emailError);
    }
  })();

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
