'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCompany } from '@/hooks/use-company';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuestionEditor } from '@/components/dashboard/question-editor';
import { formatCurrency } from '@/lib/utils';
import { previewEstimate } from '@/lib/pricing-engine';
import { DEMO_JOB_TYPES, DEMO_QUESTIONS, DEMO_ANSWERS } from '@/lib/demo/data';
import { ArrowLeft, Plus, Sparkles, Save, Eye } from 'lucide-react';
import type { JobType, QuestionWithOptions, PriceModifierType } from '@/types/database';

export default function FormBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const { company } = useCompany();
  const formId = params.formId as string;
  const isNew = formId === 'new';

  const [jobType, setJobType] = useState<Partial<JobType>>({
    name: '',
    name_sv: '',
    description: '',
    description_sv: '',
    base_price: 0,
    is_active: true,
    display_order: 0,
  });
  const [questions, setQuestions] = useState<QuestionWithOptions[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (isNew || !company) {
      setLoading(false);
      return;
    }

    // Load demo data
    const demoJobType = DEMO_JOB_TYPES.find(jt => jt.id === formId);
    if (demoJobType) {
      setJobType(demoJobType as unknown as Partial<JobType>);

      const demoQuestions = DEMO_QUESTIONS
        .filter(q => q.job_type_id === formId)
        .sort((a, b) => a.display_order - b.display_order)
        .map(q => ({
          ...q,
          answer_options: DEMO_ANSWERS
            .filter(a => a.question_id === q.id)
            .sort((a, b) => a.display_order - b.display_order),
        }));

      setQuestions(demoQuestions as unknown as QuestionWithOptions[]);
    }
    setLoading(false);
  }, [formId, isNew, company]);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setSaving(false);
    router.push('/forms');
  };

  const handleAISuggestions = async () => {
    if (!jobType.name) {
      alert('Enter a job type name first');
      return;
    }

    setAiLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Add dummy AI-generated questions
    const newQuestions: QuestionWithOptions[] = [
      {
        id: `new-${Date.now()}-1`,
        job_type_id: formId,
        question_text: 'What is the scope of the project?',
        question_text_sv: 'Vad är projektets omfattning?',
        question_type: 'single_choice',
        is_required: true,
        display_order: questions.length,
        ai_generated: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        answer_options: [
          { id: `new-ao-1`, question_id: `new-${Date.now()}-1`, answer_text: 'Small', answer_text_sv: 'Liten', price_modifier_type: 'percentage' as PriceModifierType, price_modifier_value: 0, display_order: 0, created_at: '', updated_at: '' },
          { id: `new-ao-2`, question_id: `new-${Date.now()}-1`, answer_text: 'Medium', answer_text_sv: 'Mellan', price_modifier_type: 'percentage' as PriceModifierType, price_modifier_value: 25, display_order: 1, created_at: '', updated_at: '' },
          { id: `new-ao-3`, question_id: `new-${Date.now()}-1`, answer_text: 'Large', answer_text_sv: 'Stor', price_modifier_type: 'percentage' as PriceModifierType, price_modifier_value: 50, display_order: 2, created_at: '', updated_at: '' },
        ],
      },
    ];

    setQuestions([...questions, ...newQuestions]);
    setAiLoading(false);
  };

  const addQuestion = () => {
    const newQuestion: QuestionWithOptions = {
      id: `new-${Date.now()}`,
      job_type_id: formId,
      question_text: '',
      question_text_sv: null,
      question_type: 'single_choice',
      is_required: true,
      display_order: questions.length,
      ai_generated: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      answer_options: [],
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, updated: QuestionWithOptions) => {
    const newQuestions = [...questions];
    newQuestions[index] = updated;
    setQuestions(newQuestions);
  };

  const deleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const previewResult = questions.length > 0
    ? previewEstimate(
        jobType.base_price || 0,
        questions.flatMap((q) =>
          q.answer_options.slice(0, 1).map((a) => ({
            question_id: q.id,
            modifier_type: a.price_modifier_type,
            modifier_value: a.price_modifier_value,
          }))
        ),
        company?.settings || {}
      )
    : null;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/forms">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {isNew ? 'Create New Job Type' : 'Edit Job Type'}
            </h1>
            <p className="text-slate-600">
              Configure questions and price modifiers
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="mr-2 h-4 w-4" />
            {showPreview ? 'Hide Preview' : 'Preview'}
          </Button>
          <Button onClick={handleSave} isLoading={saving}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Type Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={jobType.name || ''}
                onChange={(e) => setJobType({ ...jobType, name: e.target.value })}
                placeholder="e.g. EV Charger Installation"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="basePrice">Base Price ({company?.default_currency})</Label>
              <Input
                id="basePrice"
                type="number"
                value={(jobType.base_price || 0) / 100}
                onChange={(e) =>
                  setJobType({
                    ...jobType,
                    base_price: Math.round(parseFloat(e.target.value) * 100) || 0,
                  })
                }
                placeholder="0"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={jobType.description || ''}
              onChange={(e) => setJobType({ ...jobType, description: e.target.value })}
              placeholder="A short description of this job type"
              rows={2}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={jobType.is_active}
              onChange={(e) => setJobType({ ...jobType, is_active: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300"
            />
            <Label htmlFor="isActive">Active (shown in estimator)</Label>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Questions</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleAISuggestions}
              disabled={aiLoading || !jobType.name}
              isLoading={aiLoading}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              AI Suggestions
            </Button>
            <Button variant="outline" onClick={addQuestion}>
              <Plus className="mr-2 h-4 w-4" />
              Add Question
            </Button>
          </div>
        </div>

        {questions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-slate-600">No questions yet</p>
              <p className="mt-1 text-sm text-slate-500">
                Add questions manually or use AI suggestions
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={handleAISuggestions}
                  disabled={aiLoading || !jobType.name}
                  isLoading={aiLoading}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI Suggestions
                </Button>
                <Button onClick={addQuestion}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Question
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {questions.map((question, index) => (
              <QuestionEditor
                key={question.id}
                question={question}
                index={index}
                onUpdate={(updated) => updateQuestion(index, updated)}
                onDelete={() => deleteQuestion(index)}
                currency={company?.default_currency || 'USD'}
              />
            ))}
          </div>
        )}
      </div>

      {showPreview && previewResult && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-700">
              Estimated price based on first answer option for each question:
            </p>
            <div className="mt-4 rounded-md bg-white p-4">
              <p className="text-sm text-slate-500">Base Price</p>
              <p className="text-lg font-semibold">
                {formatCurrency(jobType.base_price || 0, company?.default_currency || 'USD', company?.default_language || 'en')}
              </p>
              {previewResult.breakdown.slice(1).map((step, i) => (
                <div key={i} className="mt-2 border-t pt-2">
                  <p className="text-sm text-slate-500">{step.description}</p>
                  <p className="font-medium">
                    {formatCurrency(step.priceAfter, company?.default_currency || 'USD', company?.default_language || 'en')}
                  </p>
                </div>
              ))}
              <div className="mt-4 border-t pt-4">
                <p className="text-sm text-slate-500">Estimated Price Range</p>
                <p className="text-xl font-bold text-slate-900">
                  {formatCurrency(previewResult.priceLow, company?.default_currency || 'USD', company?.default_language || 'en')}
                  {' - '}
                  {formatCurrency(previewResult.priceHigh, company?.default_currency || 'USD', company?.default_language || 'en')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
