'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, GripVertical, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import type { QuestionType, PriceModifierType, QuestionWithOptions, AnswerOption } from '@/types/database';
import { cn } from '@/lib/utils';

interface QuestionEditorProps {
  question: QuestionWithOptions;
  index: number;
  onUpdate: (question: QuestionWithOptions) => void;
  onDelete: () => void;
  currency: string;
}

const questionTypeOptions = [
  { value: 'single_choice', label: 'Enkelval' },
  { value: 'multiple_choice', label: 'Flerval' },
  { value: 'number_input', label: 'Sifferinmatning' },
  { value: 'text_input', label: 'Textinmatning' },
];

const modifierTypeOptions = [
  { value: 'fixed_add', label: 'Lagg till fast belopp' },
  { value: 'fixed_subtract', label: 'Dra av fast belopp' },
  { value: 'percentage_add', label: 'Lagg till procent' },
  { value: 'percentage_subtract', label: 'Dra av procent' },
  { value: 'multiply', label: 'Multiplicera' },
];

export function QuestionEditor({
  question,
  index,
  onUpdate,
  onDelete,
  currency,
}: QuestionEditorProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleQuestionChange = (field: string, value: string | boolean) => {
    onUpdate({
      ...question,
      [field]: value,
    });
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
      price_modifier_type: 'fixed_add',
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

  const showAnswerOptions =
    question.question_type === 'single_choice' ||
    question.question_type === 'multiple_choice';

  return (
    <Card className="border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <GripVertical className="h-5 w-5 cursor-grab text-slate-400" />
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-sm font-medium">
            {index + 1}
          </span>
          <CardTitle className="text-base">
            {question.question_text || 'Ny fraga'}
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
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
            className="h-8 w-8 text-red-500 hover:text-red-600"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4 pt-0">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`question-${question.id}`}>Fragetext</Label>
              <Input
                id={`question-${question.id}`}
                value={question.question_text}
                onChange={(e) =>
                  handleQuestionChange('question_text', e.target.value)
                }
                placeholder="T.ex. Vilken typ av installation behover du?"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`type-${question.id}`}>Fragetyp</Label>
              <Select
                id={`type-${question.id}`}
                value={question.question_type}
                onChange={(e) =>
                  handleQuestionChange('question_type', e.target.value as QuestionType)
                }
                options={questionTypeOptions}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`required-${question.id}`}
              checked={question.is_required}
              onChange={(e) =>
                handleQuestionChange('is_required', e.target.checked)
              }
              className="h-4 w-4 rounded border-slate-300"
            />
            <Label htmlFor={`required-${question.id}`}>Obligatorisk</Label>
          </div>

          {showAnswerOptions && (
            <div className="space-y-3">
              <Label>Svarsalternativ</Label>
              {question.answer_options.map((answer, answerIndex) => (
                <div
                  key={answer.id}
                  className="flex flex-wrap items-start gap-3 rounded-md border border-slate-200 bg-slate-50 p-3"
                >
                  <div className="flex-1 min-w-[200px]">
                    <Input
                      value={answer.answer_text}
                      onChange={(e) =>
                        handleAnswerChange(answerIndex, 'answer_text', e.target.value)
                      }
                      placeholder="Svarstext"
                    />
                  </div>
                  <div className="w-48">
                    <Select
                      value={answer.price_modifier_type}
                      onChange={(e) =>
                        handleAnswerChange(
                          answerIndex,
                          'price_modifier_type',
                          e.target.value as PriceModifierType
                        )
                      }
                      options={modifierTypeOptions}
                    />
                  </div>
                  <div className="w-32">
                    <Input
                      type="number"
                      value={answer.price_modifier_value}
                      onChange={(e) =>
                        handleAnswerChange(
                          answerIndex,
                          'price_modifier_value',
                          parseFloat(e.target.value) || 0
                        )
                      }
                      placeholder={
                        answer.price_modifier_type.includes('percentage')
                          ? '%'
                          : currency
                      }
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-red-500"
                    onClick={() => removeAnswerOption(answerIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addAnswerOption}>
                <Plus className="mr-2 h-4 w-4" />
                Lagg till alternativ
              </Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
