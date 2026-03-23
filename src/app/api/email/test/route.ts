import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendAllTestEmails } from '@/lib/email/resend';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rl = checkRateLimit(`email-test:${ip}`, 3, 60_000);
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  // Require authentication
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const results = await sendAllTestEmails(email);

  return NextResponse.json({ success: true, results });
}
