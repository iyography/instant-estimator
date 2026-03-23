import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendWelcomeEmail } from '@/lib/email/resend';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rl = checkRateLimit(`welcome:${ip}`, 3, 60_000);
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: company } = await supabase
    .from('companies')
    .select('name, email')
    .eq('user_id', user.id)
    .single();

  if (!company) {
    return NextResponse.json({ error: 'Company not found' }, { status: 404 });
  }

  const email = company.email || user.email;
  if (!email) {
    return NextResponse.json({ error: 'No email found' }, { status: 400 });
  }

  const result = await sendWelcomeEmail({
    companyName: company.name,
    email,
    dashboardUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://scopeform.io',
  });

  return NextResponse.json(result);
}
