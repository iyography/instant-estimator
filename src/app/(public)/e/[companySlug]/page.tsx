import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { EstimatorPage } from '@/components/estimator/estimator-page';

interface Props {
  params: Promise<{
    companySlug: string;
  }>;
}

export default async function PublicEstimatorPage({ params }: Props) {
  const { companySlug } = await params;
  const supabase = await createClient();

  // Fetch company by slug
  const { data: company, error: companyError } = await supabase
    .from('companies')
    .select('*')
    .eq('slug', companySlug)
    .single();

  if (companyError || !company) {
    notFound();
  }

  // Fetch active job types with nested questions and answer options
  const { data: jobTypes } = await supabase
    .from('job_types')
    .select('*, questions(*, answer_options(*))')
    .eq('company_id', company.id)
    .eq('is_active', true)
    .order('display_order');

  return <EstimatorPage company={company as any} jobTypes={(jobTypes || []) as any} />;
}
