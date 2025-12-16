import { notFound } from 'next/navigation';
import { createServiceClient } from '@/lib/supabase/server';
import { EstimatorPage } from '@/components/estimator/estimator-page';
import { DEMO_MODE, DEMO_COMPANY, DEMO_JOB_TYPES, DEMO_QUESTIONS, DEMO_ANSWERS } from '@/lib/demo/data';

interface Props {
  params: Promise<{
    companySlug: string;
  }>;
}

// Build demo job types with nested questions and answers
function getDemoJobTypesWithQuestions() {
  return DEMO_JOB_TYPES.filter(jt => jt.is_active).map(jt => {
    const questions = DEMO_QUESTIONS.filter(q => q.job_type_id === jt.id).map(q => ({
      ...q,
      answer_options: DEMO_ANSWERS.filter(a => a.question_id === q.id).sort(
        (a, b) => a.display_order - b.display_order
      ),
    })).sort((a, b) => a.display_order - b.display_order);

    return {
      ...jt,
      questions,
    };
  });
}

export default async function PublicEstimatorPage({ params }: Props) {
  const { companySlug } = await params;

  // Demo mode - check for demo company slug
  if (DEMO_MODE && companySlug === DEMO_COMPANY.slug) {
    const demoJobTypes = getDemoJobTypesWithQuestions();
    return <EstimatorPage company={DEMO_COMPANY as any} jobTypes={demoJobTypes as any} />;
  }

  const supabase = await createServiceClient();

  // Fetch company by slug
  const { data: company, error: companyError } = await supabase
    .from('companies')
    .select('*')
    .eq('slug', companySlug)
    .single();

  if (companyError || !company) {
    // In demo mode, redirect unknown slugs to demo company
    if (DEMO_MODE) {
      const demoJobTypes = getDemoJobTypesWithQuestions();
      return <EstimatorPage company={DEMO_COMPANY as any} jobTypes={demoJobTypes as any} />;
    }
    notFound();
  }

  // Fetch active job types with questions and answer options
  const { data: jobTypes, error: jobTypesError } = await supabase
    .from('job_types')
    .select(`
      *,
      questions (
        *,
        answer_options (*)
      )
    `)
    .eq('company_id', company.id)
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (jobTypesError) {
    console.error('Failed to fetch job types:', jobTypesError);
    notFound();
  }

  // Sort questions and answer options
  const sortedJobTypes = (jobTypes || []).map((jt) => ({
    ...jt,
    questions: (jt.questions || [])
      .sort((a: { display_order: number }, b: { display_order: number }) => a.display_order - b.display_order)
      .map((q: { answer_options?: { display_order: number }[] }) => ({
        ...q,
        answer_options: (q.answer_options || []).sort(
          (a: { display_order: number }, b: { display_order: number }) => a.display_order - b.display_order
        ),
      })),
  }));

  if (sortedJobTypes.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            No estimator available
          </h1>
          <p className="mt-2 text-slate-600">
            There are no active job types for this contractor.
          </p>
        </div>
      </div>
    );
  }

  return <EstimatorPage company={company} jobTypes={sortedJobTypes} />;
}

export async function generateMetadata({ params }: Props) {
  const { companySlug } = await params;

  // Demo mode
  if (DEMO_MODE && (companySlug === DEMO_COMPANY.slug || !companySlug)) {
    return {
      title: `Get Price Estimate - ${DEMO_COMPANY.name}`,
      description: 'Get an instant price estimate for your project.',
    };
  }

  const supabase = await createServiceClient();

  const { data: company } = await supabase
    .from('companies')
    .select('name')
    .eq('slug', companySlug)
    .single();

  return {
    title: company
      ? `Get Price Estimate - ${company.name}`
      : 'Get Price Estimate',
    description: 'Get an instant price estimate for your project.',
  };
}
