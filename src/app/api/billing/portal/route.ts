import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createCustomerPortalSession } from '@/lib/stripe/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's company
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    if (companyError || !company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    if (!company.stripe_customer_id) {
      return NextResponse.json({ error: 'No active subscription' }, { status: 400 });
    }

    const origin = request.headers.get('origin') || 'https://scopeform.io';

    const session = await createCustomerPortalSession(
      company.stripe_customer_id,
      `${origin}/settings`
    );

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Portal error:', error);
    return NextResponse.json({ error: 'Failed to create portal session' }, { status: 500 });
  }
}
