'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { cn, formatCurrency } from '@/lib/utils';
import { calculateEstimate } from '@/lib/pricing-engine';
import { Check, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import type {
  JobType,
  QuestionWithOptions,
  AnswerOption,
  Company,
  Currency,
  Language,
  CreateLeadRequest,
} from '@/types/database';

interface EstimatorFlowProps {
  company: Company;
  jobTypes: (JobType & { questions: QuestionWithOptions[] })[];
  onSubmit: (data: CreateLeadRequest) => Promise<void>;
  styling?: {
    primaryColor?: string;
    backgroundColor?: string;
  };
}

interface FormState {
  jobTypeId: string | null;
  answers: Record<string, string[]>;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
}

export function EstimatorFlow({
  company,
  jobTypes,
  onSubmit,
  styling,
}: EstimatorFlowProps) {
  const [step, setStep] = useState(0);
  const [formState, setFormState] = useState<FormState>({
    jobTypeId: jobTypes.length === 1 ? jobTypes[0].id : null,
    answers: {},
    customerInfo: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [estimate, setEstimate] = useState<{
    low: number;
    high: number;
  } | null>(null);

  const selectedJobType = jobTypes.find((jt) => jt.id === formState.jobTypeId);
  const questions = selectedJobType?.questions || [];

  // Calculate total steps: Job type selection (if multiple) + Questions + Contact Info
  // Contact info now comes AFTER questions but BEFORE showing estimate
  const showJobTypeSelection = jobTypes.length > 1;
  const totalSteps =
    (showJobTypeSelection ? 1 : 0) + questions.length + 1; // +1 for contact info

  // Determine current step type
  const currentQuestionIndex = showJobTypeSelection ? step - 1 : step;
  const currentQuestion =
    currentQuestionIndex >= 0 && currentQuestionIndex < questions.length
      ? questions[currentQuestionIndex]
      : null;
  const isContactStep = currentQuestionIndex === questions.length;
  const isJobTypeStep = showJobTypeSelection && step === 0;

  // Get selected answers for price calculation
  const getSelectedAnswers = (): AnswerOption[] => {
    const answers: AnswerOption[] = [];
    for (const question of questions) {
      const selectedIds = formState.answers[question.id] || [];
      for (const id of selectedIds) {
        const answer = question.answer_options.find((a) => a.id === id);
        if (answer) answers.push(answer);
      }
    }
    return answers;
  };

  // Calculate estimate when answers change (but don't show it until after contact info)
  useEffect(() => {
    if (selectedJobType && Object.keys(formState.answers).length > 0) {
      const selectedAnswers = getSelectedAnswers();
      const result = calculateEstimate(
        selectedJobType,
        selectedAnswers,
        company.settings,
        company.default_currency
      );
      setEstimate({
        low: result.price_low,
        high: result.price_high,
      });
    }
  }, [formState.answers, selectedJobType, company]);

  const handleJobTypeSelect = (jobTypeId: string) => {
    setFormState((prev) => ({
      ...prev,
      jobTypeId,
      answers: {},
    }));
    setStep(1);
  };

  const handleAnswerSelect = (questionId: string, answerId: string) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;

    if (question.question_type === 'multiple_choice') {
      // Toggle selection for multiple choice
      setFormState((prev) => {
        const current = prev.answers[questionId] || [];
        const updated = current.includes(answerId)
          ? current.filter((id) => id !== answerId)
          : [...current, answerId];
        return {
          ...prev,
          answers: {
            ...prev.answers,
            [questionId]: updated,
          },
        };
      });
    } else {
      // Single selection
      setFormState((prev) => ({
        ...prev,
        answers: {
          ...prev.answers,
          [questionId]: [answerId],
        },
      }));
    }
  };

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!selectedJobType || !estimate) return;

    setSubmitting(true);
    try {
      const responses = Object.entries(formState.answers).flatMap(
        ([questionId, answerIds]) =>
          answerIds.map((answerId) => ({
            question_id: questionId,
            answer_option_id: answerId,
          }))
      );

      await onSubmit({
        company_id: company.id,
        job_type_id: selectedJobType.id,
        customer_name: formState.customerInfo.name,
        customer_email: formState.customerInfo.email,
        customer_phone: formState.customerInfo.phone || undefined,
        customer_address: formState.customerInfo.address || undefined,
        responses,
        source_url: typeof window !== 'undefined' ? window.location.href : undefined,
      });

      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit:', error);
      alert('Could not submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const canProceed = () => {
    if (isJobTypeStep) return !!formState.jobTypeId;
    if (isContactStep) {
      return (
        formState.customerInfo.name.trim() !== '' &&
        formState.customerInfo.email.trim() !== '' &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.customerInfo.email)
      );
    }
    if (currentQuestion) {
      const answers = formState.answers[currentQuestion.id] || [];
      return !currentQuestion.is_required || answers.length > 0;
    }
    return true;
  };

  const primaryColor = styling?.primaryColor || '#0f172a';

  // Success state - NOW shows the estimate after submission
  if (submitted) {
    return (
      <Card className="mx-auto max-w-md">
        <CardContent className="py-12 text-center">
          <div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
            style={{ backgroundColor: primaryColor }}
          >
            <Check className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Thank you!</h2>
          <p className="mt-2 text-slate-600">
            We have received your request. A contractor will contact you shortly.
          </p>
          {estimate && (
            <div className="mt-6 rounded-lg bg-slate-100 p-4">
              <p className="text-sm text-slate-600">Your price estimate</p>
              <p className="text-2xl font-bold" style={{ color: primaryColor }}>
                {formatCurrency(
                  estimate.low,
                  company.default_currency,
                  company.default_language
                )}
                {' - '}
                {formatCurrency(
                  estimate.high,
                  company.default_currency,
                  company.default_language
                )}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      {/* Progress bar - NO estimate shown during flow */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-slate-500">
          <span>Step {step + 1} of {totalSteps}</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-slate-200">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${((step + 1) / totalSteps) * 100}%`,
              backgroundColor: primaryColor,
            }}
          />
        </div>
      </div>

      {/* Job Type Selection */}
      {isJobTypeStep && (
        <Card>
          <CardContent className="py-6">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              What service do you need?
            </h2>
            <div className="space-y-2">
              {jobTypes.map((jobType) => (
                <button
                  key={jobType.id}
                  onClick={() => handleJobTypeSelect(jobType.id)}
                  className={cn(
                    'w-full rounded-lg border-2 p-4 text-left transition-all',
                    formState.jobTypeId === jobType.id
                      ? 'border-slate-900 bg-slate-50'
                      : 'border-slate-200 hover:border-slate-300'
                  )}
                  style={
                    formState.jobTypeId === jobType.id
                      ? { borderColor: primaryColor }
                      : {}
                  }
                >
                  <p className="font-medium text-slate-900">{jobType.name}</p>
                  {jobType.description && (
                    <p className="mt-1 text-sm text-slate-500">
                      {jobType.description}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Question */}
      {currentQuestion && (
        <Card>
          <CardContent className="py-6">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              {currentQuestion.question_text}
            </h2>
            {(currentQuestion.question_type === 'single_choice' ||
              currentQuestion.question_type === 'multiple_choice') && (
              <div className="space-y-2">
                {currentQuestion.answer_options.map((option) => {
                  const isSelected = (
                    formState.answers[currentQuestion.id] || []
                  ).includes(option.id);
                  return (
                    <button
                      key={option.id}
                      onClick={() =>
                        handleAnswerSelect(currentQuestion.id, option.id)
                      }
                      className={cn(
                        'w-full rounded-lg border-2 p-4 text-left transition-all',
                        isSelected
                          ? 'border-slate-900 bg-slate-50'
                          : 'border-slate-200 hover:border-slate-300'
                      )}
                      style={isSelected ? { borderColor: primaryColor } : {}}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-900">
                          {option.answer_text}
                        </span>
                        {isSelected && (
                          <Check
                            className="h-5 w-5"
                            style={{ color: primaryColor }}
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
            {currentQuestion.question_type === 'number_input' && (
              <Input
                type="number"
                placeholder="Enter a number"
                onChange={(e) => {
                  // Store number input as raw answer
                  setFormState((prev) => ({
                    ...prev,
                    answers: {
                      ...prev.answers,
                      [currentQuestion.id]: [e.target.value],
                    },
                  }));
                }}
              />
            )}
            {currentQuestion.question_type === 'text_input' && (
              <Input
                type="text"
                placeholder="Enter your answer"
                onChange={(e) => {
                  setFormState((prev) => ({
                    ...prev,
                    answers: {
                      ...prev.answers,
                      [currentQuestion.id]: [e.target.value],
                    },
                  }));
                }}
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* Contact Info Step - Required BEFORE seeing estimate */}
      {isContactStep && (
        <Card>
          <CardContent className="py-6">
            <h2 className="mb-2 text-xl font-semibold text-slate-900">
              Where should we send your estimate?
            </h2>
            <p className="mb-6 text-sm text-slate-500">
              Enter your contact information to receive your personalized estimate.
            </p>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" required>
                  Your name
                </Label>
                <Input
                  id="name"
                  value={formState.customerInfo.name}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      customerInfo: {
                        ...prev.customerInfo,
                        name: e.target.value,
                      },
                    }))
                  }
                  placeholder="John Smith"
                />
              </div>
              <div>
                <Label htmlFor="email" required>
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formState.customerInfo.email}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      customerInfo: {
                        ...prev.customerInfo,
                        email: e.target.value,
                      },
                    }))
                  }
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formState.customerInfo.phone}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      customerInfo: {
                        ...prev.customerInfo,
                        phone: e.target.value,
                      },
                    }))
                  }
                  placeholder="+1 555 123 4567"
                />
              </div>
              <div>
                <Label htmlFor="address">Address (optional)</Label>
                <Input
                  id="address"
                  value={formState.customerInfo.address}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      customerInfo: {
                        ...prev.customerInfo,
                        address: e.target.value,
                      },
                    }))
                  }
                  placeholder="123 Main St, City, State 12345"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="mt-6 flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === 0}
          className={step === 0 ? 'invisible' : ''}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {isContactStep ? (
          <Button
            onClick={handleSubmit}
            disabled={!canProceed() || submitting}
            style={{ backgroundColor: primaryColor }}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Get my estimate'
            )}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            style={{ backgroundColor: primaryColor }}
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
