import { EstimatorPage } from '@/components/estimator/estimator-page';
import { DEMO_COMPANY, DEMO_JOB_TYPES, DEMO_QUESTIONS, DEMO_ANSWERS } from '@/lib/demo/data';

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
  // Always use demo data
  const demoJobTypes = getDemoJobTypesWithQuestions();
  return <EstimatorPage company={DEMO_COMPANY as any} jobTypes={demoJobTypes as any} />;
}
