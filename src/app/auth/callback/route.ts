import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const redirect = searchParams.get('redirect') || '/overview';

  // Demo mode - just redirect to the requested page
  return NextResponse.redirect(`${origin}${redirect}`);
}
