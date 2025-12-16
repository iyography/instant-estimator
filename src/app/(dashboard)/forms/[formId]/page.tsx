'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useCompany } from '@/hooks/use-company';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuestionEditor } from '@/components/dashboard/question-editor';
import { formatCurrency, generateSlug } from '@/lib/utils';
import { previewEstimate } from '@/lib/pricing-engine';
import { DEMO_MODE, DEMO_JOB_TYPES, DEMO_QUESTIONS, DEMO_ANSWERS } from '@/lib/demo/data';
import { ArrowLeft, Plus, Sparkles, Save, Eye } from 'lucide-react';
import type { JobType, QuestionWithOptions, AISuggestedQuestion } from '@/types/database';
import { v4 as uuidv4 } from 'uuid';

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

  const supabase = createClient();

  useEffect(() => {
    async function fetchJobType() {
      if (isNew || !company) {
        setLoading(false);
        return;
      }

      // Demo mode - use demo data
      if (DEMO_MODE) {
        const demoJobType = DEMO_JOB_TYPES.find(jt => jt.id === formId);
        if (demoJobType) {
          setJobType(demoJobType as unknown as Partial<JobType>);

          // Build questions with nested answers
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
        return;
      }

      try {
        // Fetch job type with questions and answers
        const { data: jobTypeData, error: jobTypeError } = await supabase
          .from('job_types')
          .select('*')
          .eq('id', formId)
          .single();

        if (jobTypeError) throw jobTypeError;

        setJobType(jobTypeData);

        // Fetch questions with answer options
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select(`
            *,
            answer_options (*)
          `)
          .eq('job_type_id', formId)
          .order('display_order', { ascending: true });

        if (questionsError) throw questionsError;

        setQuestions(questionsData || []);
      } catch (error) {
        console.error('Failed to fetch job type:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchJobType();
  }, [formId, isNew, company, supabase]);

  const handleSave = async () => {
    if (!company) return;
    setSaving(true);

    // Demo mode - just simulate save and redirect
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setSaving(false);
      router.push('/forms');
      return;
    }

    try {
      let jobTypeId = formId;

      if (isNew) {
        // Create new job type
        const { data: newJobType, error: createError } = await supabase
          .from('job_types')
          .insert({
            company_id: company.id,
            name: jobType.name,
            name_sv: jobType.name_sv || jobType.name,
            description: jobType.description,
            description_sv: jobType.description_sv || jobType.description,
            base_price: jobType.base_price,
            is_active: jobType.is_active,
            display_order: jobType.display_order,
          })
          .select()
          .single();

        if (createError) throw createError;
        jobTypeId = newJobType.id;
      } else {
        // Update existing job type
        const { error: updateError } = await supabase
          .from('job_types')
          .update({
            name: jobType.name,
            name_sv: jobType.name_sv,
            description: jobType.description,
            description_sv: jobType.description_sv,
            base_price: jobType.base_price,
            is_active: jobType.is_active,
          })
          .eq('id', formId);

        if (updateError) throw updateError;
      }

      // Save questions and answers
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        const isNewQuestion = question.id.startsWith('new-');

        let questionId = question.id;

        if (isNewQuestion) {
          // Create new question
          const { data: newQuestion, error: qError } = await supabase
            .from('questions')
            .insert({
              job_type_id: jobTypeId,
              question_text: question.question_text,
              question_text_sv: question.question_text_sv || question.question_text,
              question_type: question.question_type,
              is_required: question.is_required,
              display_order: i,
              ai_generated: question.ai_generated,
            })
            .select()
            .single();

          if (qError) throw qError;
          questionId = newQuestion.id;
        } else {
          // Update existing question
          const { error: qError } = await supabase
            .from('questions')
            .update({
              question_text: question.question_text,
              question_text_sv: question.question_text_sv,
              question_type: question.question_type,
              is_required: question.is_required,
              display_order: i,
            })
            .eq('id', question.id);

          if (qError) throw qError;
        }

        // Delete old answers and create new ones for this question
        if (!isNewQuestion) {
          await supabase
            .from('answer_options')
            .delete()
            .eq('question_id', question.id);
        }

        // Create answer options
        for (let j = 0; j < question.answer_options.length; j++) {
          const answer = question.answer_options[j];
          const { error: aError } = await supabase
            .from('answer_options')
            .insert({
              question_id: questionId,
              answer_text: answer.answer_text,
              answer_text_sv: answer.answer_text_sv || answer.answer_text,
              price_modifier_type: answer.price_modifier_type,
              price_modifier_value: answer.price_modifier_value,
              display_order: j,
            });

          if (aError) throw aError;
        }
      }

      router.push('/forms');
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Kunde inte spara. Forsok igen.');
    } finally {
      setSaving(false);
    }
  };

  const handleAISuggestions = async () => {
    if (!company || !jobType.name) {
      alert('Ange ett jobbtypsnamn forst');
      return;
    }

    setAiLoading(true);

    try {
      const response = await fetch('/api/ai/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industry: company.industry,
          job_type_name: jobType.name,
          language: company.default_language,
          existing_questions: questions.map((q) => q.question_text),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI suggestions');
      }

      const data = await response.json();
      const suggestedQuestions: AISuggestedQuestion[] = data.questions;

      // Convert AI suggestions to QuestionWithOptions format
      const newQuestions: QuestionWithOptions[] = suggestedQuestions.map(
        (sq, index) => ({
          id: `new-${Date.now()}-${index}`,
          job_type_id: formId,
          question_text: sq.question_text,
          question_text_sv: sq.question_text,
          question_type: sq.question_type,
          is_required: true,
          display_order: questions.length + index,
          ai_generated: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          answer_options: sq.answer_options.map((ao, aoIndex) => ({
            id: `new-${Date.now()}-${index}-${aoIndex}`,
            question_id: `new-${Date.now()}-${index}`,
            answer_text: ao.answer_text,
            answer_text_sv: ao.answer_text,
            price_modifier_type: ao.price_modifier_type,
            price_modifier_value: ao.price_modifier_value,
            display_order: aoIndex,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })),
        })
      );

      setQuestions([...questions, ...newQuestions]);
    } catch (error) {
      console.error('AI suggestion failed:', error);
      alert('Kunde inte hamta AI-forslag. Forsok igen.');
    } finally {
      setAiLoading(false);
    }
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

  // Calculate preview estimate
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
              {isNew ? 'Skapa ny jobbtyp' : 'Redigera jobbtyp'}
            </h1>
            <p className="text-slate-600">
              Konfigurera fragor och prismodifierare
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="mr-2 h-4 w-4" />
            {showPreview ? 'Dolj forhandsvisning' : 'Forhandsvisa'}
          </Button>
          <Button onClick={handleSave} isLoading={saving}>
            <Save className="mr-2 h-4 w-4" />
            Spara
          </Button>
        </div>
      </div>

      {/* Job Type Details */}
      <Card>
        <CardHeader>
          <CardTitle>Jobbtypsdetaljer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Namn</Label>
              <Input
                id="name"
                value={jobType.name || ''}
                onChange={(e) =>
                  setJobType({ ...jobType, name: e.target.value })
                }
                placeholder="T.ex. Elbilsladdare Installation"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="basePrice">Baspris ({company?.default_currency})</Label>
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
            <Label htmlFor="description">Beskrivning (valfritt)</Label>
            <Textarea
              id="description"
              value={jobType.description || ''}
              onChange={(e) =>
                setJobType({ ...jobType, description: e.target.value })
              }
              placeholder="En kort beskrivning av denna jobbtyp"
              rows={2}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={jobType.is_active}
              onChange={(e) =>
                setJobType({ ...jobType, is_active: e.target.checked })
              }
              className="h-4 w-4 rounded border-slate-300"
            />
            <Label htmlFor="isActive">Aktiv (visas i estimatorn)</Label>
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Fragor</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleAISuggestions}
              disabled={aiLoading || !jobType.name}
              isLoading={aiLoading}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              AI-forslag
            </Button>
            <Button variant="outline" onClick={addQuestion}>
              <Plus className="mr-2 h-4 w-4" />
              Lagg till fraga
            </Button>
          </div>
        </div>

        {questions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-slate-600">Inga fragor annu</p>
              <p className="mt-1 text-sm text-slate-500">
                Lagg till fragor manuellt eller anvand AI-forslag
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={handleAISuggestions}
                  disabled={aiLoading || !jobType.name}
                  isLoading={aiLoading}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI-forslag
                </Button>
                <Button onClick={addQuestion}>
                  <Plus className="mr-2 h-4 w-4" />
                  Lagg till fraga
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
                currency={company?.default_currency || 'SEK'}
              />
            ))}
          </div>
        )}
      </div>

      {/* Preview Panel */}
      {showPreview && previewResult && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">Forhandsvisning</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-700">
              Beraknad prisuppskattning baserat pa forsta svarsalternativet for varje fraga:
            </p>
            <div className="mt-4 rounded-md bg-white p-4">
              <p className="text-sm text-slate-500">Baspris</p>
              <p className="text-lg font-semibold">
                {formatCurrency(
                  jobType.base_price || 0,
                  company?.default_currency || 'SEK',
                  company?.default_language || 'sv'
                )}
              </p>
              {previewResult.breakdown.slice(1).map((step, i) => (
                <div key={i} className="mt-2 border-t pt-2">
                  <p className="text-sm text-slate-500">{step.description}</p>
                  <p className="font-medium">
                    {formatCurrency(
                      step.priceAfter,
                      company?.default_currency || 'SEK',
                      company?.default_language || 'sv'
                    )}
                  </p>
                </div>
              ))}
              <div className="mt-4 border-t pt-4">
                <p className="text-sm text-slate-500">Uppskattat prisintervall</p>
                <p className="text-xl font-bold text-slate-900">
                  {formatCurrency(
                    previewResult.priceLow,
                    company?.default_currency || 'SEK',
                    company?.default_language || 'sv'
                  )}{' '}
                  -{' '}
                  {formatCurrency(
                    previewResult.priceHigh,
                    company?.default_currency || 'SEK',
                    company?.default_language || 'sv'
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
