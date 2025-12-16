import { notFound } from 'next/navigation';
import { createServiceClient } from '@/lib/supabase/server';
import { EstimatorPage } from '@/components/estimator/estimator-page';

interface Props {
  params: Promise<{
    companySlug: string;
  }>;
}

export default async function PublicEstimatorPage({ params }: Props) {
  const { companySlug } = await params;
  const supabase = await createServiceClient();

  // Fetch company by slug
  const { data: company, error: companyError } = await supabase
    .from('companies')
    .select('*')
    .eq('slug', companySlug)
    .single();

  if (companyError || !company) {
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
            Ingen estimator tillganglig
          </h1>
          <p className="mt-2 text-slate-600">
            Det finns inga aktiva jobbtyper for denna entreprenor.
          </p>
        </div>
      </div>
    );
  }

  return <EstimatorPage company={company} jobTypes={sortedJobTypes} />;
}

export async function generateMetadata({ params }: Props) {
  const { companySlug } = await params;
  const supabase = await createServiceClient();

  const { data: company } = await supabase
    .from('companies')
    .select('name')
    .eq('slug', companySlug)
    .single();

  return {
    title: company
      ? `Fa prisuppskattning - ${company.name}`
      : 'Fa prisuppskattning',
    description: 'Fa en direkt prisuppskattning for ditt projekt.',
  };
}
