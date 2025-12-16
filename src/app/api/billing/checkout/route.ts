import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createCheckoutSession, STRIPE_PRICES } from '@/lib/stripe/server';

export async function POST(request: Request) {
  try {
    const { priceType } = await request.json();

    if (!priceType || !['monthly', 'yearly'].includes(priceType)) {
      return NextResponse.json(
        { error: 'Invalid price type' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get company for this user
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (companyError || !company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    const priceId = priceType === 'monthly'
      ? STRIPE_PRICES.monthly
      : STRIPE_PRICES.yearly;

    if (!priceId) {
      return NextResponse.json(
        { error: 'Stripe prices not configured' },
        { status: 500 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const session = await createCheckoutSession({
      companyId: company.id,
      companyEmail: company.email,
      stripeCustomerId: company.stripe_customer_id || undefined,
      priceId,
      successUrl: `${appUrl}/settings?checkout=success`,
      cancelUrl: `${appUrl}/settings?checkout=canceled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
