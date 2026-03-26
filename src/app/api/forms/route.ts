import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { jobType, questions, companyId } = body;

    if (!companyId || !jobType?.name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify company belongs to user
    const { data: company } = await supabase
      .from('companies')
      .select('id')
      .eq('id', companyId)
      .eq('user_id', user.id)
      .single();

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Check if we're updating an existing job_type or creating new
    const existingId = jobType.id;
    const isExisting = existingId && !existingId.startsWith('est-') && !existingId.startsWith('new');

    let jobTypeId: string;

    if (isExisting) {
      // Update existing job type
      const { error: updateError } = await supabase
        .from('job_types')
        .update({
          name: jobType.name,
          name_sv: jobType.name_sv || null,
          description: jobType.description || null,
          description_sv: jobType.description_sv || null,
          base_price: jobType.base_price || 0,
          min_price: jobType.min_price || null,
          max_price: jobType.max_price || null,
          estimated_hours: jobType.estimated_hours || null,
          is_active: jobType.is_active ?? true,
          display_order: jobType.display_order ?? 0,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingId)
        .eq('company_id', companyId);

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      jobTypeId = existingId;

      // Delete existing questions and answer options (cascade will handle answer_options)
      await supabase
        .from('questions')
        .delete()
        .eq('job_type_id', jobTypeId);
    } else {
      // Create new job type
      const { data: newJobType, error: insertError } = await supabase
        .from('job_types')
        .insert({
          company_id: companyId,
          name: jobType.name,
          name_sv: jobType.name_sv || null,
          description: jobType.description || null,
          description_sv: jobType.description_sv || null,
          base_price: jobType.base_price || 0,
          min_price: jobType.min_price || null,
          max_price: jobType.max_price || null,
          estimated_hours: jobType.estimated_hours || null,
          is_active: jobType.is_active ?? true,
          display_order: jobType.display_order ?? 0,
        })
        .select()
        .single();

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }

      jobTypeId = newJobType.id;
    }

    // Insert questions and their answer options
    if (questions && questions.length > 0) {
      for (const question of questions) {
        const { data: newQuestion, error: qError } = await supabase
          .from('questions')
          .insert({
            job_type_id: jobTypeId,
            question_text: question.question_text,
            question_text_sv: question.question_text_sv || null,
            question_type: question.question_type || 'single_choice',
            is_required: question.is_required ?? true,
            display_order: question.display_order ?? 0,
            ai_generated: question.ai_generated ?? false,
          })
          .select()
          .single();

        if (qError) {
          console.error('Error inserting question:', qError);
          continue;
        }

        // Insert answer options for this question
        if (question.answer_options && question.answer_options.length > 0) {
          const answerOptions = question.answer_options.map((ao: any) => ({
            question_id: newQuestion.id,
            answer_text: ao.answer_text,
            answer_text_sv: ao.answer_text_sv || null,
            price_modifier_type: ao.price_modifier_type || 'fixed',
            price_modifier_value: ao.price_modifier_value || 0,
            display_order: ao.display_order ?? 0,
          }));

          const { error: aoError } = await supabase
            .from('answer_options')
            .insert(answerOptions);

          if (aoError) {
            console.error('Error inserting answer options:', aoError);
          }
        }
      }
    }

    return NextResponse.json({ id: jobTypeId, success: true });
  } catch (error) {
    console.error('Form save error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
