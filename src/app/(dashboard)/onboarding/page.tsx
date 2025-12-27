'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDashboardLanguage } from '@/hooks/use-dashboard-language';
import { DEMO_COMPANY } from '@/lib/demo/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { generateSlug } from '@/lib/utils';
import { SUGGESTED_JOB_TYPES } from '@/lib/ai/suggestions';
import { Check, ArrowRight, ArrowLeft, Sparkles, Copy, ExternalLink } from 'lucide-react';
import type { Industry, Currency, Language, Company } from '@/types/database';

interface OnboardingState {
  step: number;
  companyName: string;
  industry: Industry;
  email: string;
  phone: string;
  website: string;
  currency: Currency;
  language: Language;
  selectedJobType: string | null;
  customJobType: string;
  basePrice: number;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { t, language: dashboardLanguage } = useDashboardLanguage();

  const industryOptions = [
    { value: 'electrician', label: t.settings.industries.electrician },
    { value: 'plumber', label: t.settings.industries.plumber },
    { value: 'hvac', label: t.settings.industries.hvac },
    { value: 'general_contractor', label: t.settings.industries.general_contractor },
    { value: 'painter', label: t.settings.industries.painter },
    { value: 'landscaper', label: t.settings.industries.landscaper },
    { value: 'roofing', label: t.settings.industries.roofing },
    { value: 'cleaning', label: t.settings.industries.cleaning },
    { value: 'other', label: t.settings.industries.other },
  ];

  const currencyOptions = [
    { value: 'SEK', label: t.settings.currencies.SEK },
    { value: 'EUR', label: t.settings.currencies.EUR },
    { value: 'USD', label: t.settings.currencies.USD },
  ];

  const languageOptions = [
    { value: 'sv', label: t.settings.languages.sv },
    { value: 'en', label: t.settings.languages.en },
  ];

  const [state, setState] = useState<OnboardingState>({
    step: 1,
    companyName: '',
    industry: 'electrician',
    email: '',
    phone: '',
    website: '',
    currency: 'USD',
    language: 'en',
    selectedJobType: null,
    customJobType: '',
    basePrice: 0,
  });
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);

  const suggestedJobTypes = SUGGESTED_JOB_TYPES[state.industry]?.[state.language] || [];

  const handleNext = () => {
    setState((prev) => ({ ...prev, step: prev.step + 1 }));
  };

  const handleBack = () => {
    setState((prev) => ({ ...prev, step: prev.step - 1 }));
  };

  const handleCreateCompany = async () => {
    setLoading(true);
    setAiLoading(true);

    // Simulate company creation
    await new Promise(resolve => setTimeout(resolve, 1500));

    const demoCompany = {
      ...DEMO_COMPANY,
      name: state.companyName || DEMO_COMPANY.name,
      slug: generateSlug(state.companyName || DEMO_COMPANY.name),
      industry: state.industry,
      default_currency: state.currency,
      default_language: state.language,
    } as unknown as Company;

    setCompany(demoCompany);
    setLoading(false);
    setAiLoading(false);
    handleNext();
  };

  const handleFinish = () => {
    router.push('/overview');
  };

  const copyEmbedCode = () => {
    if (company) {
      const code = `<script src="${window.location.origin}/api/widget/${company.slug}"></script>`;
      navigator.clipboard.writeText(code);
    }
  };

  const canProceedStep1 = state.companyName.trim() !== '' && state.industry;
  const canProceedStep2 = true; // Language and currency have defaults
  const canProceedStep3 = state.selectedJobType || state.customJobType.trim() !== '';

  const progressSteps = [
    t.onboarding.steps.company,
    t.onboarding.steps.settings,
    t.onboarding.steps.jobType,
    t.onboarding.steps.done,
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            {t.onboarding.welcome}
          </h1>
          <p className="mt-1 text-slate-600">
            {t.onboarding.subtitle}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
            <div className="flex justify-between text-sm">
              {progressSteps.map((label, i) => (
                <div
                  key={label}
                  className={`flex flex-col items-center ${
                    state.step > i + 1
                      ? 'text-green-600'
                      : state.step === i + 1
                      ? 'text-slate-900'
                      : 'text-slate-400'
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                      state.step > i + 1
                        ? 'bg-green-100'
                        : state.step === i + 1
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-200'
                    }`}
                  >
                    {state.step > i + 1 ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span className="mt-1 text-xs">{label}</span>
                </div>
              ))}
            </div>
          </div>

        {/* Step 1: Company Info */}
        {state.step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>{t.onboarding.companyInfo.title}</CardTitle>
              <CardDescription>
                {t.onboarding.companyInfo.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="companyName" required>{t.onboarding.companyInfo.companyName}</Label>
                <Input
                  id="companyName"
                  value={state.companyName}
                  onChange={(e) =>
                    setState((prev) => ({ ...prev, companyName: e.target.value }))
                  }
                  placeholder={t.onboarding.companyInfo.companyNamePlaceholder}
                />
              </div>
              <div>
                <Label htmlFor="industry" required>{t.onboarding.companyInfo.industry}</Label>
                <Select
                  id="industry"
                  value={state.industry}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      industry: e.target.value as Industry,
                    }))
                  }
                  options={industryOptions}
                />
              </div>
              <div>
                <Label htmlFor="email">{t.onboarding.companyInfo.email}</Label>
                <Input
                  id="email"
                  type="email"
                  value={state.email}
                  onChange={(e) =>
                    setState((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="info@company.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">{t.onboarding.companyInfo.phone}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={state.phone}
                  onChange={(e) =>
                    setState((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="pt-4">
                <Button
                  onClick={handleNext}
                  disabled={!canProceedStep1}
                  className="w-full"
                >
                  {t.onboarding.next}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Language & Currency */}
        {state.step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>{t.onboarding.languageCurrency.title}</CardTitle>
              <CardDescription>
                {t.onboarding.languageCurrency.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="language">{t.onboarding.languageCurrency.defaultLanguage}</Label>
                <Select
                  id="language"
                  value={state.language}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      language: e.target.value as Language,
                    }))
                  }
                  options={languageOptions}
                />
              </div>
              <div>
                <Label htmlFor="currency">{t.onboarding.languageCurrency.defaultCurrency}</Label>
                <Select
                  id="currency"
                  value={state.currency}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      currency: e.target.value as Currency,
                    }))
                  }
                  options={currencyOptions}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t.onboarding.back}
                </Button>
                <Button onClick={handleNext} disabled={!canProceedStep2} className="flex-1">
                  {t.onboarding.next}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Job Type */}
        {state.step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>{t.onboarding.jobType.title}</CardTitle>
              <CardDescription>
                {t.onboarding.jobType.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{t.onboarding.jobType.suggestedFor.replace('{industry}', industryOptions.find(i => i.value === state.industry)?.label || '')}</Label>
                <div className="mt-2 space-y-2">
                  {suggestedJobTypes.slice(0, 5).map((jobType) => (
                    <button
                      key={jobType}
                      onClick={() =>
                        setState((prev) => ({
                          ...prev,
                          selectedJobType: jobType,
                          customJobType: '',
                        }))
                      }
                      className={`w-full rounded-lg border-2 p-3 text-left transition-all ${
                        state.selectedJobType === jobType
                          ? 'border-slate-900 bg-slate-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{jobType}</span>
                        {state.selectedJobType === jobType && (
                          <Check className="h-5 w-5 text-slate-900" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-500">{t.onboarding.jobType.or}</span>
                </div>
              </div>
              <div>
                <Label htmlFor="customJobType">{t.onboarding.jobType.customJobType}</Label>
                <Input
                  id="customJobType"
                  value={state.customJobType}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      customJobType: e.target.value,
                      selectedJobType: null,
                    }))
                  }
                  placeholder={t.onboarding.jobType.customJobTypePlaceholder}
                />
              </div>
              <div>
                <Label htmlFor="basePrice">{t.onboarding.jobType.basePrice.replace('{currency}', state.currency)}</Label>
                <Input
                  id="basePrice"
                  type="number"
                  value={state.basePrice || ''}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      basePrice: parseFloat(e.target.value) || 0,
                    }))
                  }
                  placeholder="0"
                />
                <p className="mt-1 text-xs text-slate-500">
                  {t.onboarding.jobType.basePriceHelp}
                </p>
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t.onboarding.back}
                </Button>
                <Button
                  onClick={handleCreateCompany}
                  disabled={!canProceedStep3 || loading}
                  isLoading={loading || aiLoading}
                  className="flex-1"
                >
                  {loading || aiLoading ? (
                    t.onboarding.jobType.creating
                  ) : (
                    <>
                      {t.onboarding.next}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Done */}
        {state.step === 4 && company && (
          <Card>
            <CardHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-center">{t.onboarding.done.title}</CardTitle>
              <CardDescription className="text-center">
                {t.onboarding.done.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Edit Form Button */}
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900">Customize Your Form</h4>
                    <p className="text-sm text-slate-600 mt-1">
                      Add your own questions, adjust pricing, and personalize the estimator for your business.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-3"
                      onClick={() => router.push('/forms')}
                    >
                      Edit Form
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <Label>{t.onboarding.done.publicLink}</Label>
                <div className="mt-2 flex items-center gap-2">
                  <Input
                    readOnly
                    value={`${window.location.origin}/e/${company.slug}`}
                  />
                  <a
                    href={`${window.location.origin}/e/${company.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                </div>
              </div>
              <div>
                <Label>{t.onboarding.done.embedCode}</Label>
                <div className="mt-2 rounded-md bg-slate-100 p-3">
                  <code className="text-sm text-slate-800 break-all">
                    {`<script src="${window.location.origin}/api/widget/${company.slug}"></script>`}
                  </code>
                </div>
                <Button
                  variant="outline"
                  className="mt-2 w-full"
                  onClick={copyEmbedCode}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  {t.onboarding.done.copyCode}
                </Button>
              </div>
              <Button onClick={handleFinish} className="w-full">
                {t.onboarding.done.goToDashboard}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
