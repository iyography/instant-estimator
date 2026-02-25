import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createCheckoutSession, STRIPE_PRICES } from '@/lib/stripe/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request body
    const body = await request.json();
    const { priceType } = body as { priceType: 'monthly' | 'yearly' };

    if (!priceType || !['monthly', 'yearly'].includes(priceType)) {
      return NextResponse.json({ error: 'Invalid price type' }, { status: 400 });
    }

    // Get user's company
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id, email, stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    if (companyError || !company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const priceId = priceType === 'monthly' ? STRIPE_PRICES.monthly : STRIPE_PRICES.yearly;

    if (!priceId) {
      return NextResponse.json({ error: 'Stripe prices not configured' }, { status: 500 });
    }

    const origin = request.headers.get('origin') || 'https://scopeform.io';

    const session = await createCheckoutSession({
      companyId: company.id,
      companyEmail: company.email || user.email || '',
      stripeCustomerId: company.stripe_customer_id || undefined,
      priceId,
      successUrl: `${origin}/settings?success=true`,
      cancelUrl: `${origin}/settings?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
