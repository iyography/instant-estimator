'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDashboardLanguage } from '@/hooks/use-dashboard-language';
import { createClient } from '@/lib/supabase/client';
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
  selectedService: string | null;
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
    selectedService: null,
  });
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  const suggestedServices = SUGGESTED_JOB_TYPES[state.industry]?.[state.language] || [];

  const handleNext = () => {
    setState((prev) => ({ ...prev, step: prev.step + 1 }));
  };

  const handleBack = () => {
    setState((prev) => ({ ...prev, step: prev.step - 1 }));
  };

  const createCompanyInDb = async (): Promise<Company | null> => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError('You must be logged in to create a company');
      return null;
    }

    const slug = generateSlug(state.companyName);

    const { data, error: dbError } = await supabase
      .from('companies')
      .insert({
        user_id: user.id,
        name: state.companyName,
        slug,
        email: state.email || null,
        phone: state.phone || null,
        website_url: state.website || null,
        industry: state.industry,
        default_currency: state.currency,
        default_language: state.language,
      })
      .select()
      .single();

    if (dbError) {
      setError(dbError.message);
      return null;
    }

    return data as Company;
  };

  const [error, setError] = useState<string | null>(null);

  const handleSetUpLater = async () => {
    setLoading(true);
    setError(null);

    const newCompany = await createCompanyInDb();
    if (newCompany) {
      setCompany(newCompany);
      router.push('/overview');
    }

    setLoading(false);
  };

  const handleCreateCompany = async () => {
    setLoading(true);
    setError(null);

    const newCompany = await createCompanyInDb();
    if (!newCompany) {
      setLoading(false);
      return;
    }

    // Create the selected job type
    if (state.selectedService) {
      const supabase = createClient();
      await supabase.from('job_types').insert({
        company_id: newCompany.id,
        name: state.selectedService,
        base_price: 0,
        is_active: true,
        display_order: 0,
      });
    }

    setCompany(newCompany);
    setLoading(false);
    handleNext();
  };

  const handleFinish = () => {
    router.push('/overview');
  };

  const copyEmbedCode = () => {
    if (company) {
      const code = `<script src="${window.location.origin}/api/widget/${company.slug}"></script>`;
      navigator.clipboard.writeText(code);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  const selectService = (service: string) => {
    setState((prev) => ({
      ...prev,
      selectedService: prev.selectedService === service ? null : service,
    }));
  };

  const canProceedStep1 = state.companyName.trim() !== '' && state.industry;
  const canProceedStep2 = true; // Language and currency have defaults
  const canProceedStep3 = state.selectedService !== null;

  const progressSteps = [
    t.onboarding.steps.company,
    t.onboarding.steps.settings,
    t.onboarding.steps.services || 'Services',
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

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

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

        {/* Step 3: Services (multi-select) */}
        {state.step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>{t.onboarding.services?.title || 'Services'}</CardTitle>
              <CardDescription>
                {t.onboarding.services?.description || 'Select the services that you offer'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>
                  {(t.onboarding.services?.suggestedFor || 'Suggested services for {industry}').replace(
                    '{industry}',
                    industryOptions.find(i => i.value === state.industry)?.label || ''
                  )}
                </Label>
                <p className="text-sm text-slate-500 mt-1 mb-3">
                  {state.selectedService
                    ? `Selected: ${state.selectedService}`
                    : 'Select a service for your estimator'
                  }
                </p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {suggestedServices.map((service) => (
                    <button
                      key={service}
                      onClick={() => selectService(service)}
                      className={`w-full rounded-lg border-2 p-3 text-left transition-all ${
                        state.selectedService === service
                          ? 'border-slate-900 bg-slate-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{service}</span>
                        {state.selectedService === service && (
                          <Check className="h-5 w-5 text-slate-900" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t.onboarding.back}
                </Button>
                <Button
                  onClick={handleCreateCompany}
                  disabled={!canProceedStep3 || loading}
                  isLoading={loading}
                  className="flex-1"
                >
                  {loading ? 'Creating...' : (
                    <>
                      {t.onboarding.next}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
              <div className="text-center">
                <button
                  onClick={handleSetUpLater}
                  disabled={loading}
                  className="text-sm text-slate-500 hover:text-slate-700 underline"
                >
                  {t.onboarding.services?.setUpLater || 'Set up later'}
                </button>
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
              {/* Public Link */}
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

              {/* Embed Code */}
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
                  {codeCopied ? 'Copied!' : t.onboarding.done.copyCode}
                </Button>
              </div>

              {/* Customize Form Section - Now BELOW copy code */}
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900">Customize your instant estimator</h4>
                    <p className="text-sm text-slate-600 mt-1">
                      Add your own questions, adjust pricing, and personalize the estimator for your business.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-3"
                      onClick={() => router.push('/forms')}
                    >
                      Edit instant estimator
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Go to Dashboard Button */}
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
