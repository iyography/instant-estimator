'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCompany } from '@/hooks/use-company';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { QuestionEditor } from '@/components/dashboard/question-editor';
import { formatCurrency } from '@/lib/utils';
import { previewEstimate } from '@/lib/pricing-engine';
import { DEMO_JOB_TYPES, DEMO_QUESTIONS, DEMO_ANSWERS } from '@/lib/demo/data';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ArrowLeft,
  Plus,
  Sparkles,
  Save,
  Eye,
  EyeOff,
  Zap,
  Package,
  DollarSign,
  Clock,
  GripVertical,
  Copy,
  Trash2,
  ChevronDown,
  ChevronUp,
  Settings,
  Link2,
  Hash,
} from 'lucide-react';
import type { JobType, QuestionWithOptions, PriceModifierType } from '@/types/database';

// Icon map for job type icons
const iconOptions = [
  { value: 'zap', label: 'Lightning', icon: Zap },
  { value: 'package', label: 'Package', icon: Package },
];

interface ServicePackage {
  id: string;
  name: string;
  description: string;
  discount_percentage: number;
  included_job_types: string[];
}

// Sortable Question Wrapper Component
interface SortableQuestionProps {
  question: QuestionWithOptions;
  index: number;
  onUpdate: (updated: QuestionWithOptions) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  currency: string;
  allQuestions: QuestionWithOptions[];
}

function SortableQuestion({
  question,
  index,
  onUpdate,
  onDelete,
  onDuplicate,
  currency,
  allQuestions,
}: SortableQuestionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <QuestionEditor
        question={question as any}
        index={index}
        onUpdate={(updated) => onUpdate(updated as any)}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        currency={currency}
        allQuestions={allQuestions as any}
        allAnswers={allQuestions.flatMap(q => q.answer_options)}
        dragHandleProps={listeners}
      />
    </div>
  );
}

export default function FormBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const { company } = useCompany();
  const formId = params.formId as string;
  const isNew = formId === 'new';

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [jobType, setJobType] = useState<Partial<JobType>>({
    name: '',
    name_sv: '',
    description: '',
    description_sv: '',
    base_price: 0,
    min_price: 0,
    max_price: 0,
    estimated_hours: 0,
    is_active: true,
    display_order: 0,
  });
  const [questions, setQuestions] = useState<QuestionWithOptions[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<'questions' | 'settings' | 'packages'>('questions');
  const [packages, setPackages] = useState<ServicePackage[]>([]);

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
          { id: `new-ao-1`, question_id: `new-${Date.now()}-1`, answer_text: 'Small (1-2 hours)', answer_text_sv: 'Liten (1-2 timmar)', price_modifier_type: 'percentage' as PriceModifierType, price_modifier_value: 0, display_order: 0, created_at: '', updated_at: '' },
          { id: `new-ao-2`, question_id: `new-${Date.now()}-1`, answer_text: 'Medium (3-4 hours)', answer_text_sv: 'Mellan (3-4 timmar)', price_modifier_type: 'percentage' as PriceModifierType, price_modifier_value: 25, display_order: 1, created_at: '', updated_at: '' },
          { id: `new-ao-3`, question_id: `new-${Date.now()}-1`, answer_text: 'Large (5+ hours)', answer_text_sv: 'Stor (5+ timmar)', price_modifier_type: 'percentage' as PriceModifierType, price_modifier_value: 50, display_order: 2, created_at: '', updated_at: '' },
        ],
      },
      {
        id: `new-${Date.now()}-2`,
        job_type_id: formId,
        question_text: 'How urgent is this project?',
        question_text_sv: 'Hur brådskande är projektet?',
        question_type: 'single_choice',
        is_required: true,
        display_order: questions.length + 1,
        ai_generated: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        answer_options: [
          { id: `new-ao-4`, question_id: `new-${Date.now()}-2`, answer_text: 'Standard (1-2 weeks)', answer_text_sv: 'Standard (1-2 veckor)', price_modifier_type: 'fixed' as PriceModifierType, price_modifier_value: 0, display_order: 0, created_at: '', updated_at: '' },
          { id: `new-ao-5`, question_id: `new-${Date.now()}-2`, answer_text: 'Rush (2-3 days)', answer_text_sv: 'Brådskande (2-3 dagar)', price_modifier_type: 'percentage' as PriceModifierType, price_modifier_value: 25, display_order: 1, created_at: '', updated_at: '' },
          { id: `new-ao-6`, question_id: `new-${Date.now()}-2`, answer_text: 'Emergency (same day)', answer_text_sv: 'Akut (samma dag)', price_modifier_type: 'percentage' as PriceModifierType, price_modifier_value: 50, display_order: 2, created_at: '', updated_at: '' },
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

  const addQuantityQuestion = () => {
    const newQuestion: QuestionWithOptions = {
      id: `new-qty-${Date.now()}`,
      job_type_id: formId,
      question_text: '',
      question_text_sv: null,
      question_type: 'quantity' as any,
      is_required: true,
      display_order: questions.length,
      ai_generated: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      answer_options: [{
        id: `qty-opt-${Date.now()}`,
        question_id: `new-qty-${Date.now()}`,
        answer_text: 'Per unit',
        answer_text_sv: 'Per enhet',
        price_modifier_type: 'per_unit' as PriceModifierType,
        price_modifier_value: 0,
        display_order: 0,
        created_at: '',
        updated_at: '',
      }],
    };
    setQuestions([...questions, newQuestion]);
  };

  const duplicateQuestion = (index: number) => {
    const original = questions[index];
    const duplicate: QuestionWithOptions = {
      ...original,
      id: `dup-${Date.now()}`,
      question_text: `${original.question_text} (copy)`,
      display_order: questions.length,
      answer_options: original.answer_options.map((a, i) => ({
        ...a,
        id: `dup-ao-${Date.now()}-${i}`,
        question_id: `dup-${Date.now()}`,
      })),
    };
    setQuestions([...questions, duplicate]);
  };

  const updateQuestion = (index: number, updated: QuestionWithOptions) => {
    const newQuestions = [...questions];
    newQuestions[index] = updated;
    setQuestions(newQuestions);
  };

  const deleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === questions.length - 1) return;

    const newQuestions = [...questions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newQuestions[index], newQuestions[targetIndex]] = [newQuestions[targetIndex], newQuestions[index]];

    // Update display orders
    newQuestions.forEach((q, i) => {
      q.display_order = i;
    });

    setQuestions(newQuestions);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = questions.findIndex((q) => q.id === active.id);
      const newIndex = questions.findIndex((q) => q.id === over.id);

      const newQuestions = arrayMove(questions, oldIndex, newIndex);

      // Update display orders
      newQuestions.forEach((q, i) => {
        q.display_order = i;
      });

      setQuestions(newQuestions);
    }
  };

  const addPackage = () => {
    const newPackage: ServicePackage = {
      id: `pkg-${Date.now()}`,
      name: '',
      description: '',
      discount_percentage: 10,
      included_job_types: [formId],
    };
    setPackages([...packages, newPackage]);
  };

  const updatePackage = (index: number, updates: Partial<ServicePackage>) => {
    const newPackages = [...packages];
    newPackages[index] = { ...newPackages[index], ...updates };
    setPackages(newPackages);
  };

  const deletePackage = (index: number) => {
    setPackages(packages.filter((_, i) => i !== index));
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
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/forms">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {isNew ? 'Create New Service' : 'Edit Service'}
            </h1>
            <p className="text-slate-600">
              Configure pricing, questions, and conditional logic
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? (
              <EyeOff className="mr-2 h-4 w-4" />
            ) : (
              <Eye className="mr-2 h-4 w-4" />
            )}
            {showPreview ? 'Hide Preview' : 'Preview'}
          </Button>
          <Button onClick={handleSave} isLoading={saving}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('questions')}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'questions'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Questions ({questions.length})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'settings'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Settings className="h-4 w-4 inline mr-1" />
          Settings
        </button>
        <button
          onClick={() => setActiveTab('packages')}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === 'packages'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Package className="h-4 w-4 inline mr-1" />
          Packages ({packages.length})
        </button>
      </div>

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
            <CardDescription>
              Configure the basic information and pricing for this service
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Service Name *</Label>
                <Input
                  id="name"
                  value={jobType.name || ''}
                  onChange={(e) => setJobType({ ...jobType, name: e.target.value })}
                  placeholder="e.g. EV Charger Installation"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name_sv">Swedish Name</Label>
                <Input
                  id="name_sv"
                  value={(jobType as any).name_sv || ''}
                  onChange={(e) => setJobType({ ...jobType, name_sv: e.target.value } as any)}
                  placeholder="e.g. Elbilsladdare Installation"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={jobType.description || ''}
                onChange={(e) => setJobType({ ...jobType, description: e.target.value })}
                placeholder="A short description of this service"
                rows={2}
              />
            </div>

            {/* Pricing */}
            <div className="p-4 rounded-lg bg-green-50 border border-green-100 space-y-4">
              <h3 className="font-semibold text-green-900 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing Configuration
              </h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="basePrice">Base Price ({company?.default_currency || 'USD'})</Label>
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
                  <p className="text-xs text-slate-500">Starting price before modifiers</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minPrice">Minimum Price</Label>
                  <Input
                    id="minPrice"
                    type="number"
                    value={(jobType.min_price || 0) / 100}
                    onChange={(e) =>
                      setJobType({
                        ...jobType,
                        min_price: Math.round(parseFloat(e.target.value) * 100) || 0,
                      })
                    }
                    placeholder="0"
                  />
                  <p className="text-xs text-slate-500">Floor price for estimates</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxPrice">Maximum Price</Label>
                  <Input
                    id="maxPrice"
                    type="number"
                    value={(jobType.max_price || 0) / 100}
                    onChange={(e) =>
                      setJobType({
                        ...jobType,
                        max_price: Math.round(parseFloat(e.target.value) * 100) || 0,
                      })
                    }
                    placeholder="0"
                  />
                  <p className="text-xs text-slate-500">Ceiling price for estimates</p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-4 pt-4 border-t">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={jobType.is_active}
                  onChange={(e) => setJobType({ ...jobType, is_active: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600"
                />
                <span className="font-medium text-slate-900">Active</span>
              </label>
              <span className="text-sm text-slate-500">
                {jobType.is_active
                  ? 'This service is shown in the estimator'
                  : 'This service is hidden from customers'}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Questions Tab */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Questions
              <span className="ml-2 text-sm font-normal text-slate-500">
                {questions.length === 0
                  ? 'No questions yet'
                  : `${questions.length} question${questions.length !== 1 ? 's' : ''}`}
              </span>
            </h2>
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
              <div className="relative group">
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Question
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
                <div className="absolute right-0 top-full mt-1 w-56 rounded-lg border border-slate-200 bg-white py-2 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  <button
                    onClick={addQuestion}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Link2 className="h-4 w-4" />
                    Single/Multiple Choice
                  </button>
                  <button
                    onClick={addQuantityQuestion}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Hash className="h-4 w-4" />
                    Quantity Input
                  </button>
                </div>
              </div>
            </div>
          </div>

          {questions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-slate-400" />
                </div>
                <p className="text-slate-900 font-medium">No questions yet</p>
                <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
                  Add questions to calculate dynamic pricing based on customer responses.
                  Use AI suggestions to get started quickly.
                </p>
                <div className="mt-6 flex justify-center gap-3">
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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={questions.map((q) => q.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <SortableQuestion
                      key={question.id}
                      question={question}
                      index={index}
                      onUpdate={(updated) => updateQuestion(index, updated)}
                      onDelete={() => deleteQuestion(index)}
                      onDuplicate={() => duplicateQuestion(index)}
                      currency={company?.default_currency || 'USD'}
                      allQuestions={questions}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      )}

      {/* Packages Tab */}
      {activeTab === 'packages' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Service Packages</h2>
              <p className="text-sm text-slate-500">
                Bundle multiple services together with special pricing
              </p>
            </div>
            <Button onClick={addPackage}>
              <Plus className="mr-2 h-4 w-4" />
              Create Package
            </Button>
          </div>

          {packages.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-slate-900 font-medium">No packages yet</p>
                <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
                  Create packages to offer bundled services at a discount. Great for common combinations.
                </p>
                <Button onClick={addPackage} className="mt-6">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Package
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {packages.map((pkg, index) => (
                <Card key={pkg.id} className="border-purple-200">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <Package className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <Input
                            value={pkg.name}
                            onChange={(e) => updatePackage(index, { name: e.target.value })}
                            placeholder="Package name"
                            className="text-lg font-semibold border-0 p-0 h-auto focus-visible:ring-0"
                          />
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => deletePackage(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={pkg.description}
                        onChange={(e) => updatePackage(index, { description: e.target.value })}
                        placeholder="Describe what's included in this package"
                        rows={2}
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Bundle Discount (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={pkg.discount_percentage}
                          onChange={(e) => updatePackage(index, { discount_percentage: parseInt(e.target.value) || 0 })}
                        />
                        <p className="text-xs text-slate-500">
                          Customers save {pkg.discount_percentage}% when booking this package
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label>Included Services</Label>
                        <div className="flex flex-wrap gap-2">
                          {DEMO_JOB_TYPES.slice(0, 4).map(jt => (
                            <button
                              key={jt.id}
                              onClick={() => {
                                const included = pkg.included_job_types.includes(jt.id)
                                  ? pkg.included_job_types.filter(id => id !== jt.id)
                                  : [...pkg.included_job_types, jt.id];
                                updatePackage(index, { included_job_types: included });
                              }}
                              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                                pkg.included_job_types.includes(jt.id)
                                  ? 'bg-purple-100 text-purple-700 border border-purple-300'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                              }`}
                            >
                              {jt.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Preview */}
      {showPreview && previewResult && (
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Live Preview
            </CardTitle>
            <CardDescription className="text-blue-700">
              Estimated price based on first answer option for each question
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500 uppercase tracking-wider">Base Price</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {formatCurrency(jobType.base_price || 0, company?.default_currency || 'USD', company?.default_language || 'en')}
                  </p>
                </div>

                {previewResult.breakdown.slice(1).map((step, i) => (
                  <div key={i} className="border-t pt-4">
                    <p className="text-sm text-slate-500">{step.description}</p>
                    <p className="font-semibold">
                      {formatCurrency(step.priceAfter, company?.default_currency || 'USD', company?.default_language || 'en')}
                    </p>
                  </div>
                ))}

                <div className="border-t-2 pt-4 mt-4">
                  <p className="text-sm text-slate-500 uppercase tracking-wider">Final Estimate Range</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {formatCurrency(previewResult.priceLow, company?.default_currency || 'USD', company?.default_language || 'en')}
                    {' - '}
                    {formatCurrency(previewResult.priceHigh, company?.default_currency || 'USD', company?.default_language || 'en')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
