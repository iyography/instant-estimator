'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Trash2,
  GripVertical,
  Plus,
  ChevronDown,
  ChevronUp,
  Settings2,
  Link2,
  AlertCircle,
  Copy,
  HelpCircle,
  Package,
  Hash,
  ToggleLeft,
} from 'lucide-react';
import type { QuestionType, PriceModifierType, QuestionWithOptions, AnswerOption } from '@/types/database';
import { cn } from '@/lib/utils';

interface ConditionalLogic {
  questionId: string;
  answerId: string;
}

interface ExtendedQuestion extends QuestionWithOptions {
  condition?: ConditionalLogic | null;
  help_text?: string | null;
  min_quantity?: number;
  max_quantity?: number;
  quantity_label?: string;
}

interface QuestionEditorProps {
  question: ExtendedQuestion;
  index: number;
  onUpdate: (question: ExtendedQuestion) => void;
  onDelete: () => void;
  onDuplicate?: () => void;
  currency: string;
  allQuestions?: ExtendedQuestion[];
  allAnswers?: AnswerOption[];
  dragHandleProps?: Record<string, unknown>;
}

const questionTypeOptions = [
  { value: 'single_choice', label: 'Single Choice' },
  { value: 'multiple_choice', label: 'Multiple Choice' },
  { value: 'number_input', label: 'Number Input' },
  { value: 'text_input', label: 'Text Input' },
  { value: 'quantity', label: 'Quantity Selector' },
];

const modifierTypeOptions = [
  { value: 'fixed', label: 'Fixed Amount (+/-)' },
  { value: 'percentage', label: 'Percentage (+/-)' },
  { value: 'multiply', label: 'Multiply Base Price' },
  { value: 'per_unit', label: 'Per Unit (for quantity)' },
];

export function QuestionEditor({
  question,
  index,
  onUpdate,
  onDelete,
  onDuplicate,
  currency,
  allQuestions = [],
  allAnswers = [],
  dragHandleProps,
}: QuestionEditorProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showConditionBuilder, setShowConditionBuilder] = useState(!!question.condition);

  // Get available questions for conditional logic (questions before this one)
  const availableQuestions = useMemo(() => {
    return allQuestions
      .filter(q => q.id !== question.id && allQuestions.indexOf(q) < allQuestions.indexOf(question))
      .filter(q => q.question_type === 'single_choice' || q.question_type === 'multiple_choice');
  }, [allQuestions, question]);

  // Get answers for selected condition question
  const conditionAnswers = useMemo(() => {
    if (!question.condition?.questionId) return [];
    const targetQuestion = allQuestions.find(q => q.id === question.condition?.questionId);
    return targetQuestion?.answer_options || [];
  }, [allQuestions, question.condition?.questionId]);

  const handleQuestionChange = (field: string, value: string | boolean | number | ConditionalLogic | null) => {
    onUpdate({
      ...question,
      [field]: value,
    });
  };

  const handleConditionChange = (field: 'questionId' | 'answerId', value: string) => {
    if (field === 'questionId') {
      onUpdate({
        ...question,
        condition: value ? { questionId: value, answerId: '' } : null,
      });
    } else {
      onUpdate({
        ...question,
        condition: question.condition ? { ...question.condition, answerId: value } : null,
      });
    }
  };

  const handleAnswerChange = (
    answerIndex: number,
    field: keyof AnswerOption,
    value: string | number
  ) => {
    const updatedAnswers = [...question.answer_options];
    updatedAnswers[answerIndex] = {
      ...updatedAnswers[answerIndex],
      [field]: value,
    };
    onUpdate({
      ...question,
      answer_options: updatedAnswers,
    });
  };

  const addAnswerOption = () => {
    const newAnswer: AnswerOption = {
      id: `new-${Date.now()}`,
      question_id: question.id,
      answer_text: '',
      answer_text_sv: null,
      price_modifier_type: 'fixed' as PriceModifierType,
      price_modifier_value: 0,
      display_order: question.answer_options.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    onUpdate({
      ...question,
      answer_options: [...question.answer_options, newAnswer],
    });
  };

  const removeAnswerOption = (answerIndex: number) => {
    onUpdate({
      ...question,
      answer_options: question.answer_options.filter((_, i) => i !== answerIndex),
    });
  };

  const duplicateAnswerOption = (answerIndex: number) => {
    const original = question.answer_options[answerIndex];
    const duplicate: AnswerOption = {
      ...original,
      id: `new-${Date.now()}`,
      answer_text: `${original.answer_text} (copy)`,
      display_order: question.answer_options.length,
    };
    onUpdate({
      ...question,
      answer_options: [...question.answer_options, duplicate],
    });
  };

  const showAnswerOptions =
    question.question_type === 'single_choice' ||
    question.question_type === 'multiple_choice';

  const isQuantityType = question.question_type === 'quantity';

  const getQuestionTypeIcon = () => {
    switch (question.question_type) {
      case 'single_choice':
        return <ToggleLeft className="h-4 w-4" />;
      case 'multiple_choice':
        return <Package className="h-4 w-4" />;
      case 'quantity':
        return <Hash className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card className={cn(
      'border-slate-200 transition-all duration-200',
      question.condition && 'ml-6 border-l-4 border-l-blue-400'
    )}>
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <div
            {...dragHandleProps}
            className="cursor-grab active:cursor-grabbing touch-none"
          >
            <GripVertical className="h-5 w-5 text-slate-400 hover:text-slate-600" />
          </div>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 text-sm font-medium text-white">
            {index + 1}
          </span>
          <div className="flex flex-col">
            <CardTitle className="text-base flex items-center gap-2">
              {question.question_text || 'New Question'}
              {question.ai_generated && (
                <Badge variant="secondary" className="text-xs">AI</Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {getQuestionTypeIcon()}
                <span className="ml-1">
                  {questionTypeOptions.find(o => o.value === question.question_type)?.label}
                </span>
              </Badge>
              {question.condition && (
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  <Link2 className="h-3 w-3 mr-1" />
                  Conditional
                </Badge>
              )}
              {question.is_required && (
                <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                  Required
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {onDuplicate && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-500 hover:text-slate-700"
              onClick={onDuplicate}
              title="Duplicate question"
            >
              <Copy className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-500 hover:text-slate-700"
            onClick={() => setShowAdvanced(!showAdvanced)}
            title="Advanced settings"
          >
            <Settings2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4 pt-0">
          {/* Main question settings */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`question-${question.id}`}>Question Text</Label>
              <Input
                id={`question-${question.id}`}
                value={question.question_text}
                onChange={(e) => handleQuestionChange('question_text', e.target.value)}
                placeholder="E.g., What type of installation do you need?"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`type-${question.id}`}>Question Type</Label>
              <Select
                id={`type-${question.id}`}
                value={question.question_type}
                onChange={(e) => handleQuestionChange('question_type', e.target.value as QuestionType)}
                options={questionTypeOptions}
              />
            </div>
          </div>

          {/* Help text */}
          <div className="space-y-2">
            <Label htmlFor={`help-${question.id}`} className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-slate-400" />
              Help Text (optional)
            </Label>
            <Input
              id={`help-${question.id}`}
              value={question.help_text || ''}
              onChange={(e) => handleQuestionChange('help_text', e.target.value)}
              placeholder="Additional context shown below the question"
            />
          </div>

          {/* Required checkbox */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={question.is_required}
                onChange={(e) => handleQuestionChange('is_required', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Required question</span>
            </label>
          </div>

          {/* Quantity settings */}
          {isQuantityType && (
            <div className="p-4 rounded-lg bg-purple-50 border border-purple-100 space-y-4">
              <h4 className="font-medium text-purple-900 flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Quantity Settings
              </h4>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Label</Label>
                  <Input
                    value={question.quantity_label || ''}
                    onChange={(e) => handleQuestionChange('quantity_label', e.target.value)}
                    placeholder="e.g., Number of outlets"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Min Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    value={question.min_quantity || 1}
                    onChange={(e) => handleQuestionChange('min_quantity', parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    value={question.max_quantity || 10}
                    onChange={(e) => handleQuestionChange('max_quantity', parseInt(e.target.value) || 10)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Price Per Unit ({currency})</Label>
                <Input
                  type="number"
                  value={(question.answer_options[0]?.price_modifier_value || 0) / 100}
                  onChange={(e) => {
                    const value = Math.round(parseFloat(e.target.value) * 100) || 0;
                    if (question.answer_options.length === 0) {
                      onUpdate({
                        ...question,
                        answer_options: [{
                          id: `qty-${Date.now()}`,
                          question_id: question.id,
                          answer_text: 'Per unit',
                          answer_text_sv: null,
                          price_modifier_type: 'per_unit' as PriceModifierType,
                          price_modifier_value: value,
                          display_order: 0,
                          created_at: new Date().toISOString(),
                          updated_at: new Date().toISOString(),
                        }],
                      });
                    } else {
                      handleAnswerChange(0, 'price_modifier_value', value);
                    }
                  }}
                  placeholder="0"
                />
                <p className="text-xs text-slate-500">
                  Total = Quantity × Price Per Unit
                </p>
              </div>
            </div>
          )}

          {/* Conditional Logic Section */}
          {availableQuestions.length > 0 && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setShowConditionBuilder(!showConditionBuilder)}
                className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                <Link2 className="h-4 w-4" />
                {showConditionBuilder ? 'Hide' : 'Add'} Conditional Logic
              </button>

              {showConditionBuilder && (
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-100 space-y-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                    <p className="text-sm text-blue-700">
                      Only show this question when a specific answer is selected in a previous question.
                    </p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>When question</Label>
                      <Select
                        value={question.condition?.questionId || ''}
                        onChange={(e) => handleConditionChange('questionId', e.target.value)}
                        options={[
                          { value: '', label: 'Always show (no condition)' },
                          ...availableQuestions.map(q => ({
                            value: q.id,
                            label: q.question_text || `Question ${allQuestions.indexOf(q) + 1}`,
                          })),
                        ]}
                      />
                    </div>
                    {question.condition?.questionId && conditionAnswers.length > 0 && (
                      <div className="space-y-2">
                        <Label>Has answer</Label>
                        <Select
                          value={question.condition?.answerId || ''}
                          onChange={(e) => handleConditionChange('answerId', e.target.value)}
                          options={[
                            { value: '', label: 'Select an answer...' },
                            ...conditionAnswers.map(a => ({
                              value: a.id,
                              label: a.answer_text,
                            })),
                          ]}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Answer Options */}
          {showAnswerOptions && (
            <div className="space-y-3">
              <Label className="flex items-center justify-between">
                <span>Answer Options</span>
                <span className="text-xs text-slate-500 font-normal">
                  {question.answer_options.length} option{question.answer_options.length !== 1 ? 's' : ''}
                </span>
              </Label>

              <div className="space-y-2">
                {question.answer_options.map((answer, answerIndex) => (
                  <div
                    key={answer.id}
                    className="group flex flex-wrap items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex-1 min-w-[200px]">
                      <Input
                        value={answer.answer_text}
                        onChange={(e) => handleAnswerChange(answerIndex, 'answer_text', e.target.value)}
                        placeholder="Answer text"
                        className="bg-slate-50 focus:bg-white"
                      />
                    </div>
                    <div className="w-44">
                      <Select
                        value={answer.price_modifier_type}
                        onChange={(e) => handleAnswerChange(answerIndex, 'price_modifier_type', e.target.value as PriceModifierType)}
                        options={modifierTypeOptions}
                      />
                    </div>
                    <div className="w-28">
                      <Input
                        type="number"
                        value={
                          answer.price_modifier_type === 'fixed' || answer.price_modifier_type === 'per_unit'
                            ? answer.price_modifier_value / 100
                            : answer.price_modifier_value
                        }
                        onChange={(e) => {
                          const rawValue = parseFloat(e.target.value) || 0;
                          const value = answer.price_modifier_type === 'fixed' || answer.price_modifier_type === 'per_unit'
                            ? Math.round(rawValue * 100)
                            : rawValue;
                          handleAnswerChange(answerIndex, 'price_modifier_value', value);
                        }}
                        placeholder={answer.price_modifier_type === 'percentage' ? '%' : currency}
                      />
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600"
                        onClick={() => duplicateAnswerOption(answerIndex)}
                        title="Duplicate"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 text-red-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => removeAnswerOption(answerIndex)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="outline" size="sm" onClick={addAnswerOption} className="w-full border-dashed">
                <Plus className="mr-2 h-4 w-4" />
                Add Answer Option
              </Button>
            </div>
          )}

          {/* Advanced Settings */}
          {showAdvanced && (
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-4">
              <h4 className="font-medium text-slate-900 flex items-center gap-2">
                <Settings2 className="h-4 w-4" />
                Advanced Settings
              </h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`question-sv-${question.id}`}>Swedish Translation</Label>
                  <Input
                    id={`question-sv-${question.id}`}
                    value={question.question_text_sv || ''}
                    onChange={(e) => handleQuestionChange('question_text_sv', e.target.value)}
                    placeholder="Swedish version of question"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`order-${question.id}`}>Display Order</Label>
                  <Input
                    id={`order-${question.id}`}
                    type="number"
                    value={question.display_order}
                    onChange={(e) => handleQuestionChange('display_order', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
