import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateSuggestions } from '@/lib/ai/suggestions';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import type { AISuggestionRequest } from '@/types/database';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rl = checkRateLimit(`ai:${ip}`, 10, 60_000);
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body: AISuggestionRequest = await request.json();

    if (!body.industry || !body.job_type_name || !body.language) {
      return NextResponse.json(
        { error: 'Missing required fields: industry, job_type_name, language' },
        { status: 400 }
      );
    }

    const questions = await generateSuggestions(body);

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('AI suggestion error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate suggestions' },
      { status: 500 }
    );
  }
}
