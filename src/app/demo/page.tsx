'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  DEMO_JOB_TYPES,
  DEMO_QUESTIONS,
  DEMO_ANSWERS,
  DEMO_COMPANY
} from '@/lib/demo/data';
import {
  Zap,
  Plug,
  Lightbulb,
  BatteryCharging,
  Home,
  Wind,
  Power,
  Smartphone,
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  Calculator,
  Clock,
  Shield,
  ChevronDown,
  X
} from 'lucide-react';

// Icon mapping for job types
const iconMap: Record<string, React.ElementType> = {
  'zap': Zap,
  'plug': Plug,
  'lightbulb': Lightbulb,
  'battery-charging': BatteryCharging,
  'home': Home,
  'wind': Wind,
  'power': Power,
  'smartphone': Smartphone,
};

// Animated counter component for price display
function AnimatedPrice({ value, className }: { value: number; className?: string }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const duration = 500;
    const startTime = Date.now();
    const startValue = displayValue;
    const diff = value - startValue;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + diff * eased;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <span className={className}>
      ${(displayValue / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
    </span>
  );
}

// Progress bar component
function ProgressBar({ current, total }: { current: number; total: number }) {
  const percentage = (current / total) * 100;

  return (
    <div className="relative">
      <div className="flex justify-between text-xs sm:text-sm text-slate-500 mb-2">
        <span>Question {current} of {total}</span>
        <span>{Math.round(percentage)}% complete</span>
      </div>
      <div className="h-1.5 sm:h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Step indicator dots
function StepIndicator({ steps, currentStep, onStepClick }: {
  steps: number;
  currentStep: number;
  onStepClick?: (step: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: steps }).map((_, i) => (
        <button
          key={i}
          onClick={() => onStepClick?.(i)}
          disabled={i > currentStep}
          className={cn(
            'w-2.5 h-2.5 rounded-full transition-all duration-300',
            i === currentStep
              ? 'w-8 bg-gradient-to-r from-blue-500 to-purple-500'
              : i < currentStep
                ? 'bg-green-500 hover:bg-green-600 cursor-pointer'
                : 'bg-slate-200'
          )}
        />
      ))}
    </div>
  );
}

// Answer option component
function AnswerOption({
  answer,
  isSelected,
  onSelect,
  showPrice = true
}: {
  answer: typeof DEMO_ANSWERS[0];
  isSelected: boolean;
  onSelect: () => void;
  showPrice?: boolean;
}) {
  const priceChange = answer.price_modifier_value;
  const isPercentage = answer.price_modifier_type === 'percentage';

  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 text-left transition-all duration-300 group active:scale-[0.99]',
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10'
          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className={cn(
            'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0',
            isSelected
              ? 'border-blue-500 bg-blue-500'
              : 'border-slate-300 group-hover:border-slate-400'
          )}>
            {isSelected && <Check className="w-3 h-3 text-white" />}
          </div>
          <span className={cn(
            'font-medium transition-colors text-sm sm:text-base',
            isSelected ? 'text-slate-900' : 'text-slate-700'
          )}>
            {answer.answer_text}
          </span>
        </div>
        {showPrice && priceChange !== 0 && (
          <span className={cn(
            'text-xs sm:text-sm font-medium px-2 py-0.5 sm:py-1 rounded-full flex-shrink-0',
            priceChange > 0
              ? 'bg-amber-100 text-amber-700'
              : 'bg-green-100 text-green-700'
          )}>
            {priceChange > 0 ? '+' : ''}
            {isPercentage
              ? `${priceChange}%`
              : `$${(priceChange / 100).toLocaleString()}`
            }
          </span>
        )}
      </div>
    </button>
  );
}

// Estimate breakdown item
function BreakdownItem({
  label,
  amount,
  isNew = false
}: {
  label: string;
  amount: number;
  isNew?: boolean;
}) {
  return (
    <div className={cn(
      'flex justify-between items-center py-2 transition-all duration-500 gap-2',
      isNew && 'animate-fade-in-slide'
    )}>
      <span className="text-slate-600 text-xs sm:text-sm truncate">{label}</span>
      <span className={cn(
        'font-medium text-xs sm:text-sm flex-shrink-0',
        amount >= 0 ? 'text-slate-900' : 'text-green-600'
      )}>
        {amount >= 0 ? '' : '-'}${Math.abs(amount / 100).toLocaleString()}
      </span>
    </div>
  );
}

export default function LiveDemoPage() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<'select' | 'questions' | 'contact' | 'result'>('select');
  const [selectedJobType, setSelectedJobType] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [contactInfo, setContactInfo] = useState({ name: '', email: '', phone: '', address: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [breakdownItems, setBreakdownItems] = useState<Array<{ label: string; amount: number }>>([]);

  // Pre-populate contact info from URL parameters
  useEffect(() => {
    const name = searchParams.get('name') || searchParams.get('customer_name') || '';
    const email = searchParams.get('email') || searchParams.get('customer_email') || '';
    const phone = searchParams.get('phone') || searchParams.get('customer_phone') || '';
    const address = searchParams.get('address') || searchParams.get('location') || '';

    // Also support company-related params
    const company = searchParams.get('company') || '';
    const fullName = name || (company ? `${company} Contact` : '');

    if (fullName || email || phone || address) {
      setContactInfo({
        name: fullName,
        email,
        phone,
        address
      });
    }

    // Pre-select service if specified
    const service = searchParams.get('service') || searchParams.get('job_type') || '';
    if (service) {
      const matchingService = DEMO_JOB_TYPES.find(jt =>
        jt.name.toLowerCase().includes(service.toLowerCase()) ||
        jt.id === service
      );
      if (matchingService) {
        setSelectedJobType(matchingService.id);
        setStep('questions');
      }
    }
  }, [searchParams]);

  // Get the selected job type data
  const jobType = useMemo(() =>
    DEMO_JOB_TYPES.find(jt => jt.id === selectedJobType),
    [selectedJobType]
  );

  // Get questions for selected job type with conditional logic
  const questions = useMemo(() => {
    if (!selectedJobType) return [];
    return DEMO_QUESTIONS.filter(q => {
      if (q.job_type_id !== selectedJobType) return false;
      // Check conditional logic
      if (q.condition) {
        const parentAnswer = answers[q.condition.questionId];
        if (parentAnswer !== q.condition.answerId) return false;
      }
      return true;
    }).sort((a, b) => a.display_order - b.display_order);
  }, [selectedJobType, answers]);

  // Get answers for current question
  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswers = useMemo(() =>
    currentQuestion
      ? DEMO_ANSWERS.filter(a => a.question_id === currentQuestion.id)
          .sort((a, b) => a.display_order - b.display_order)
      : [],
    [currentQuestion]
  );

  // Calculate total price
  const calculatePrice = useCallback((): { low: number; high: number; exact: number; breakdown: Array<{ label: string; amount: number }> } => {
    if (!jobType) return { low: 0, high: 0, exact: 0, breakdown: [] };

    let total = jobType.base_price;
    const breakdown: Array<{ label: string; amount: number }> = [
      { label: `Base ${jobType.name}`, amount: jobType.base_price }
    ];

    Object.entries(answers).forEach(([questionId, answerId]) => {
      const answer = DEMO_ANSWERS.find(a => a.id === answerId);
      if (answer && answer.price_modifier_value !== 0) {
        let modifier = answer.price_modifier_value;
        if (answer.price_modifier_type === 'percentage') {
          modifier = Math.round(jobType.base_price * (answer.price_modifier_value / 100));
        }
        total += modifier;
        breakdown.push({ label: answer.answer_text, amount: modifier });
      }
    });

    const lowMultiplier = 1 - (DEMO_COMPANY.settings.estimate_range_low_percentage / 100);
    const highMultiplier = 1 + (DEMO_COMPANY.settings.estimate_range_high_percentage / 100);

    return {
      low: Math.round(total * lowMultiplier),
      high: Math.round(total * highMultiplier),
      exact: Math.round(total),
      breakdown
    };
  }, [jobType, answers]);

  const price = calculatePrice();

  // Update breakdown when answers change
  useEffect(() => {
    setBreakdownItems(price.breakdown);
  }, [price.breakdown.length]);

  const handleSelectJobType = (id: string) => {
    setSelectedJobType(id);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setTimeout(() => setStep('questions'), 100);
  };

  const handleAnswerSelect = (answerId: string) => {
    if (!currentQuestion) return;

    // Clear dependent answers when parent changes
    const newAnswers = { ...answers };
    const dependentQuestions = DEMO_QUESTIONS.filter(q =>
      q.condition?.questionId === currentQuestion.id
    );
    dependentQuestions.forEach(q => {
      delete newAnswers[q.id];
    });

    newAnswers[currentQuestion.id] = answerId;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setStep('contact');
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      setStep('select');
      setSelectedJobType(null);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setStep('result');
  };

  const handleStartOver = () => {
    setStep('select');
    setSelectedJobType(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setContactInfo({ name: '', email: '', phone: '', address: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Custom animations */}
      <style jsx global>{`
        @keyframes fadeInSlide {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.5); }
        }
        .animate-fade-in-slide {
          animation: fadeInSlide 0.4s ease-out forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out forwards;
        }
        .animate-pulse-glow {
          animation: pulseGlow 2s ease-in-out infinite;
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900">Instant Estimator</span>
            </Link>

            <Link href="/">
              <Button variant="ghost" size="sm">
                <X className="h-4 w-4 mr-1" />
                Exit Demo
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Service Selection Step */}
        {step === 'select' && (
          <div className="animate-fade-in-slide">
            <div className="text-center mb-8 sm:mb-12 px-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-blue-700 mb-3 sm:mb-4">
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Live Demo
              </span>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-3 sm:mb-4 leading-tight">
                Get Your Instant Estimate
              </h1>
              <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto px-2">
                Select the service you need and answer a few questions to get an accurate price estimate in seconds.
              </p>
            </div>

            {/* Service Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {DEMO_JOB_TYPES.filter(jt => jt.is_active).map((jt, index) => {
                const Icon = iconMap[jt.icon] || Zap;
                const categoryColors = {
                  major: 'from-red-500 to-orange-500',
                  standard: 'from-blue-500 to-cyan-500',
                  specialty: 'from-purple-500 to-pink-500',
                };
                const bgColor = categoryColors[jt.category as keyof typeof categoryColors] || categoryColors.standard;

                return (
                  <button
                    key={jt.id}
                    onClick={() => handleSelectJobType(jt.id)}
                    className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white border border-slate-200 p-4 sm:p-6 text-left transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 hover:border-slate-300 active:scale-[0.98]"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className={cn(
                      'w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br flex items-center justify-center mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-110',
                      bgColor
                    )}>
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1 text-sm sm:text-base">{jt.name}</h3>
                    <p className="text-xs sm:text-sm text-slate-500 mb-2 sm:mb-3 line-clamp-2">{jt.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-medium text-slate-900">
                        From ${(jt.min_price / 100).toLocaleString()}
                      </span>
                      <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                    </div>

                    {/* Hover gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </button>
                );
              })}
            </div>

            {/* Trust indicators */}
            <div className="mt-8 sm:mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-slate-500 px-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Calculator className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                <span>Accurate pricing</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                <span>Takes 2 minutes</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                <span>No commitment</span>
              </div>
            </div>
          </div>
        )}

        {/* Questions Step */}
        {step === 'questions' && currentQuestion && (
          <div className="max-w-2xl mx-auto animate-scale-in">
            {/* Progress */}
            <div className="mb-4 sm:mb-8">
              <ProgressBar current={currentQuestionIndex + 1} total={questions.length} />
            </div>

            {/* Question Card */}
            <Card className="p-4 sm:p-8 shadow-xl shadow-slate-200/50 border-slate-200">
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-blue-600 font-medium mb-2">
                  {jobType && (
                    <>
                      {(() => {
                        const Icon = iconMap[jobType.icon] || Zap;
                        return <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />;
                      })()}
                      {jobType.name}
                    </>
                  )}
                </div>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900">
                  {currentQuestion.question_text}
                </h2>
                {currentQuestion.help_text && (
                  <p className="mt-2 text-slate-500">
                    {currentQuestion.help_text}
                  </p>
                )}
              </div>

              {/* Answer Options */}
              <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                {currentAnswers.map(answer => (
                  <AnswerOption
                    key={answer.id}
                    answer={answer}
                    isSelected={answers[currentQuestion.id] === answer.id}
                    onSelect={() => handleAnswerSelect(answer.id)}
                    showPrice={false}
                  />
                ))}
              </div>

              {/* Navigation */}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
                <Button variant="ghost" onClick={handleBack} className="w-full sm:w-auto h-11 sm:h-10">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!answers[currentQuestion.id]}
                  className="w-full sm:w-auto h-12 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-base sm:text-sm"
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Continue' : 'Get Estimate'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </Card>

            {/* Step Indicator */}
            <div className="mt-6">
              <StepIndicator
                steps={questions.length}
                currentStep={currentQuestionIndex}
                onStepClick={(i) => i <= currentQuestionIndex && setCurrentQuestionIndex(i)}
              />
            </div>
          </div>
        )}

        {/* Contact Info Step */}
        {step === 'contact' && (
          <div className="max-w-2xl mx-auto animate-scale-in">
            <Card className="p-4 sm:p-8 shadow-xl shadow-slate-200/50 border-slate-200">
              <div className="text-center mb-6 sm:mb-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Check className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                  Almost Done!
                </h2>
                <p className="text-sm sm:text-base text-slate-600">
                  Enter your details to receive your personalized estimate.
                </p>
              </div>

              {/* Estimate Ready Message */}
              <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 mb-6 sm:mb-8">
                <div className="flex items-center justify-center gap-2.5 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm sm:text-base">Your estimate is ready!</p>
                    <p className="text-xs sm:text-sm text-slate-600">Enter your details below to view it</p>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={contactInfo.name}
                    onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-base"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-base"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-base"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    value={contactInfo.address}
                    onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-base"
                    placeholder="123 Main St, Austin, TX"
                  />
                </div>
              </div>

              {/* Navigation */}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-6 sm:mt-8 pt-4 border-t border-slate-100">
                <Button variant="ghost" onClick={() => setStep('questions')} className="w-full sm:w-auto h-11 sm:h-10">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!contactInfo.name || !contactInfo.email || !contactInfo.address}
                  isLoading={isSubmitting}
                  className="w-full sm:w-auto h-12 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 text-base sm:text-sm"
                >
                  Get My Estimate
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Result Step */}
        {step === 'result' && (
          <div className="max-w-3xl mx-auto animate-scale-in">
            {/* Success Header */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-pulse-glow">
                <Check className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                Your Estimate is Ready!
              </h1>
              <p className="text-sm sm:text-lg text-slate-600 px-2">
                We've sent a copy to {contactInfo.email}
              </p>
            </div>

            {/* Estimate Card */}
            <Card className="overflow-hidden shadow-2xl shadow-slate-200/50 border-slate-200">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-6 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  <div>
                    <p className="text-blue-100 text-xs sm:text-sm mb-1">Estimate for</p>
                    <h2 className="text-lg sm:text-2xl font-bold">{jobType?.name}</h2>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-blue-100 text-xs sm:text-sm mb-1">Estimated Price Range</p>
                    <div className="text-xl sm:text-3xl font-bold">
                      ${(price.low / 100).toLocaleString()} - ${(price.high / 100).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                  <div>
                    <span className="text-slate-500 text-xs sm:text-sm">Customer</span>
                    <p className="font-medium text-slate-900">{contactInfo.name}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs sm:text-sm">Email</span>
                    <p className="font-medium text-slate-900 break-all">{contactInfo.email}</p>
                  </div>
                  {contactInfo.phone && (
                    <div>
                      <span className="text-slate-500 text-xs sm:text-sm">Phone</span>
                      <p className="font-medium text-slate-900">{contactInfo.phone}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-500 text-xs sm:text-sm">Address</span>
                    <p className="font-medium text-slate-900">{contactInfo.address}</p>
                  </div>
                </div>
              </div>

              {/* Breakdown */}
              <div className="p-4 sm:p-6">
                <h3 className="font-semibold text-slate-900 mb-3 sm:mb-4 text-sm sm:text-base">Price Breakdown</h3>
                <div className="space-y-1 divide-y divide-slate-100">
                  {price.breakdown.map((item, index) => (
                    <BreakdownItem
                      key={index}
                      label={item.label}
                      amount={item.amount}
                    />
                  ))}
                </div>
                <div className="flex justify-between items-center pt-3 sm:pt-4 mt-3 sm:mt-4 border-t-2 border-slate-200">
                  <span className="font-semibold text-slate-900 text-sm sm:text-base">Total Estimate</span>
                  <span className="text-xl sm:text-2xl font-bold text-slate-900">
                    ${(price.exact / 100).toLocaleString()}
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-500 mt-2">
                  * Final price may vary based on site conditions. This estimate is valid for 30 days.
                </p>
              </div>

              {/* CTA */}
              <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-12"
                  >
                    Schedule Consultation
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 h-12"
                    onClick={handleStartOver}
                  >
                    Get Another Estimate
                  </Button>
                </div>
              </div>
            </Card>

            {/* Company Info */}
            <div className="mt-6 sm:mt-8 text-center">
              <p className="text-xs sm:text-sm text-slate-500 mb-1 sm:mb-2">Estimate provided by</p>
              <p className="font-semibold text-slate-900 text-sm sm:text-base">{DEMO_COMPANY.name}</p>
              <p className="text-xs sm:text-sm text-slate-500">{DEMO_COMPANY.phone}</p>
            </div>

            {/* Back to Home */}
            <div className="mt-6 sm:mt-8 text-center pb-4">
              <Link href="/">
                <Button variant="ghost" className="h-11 sm:h-10">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
