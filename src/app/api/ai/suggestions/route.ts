import { NextResponse } from 'next/server';
import { generateSuggestions } from '@/lib/ai/suggestions';
import type { AISuggestionRequest } from '@/types/database';

export async function POST(request: Request) {
  try {
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
