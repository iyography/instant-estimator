import { NextResponse } from 'next/server';

export async function POST() {
  // Demo mode - simulate successful lead creation
  return NextResponse.json({
    success: true,
    lead: {
      id: `demo-${Date.now()}`,
      estimated_price_low: 150000,
      estimated_price_high: 200000,
    },
  });
}

export async function GET() {
  // Demo mode - return empty array
  return NextResponse.json({ leads: [] });
}
