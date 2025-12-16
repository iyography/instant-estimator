import { NextResponse } from 'next/server';

export async function POST() {
  // Demo mode - return dummy response
  return NextResponse.json({ received: true }, { status: 200 });
}
