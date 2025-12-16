import { NextResponse } from 'next/server';

export async function POST() {
  // Demo mode - return dummy response
  return NextResponse.json({ message: 'Demo mode - billing not available' }, { status: 200 });
}
