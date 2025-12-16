import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { calculateEstimate } from '@/lib/pricing-engine';
import { sendNewLeadNotification } from '@/lib/email/resend';
import { calculateLeadValue } from '@/lib/lead-scoring';
import { formatCurrency } from '@/lib/utils';
import type { CreateLeadRequest, AnswerOption, Currency, Language } from '@/types/database';

// Rate limiting (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 10; // 10 requests per minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: Request) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body: CreateLeadRequest = await request.json();

    // Validate required fields
    if (!body.company_id || !body.job_type_id || !body.customer_name || !body.customer_email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.customer_email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const supabase = await createServiceClient();

    // Fetch company and job type for estimate calculation
    const [companyRes, jobTypeRes] = await Promise.all([
      supabase.from('companies').select('*').eq('id', body.company_id).single(),
      supabase.from('job_types').select('*').eq('id', body.job_type_id).single(),
    ]);

    if (companyRes.error || !companyRes.data) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    if (jobTypeRes.error || !jobTypeRes.data) {
      return NextResponse.json({ error: 'Job type not found' }, { status: 404 });
    }

    const company = companyRes.data;
    const jobType = jobTypeRes.data;

    // Fetch selected answer options for estimate calculation
    const answerOptionIds = body.responses
      .filter((r) => r.answer_option_id)
      .map((r) => r.answer_option_id);

    let selectedAnswers: AnswerOption[] = [];
    if (answerOptionIds.length > 0) {
      const { data: answersData } = await supabase
        .from('answer_options')
        .select('*')
        .in('id', answerOptionIds);

      if (answersData) {
        selectedAnswers = answersData;
      }
    }

    // Calculate estimate
    const estimate = calculateEstimate(
      jobType,
      selectedAnswers,
      company.settings || {},
      company.default_currency
    );

    // Create the lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        company_id: body.company_id,
        job_type_id: body.job_type_id,
        form_id: body.form_id,
        customer_name: body.customer_name,
        customer_email: body.customer_email,
        customer_phone: body.customer_phone || null,
        customer_address: body.customer_address || null,
        estimated_price_low: estimate.price_low,
        estimated_price_high: estimate.price_high,
        status: 'new',
        source_url: body.source_url || null,
      })
      .select()
      .single();

    if (leadError) {
      console.error('Failed to create lead:', leadError);
      return NextResponse.json(
        { error: 'Failed to create lead' },
        { status: 500 }
      );
    }

    // Create lead responses
    if (body.responses.length > 0) {
      const responses = body.responses.map((r) => ({
        lead_id: lead.id,
        question_id: r.question_id,
        answer_option_id: r.answer_option_id || null,
        raw_answer: r.raw_answer || null,
      }));

      const { error: responsesError } = await supabase
        .from('lead_responses')
        .insert(responses);

      if (responsesError) {
        console.error('Failed to create lead responses:', responsesError);
        // Don't fail the whole request, lead was already created
      }
    }

    // Send email notification to contractor
    const currency = company.default_currency as Currency;
    const language = company.default_language as Language;
    const leadValue = calculateLeadValue(lead, currency);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Send notification asynchronously (don't block the response)
    sendNewLeadNotification({
      companyName: company.name,
      companyEmail: company.email,
      notificationEmail: company.settings?.notification_email,
      customerName: body.customer_name,
      customerEmail: body.customer_email,
      customerPhone: body.customer_phone,
      customerAddress: body.customer_address,
      jobTypeName: jobType.name,
      estimateLow: formatCurrency(estimate.price_low, currency, language),
      estimateHigh: formatCurrency(estimate.price_high, currency, language),
      leadValue,
      dashboardUrl: `${appUrl}/leads/${lead.id}`,
    }).catch((error) => {
      console.error('Failed to send lead notification:', error);
    });

    return NextResponse.json({
      success: true,
      lead_id: lead.id,
      estimate: {
        low: estimate.price_low,
        high: estimate.price_high,
        currency: company.default_currency,
      },
    });
  } catch (error) {
    console.error('Lead submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
