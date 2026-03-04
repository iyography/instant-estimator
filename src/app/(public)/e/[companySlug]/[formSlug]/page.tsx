import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { EstimatorPage } from '@/components/estimator/estimator-page';

interface Props {
  params: Promise<{
    companySlug: string;
    formSlug: string;
  }>;
}

export default async function PublicEstimatorFormPage({ params }: Props) {
  const { companySlug, formSlug } = await params;
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

  // Fetch form by slug and company_id
  const { data: form, error: formError } = await supabase
    .from('forms')
    .select('*')
    .eq('company_id', company.id)
    .eq('slug', formSlug)
    .eq('is_active', true)
    .single();

  if (formError || !form) {
    notFound();
  }

  // Fetch job types filtered by the form's job_type_ids, with nested questions and answer options
  let jobTypesQuery = supabase
    .from('job_types')
    .select('*, questions(*, answer_options(*))')
    .eq('company_id', company.id)
    .eq('is_active', true);

  if (form.job_type_ids && form.job_type_ids.length > 0) {
    jobTypesQuery = jobTypesQuery.in('id', form.job_type_ids);
  }

  const { data: jobTypes } = await jobTypesQuery.order('display_order');

  return <EstimatorPage company={company as any} jobTypes={(jobTypes || []) as any} />;
}
