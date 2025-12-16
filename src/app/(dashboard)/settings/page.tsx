'use client';

import { useState, useEffect } from 'react';
import { useCompany } from '@/hooks/use-company';
import { useDashboardLanguage } from '@/hooks/use-dashboard-language';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BillingCard } from '@/components/billing/billing-card';
import { Save, Copy, ExternalLink } from 'lucide-react';
import type { Industry, Currency, Language } from '@/types/database';

export default function SettingsPage() {
  const { company, refetch } = useCompany();
  const { t, language } = useDashboardLanguage();

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

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    website_url: '',
    industry: 'electrician' as Industry,
    default_currency: 'SEK' as Currency,
    default_language: 'sv' as Language,
    estimate_range_low: 10,
    estimate_range_high: 15,
    notification_email: '',
    widget_primary_color: '#0f172a',
    allowed_domains: '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (company) {
      setFormState({
        name: company.name || '',
        email: company.email || '',
        phone: company.phone || '',
        website_url: company.website_url || '',
        industry: company.industry,
        default_currency: company.default_currency,
        default_language: company.default_language,
        estimate_range_low: company.settings?.estimate_range_low_percentage ?? 10,
        estimate_range_high: company.settings?.estimate_range_high_percentage ?? 15,
        notification_email: company.settings?.notification_email || '',
        widget_primary_color: company.settings?.widget_primary_color || '#0f172a',
        allowed_domains: company.settings?.allowed_domains?.join('\n') || '',
      });
    }
  }, [company]);

  const handleSave = async () => {
    if (!company) return;

    setSaving(true);
    setMessage(null);

    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 500));
    setMessage({ type: 'success', text: t.settings.messages.saved });
    setSaving(false);
  };

  const copyEmbedCode = () => {
    if (company) {
      const code = `<script src="${window.location.origin}/api/widget/${company.slug}"></script>`;
      navigator.clipboard.writeText(code);
      setMessage({ type: 'success', text: t.settings.messages.copied });
    }
  };

  if (!company) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t.settings.title}</h1>
        <p className="text-slate-600">{t.settings.subtitle}</p>
      </div>

      {message && (
        <div
          className={`rounded-md p-4 ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Billing */}
      <BillingCard
        subscriptionStatus={company.subscription_status}
        stripeCustomerId={company.stripe_customer_id}
      />

      {/* Company Profile */}
      <Card>
        <CardHeader>
          <CardTitle>{t.settings.companyProfile.title}</CardTitle>
          <CardDescription>{t.settings.companyProfile.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="name">{t.settings.companyProfile.companyName}</Label>
              <Input
                id="name"
                value={formState.name}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="industry">{t.settings.companyProfile.industry}</Label>
              <Select
                id="industry"
                value={formState.industry}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    industry: e.target.value as Industry,
                  }))
                }
                options={industryOptions}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="email">{t.settings.companyProfile.email}</Label>
              <Input
                id="email"
                type="email"
                value={formState.email}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="phone">{t.settings.companyProfile.phone}</Label>
              <Input
                id="phone"
                type="tel"
                value={formState.phone}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            </div>
          </div>
          <div>
            <Label htmlFor="website">{t.settings.companyProfile.website}</Label>
            <Input
              id="website"
              type="url"
              value={formState.website_url}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, website_url: e.target.value }))
              }
              placeholder="https://www.company.com"
            />
          </div>
        </CardContent>
      </Card>

      {/* Language & Currency */}
      <Card>
        <CardHeader>
          <CardTitle>{t.settings.languageCurrency.title}</CardTitle>
          <CardDescription>
            {t.settings.languageCurrency.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="language">{t.settings.languageCurrency.defaultLanguage}</Label>
              <Select
                id="language"
                value={formState.default_language}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    default_language: e.target.value as Language,
                  }))
                }
                options={languageOptions}
              />
            </div>
            <div>
              <Label htmlFor="currency">{t.settings.languageCurrency.defaultCurrency}</Label>
              <Select
                id="currency"
                value={formState.default_currency}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    default_currency: e.target.value as Currency,
                  }))
                }
                options={currencyOptions}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estimator Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t.settings.estimatorSettings.title}</CardTitle>
          <CardDescription>
            {t.settings.estimatorSettings.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="rangeLow">{t.settings.estimatorSettings.rangeLow}</Label>
              <Input
                id="rangeLow"
                type="number"
                min="0"
                max="50"
                value={formState.estimate_range_low}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    estimate_range_low: parseInt(e.target.value) || 0,
                  }))
                }
              />
              <p className="mt-1 text-xs text-slate-500">
                {t.settings.estimatorSettings.rangeLowHelp}
              </p>
            </div>
            <div>
              <Label htmlFor="rangeHigh">{t.settings.estimatorSettings.rangeHigh}</Label>
              <Input
                id="rangeHigh"
                type="number"
                min="0"
                max="50"
                value={formState.estimate_range_high}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    estimate_range_high: parseInt(e.target.value) || 0,
                  }))
                }
              />
              <p className="mt-1 text-xs text-slate-500">
                {t.settings.estimatorSettings.rangeHighHelp}
              </p>
            </div>
          </div>
          <div>
            <Label htmlFor="widgetColor">{t.settings.estimatorSettings.widgetColor}</Label>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="color"
                id="widgetColor"
                value={formState.widget_primary_color}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    widget_primary_color: e.target.value,
                  }))
                }
                className="h-10 w-14 cursor-pointer rounded border border-slate-200"
              />
              <Input
                value={formState.widget_primary_color}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    widget_primary_color: e.target.value,
                  }))
                }
                className="flex-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>{t.settings.notifications.title}</CardTitle>
          <CardDescription>
            {t.settings.notifications.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="notificationEmail">{t.settings.notifications.notificationEmail}</Label>
            <Input
              id="notificationEmail"
              type="email"
              value={formState.notification_email}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  notification_email: e.target.value,
                }))
              }
              placeholder={company.email}
            />
            <p className="mt-1 text-xs text-slate-500">
              {t.settings.notifications.notificationEmailHelp}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Embed Code */}
      <Card>
        <CardHeader>
          <CardTitle>{t.settings.embedCode.title}</CardTitle>
          <CardDescription>
            {t.settings.embedCode.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>{t.settings.embedCode.publicLink}</Label>
            <div className="mt-2 flex items-center gap-2">
              <Input
                readOnly
                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/e/${company.slug}`}
              />
              <a
                href={`${typeof window !== 'undefined' ? window.location.origin : ''}/e/${company.slug}`}
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
            <Label>{t.settings.embedCode.jsCode}</Label>
            <div className="mt-2 rounded-md bg-slate-100 p-3">
              <code className="text-sm text-slate-800 break-all">
                {`<script src="${typeof window !== 'undefined' ? window.location.origin : ''}/api/widget/${company.slug}"></script>`}
              </code>
            </div>
            <Button variant="outline" className="mt-2" onClick={copyEmbedCode}>
              <Copy className="mr-2 h-4 w-4" />
              {t.settings.embedCode.copyCode}
            </Button>
          </div>
          <div>
            <Label htmlFor="allowedDomains">{t.settings.embedCode.allowedDomains}</Label>
            <Textarea
              id="allowedDomains"
              value={formState.allowed_domains}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  allowed_domains: e.target.value,
                }))
              }
              placeholder="example.com&#10;www.example.com"
              rows={3}
            />
            <p className="mt-1 text-xs text-slate-500">
              {t.settings.embedCode.allowedDomainsHelp}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} isLoading={saving}>
          <Save className="mr-2 h-4 w-4" />
          {t.settings.saveSettings}
        </Button>
      </div>
    </div>
  );
}
