import { EstimatorPage } from '@/components/estimator/estimator-page';
import { DEMO_COMPANY, DEMO_JOB_TYPES, DEMO_QUESTIONS, DEMO_ANSWERS, DEMO_FORMS } from '@/lib/demo/data';

interface Props {
  params: Promise<{
    companySlug: string;
    formSlug: string;
  }>;
}

// Build demo job types with nested questions and answers
function getDemoJobTypesWithQuestions(jobTypeIds?: string[]) {
  return DEMO_JOB_TYPES
    .filter(jt => jt.is_active && (!jobTypeIds || jobTypeIds.includes(jt.id)))
    .map(jt => {
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

export default async function PublicEstimatorFormPage({ params }: Props) {
  const { formSlug } = await params;

  // Find the form by slug
  const form = DEMO_FORMS.find(f => f.slug === formSlug);

  // If form found, filter job types to only those in the form
  // Otherwise, show all active job types
  const jobTypeIds = form?.job_type_ids;
  const demoJobTypes = getDemoJobTypesWithQuestions(jobTypeIds);

  return <EstimatorPage company={DEMO_COMPANY as any} jobTypes={demoJobTypes as any} />;
}
