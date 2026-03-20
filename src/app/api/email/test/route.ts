import { NextResponse } from 'next/server';
import { sendAllTestEmails } from '@/lib/email/resend';

export async function POST(request: Request) {
  // Only allow in development or with a specific header for safety
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const results = await sendAllTestEmails(email);

  return NextResponse.json({ success: true, results });
}
