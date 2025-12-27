'use client';

import { useState, useEffect } from 'react';
import { useCompany } from '@/hooks/use-company';
import { useDashboardLanguage } from '@/hooks/use-dashboard-language';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BillingCard } from '@/components/billing/billing-card';
import { cn } from '@/lib/utils';
import {
  Save,
  Copy,
  ExternalLink,
  Building,
  Globe,
  Palette,
  Bell,
  Code,
  DollarSign,
  Percent,
  Clock,
  Upload,
  Check,
  Eye,
  Settings,
  Sparkles,
} from 'lucide-react';
import type { Industry, Currency, Language } from '@/types/database';

type SettingsTab = 'company' | 'pricing' | 'branding' | 'notifications' | 'embed';

export default function SettingsPage() {
  const { company, refetch } = useCompany();
  const { t, language } = useDashboardLanguage();
  const [activeTab, setActiveTab] = useState<SettingsTab>('company');

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
    // Company
    name: '',
    email: '',
    phone: '',
    website_url: '',
    industry: 'electrician' as Industry,
    default_currency: 'USD' as Currency,
    default_language: 'en' as Language,
    // Pricing
    estimate_range_low: 10,
    estimate_range_high: 15,
    // Branding
    widget_primary_color: '#3b82f6',
    widget_secondary_color: '#8b5cf6',
    widget_font: 'Inter',
    logo_url: '',
    // Notifications
    notification_email: '',
    notification_sms: false,
    notification_email_enabled: true,
    // Embed
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
        widget_primary_color: company.settings?.widget_primary_color || '#3b82f6',
        widget_secondary_color: '#8b5cf6',
        widget_font: company.settings?.widget_font_family || 'Inter',
        logo_url: '',
        notification_email: company.settings?.notification_email || '',
        notification_sms: false,
        notification_email_enabled: true,
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

  const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
    { id: 'company', label: 'Company', icon: Building },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'embed', label: 'Embed', icon: Code },
  ];

  if (!company) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t.settings.title}</h1>
          <p className="text-slate-600">{t.settings.subtitle}</p>
        </div>
        <Button onClick={handleSave} isLoading={saving}>
          <Save className="mr-2 h-4 w-4" />
          {t.settings.saveSettings}
        </Button>
      </div>

      {message && (
        <div
          className={cn(
            'rounded-lg p-4 flex items-center gap-3',
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          )}
        >
          {message.type === 'success' && <Check className="h-5 w-5" />}
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap',
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Billing */}
      <BillingCard
        subscriptionStatus={company.subscription_status}
        stripeCustomerId={company.stripe_customer_id}
      />

      {/* Company Tab */}
      {activeTab === 'company' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-blue-500" />
                {t.settings.companyProfile.title}
              </CardTitle>
              <CardDescription>{t.settings.companyProfile.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">{t.settings.companyProfile.companyName}</Label>
                  <Input
                    id="name"
                    value={formState.name}
                    onChange={(e) =>
                      setFormState((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
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
                <div className="space-y-2">
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
                <div className="space-y-2">
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
              <div className="space-y-2">
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-500" />
                {t.settings.languageCurrency.title}
              </CardTitle>
              <CardDescription>
                {t.settings.languageCurrency.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
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
                <div className="space-y-2">
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
        </div>
      )}

      {/* Pricing Tab */}
      {activeTab === 'pricing' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-500" />
                {t.settings.estimatorSettings.title}
              </CardTitle>
              <CardDescription>
                {t.settings.estimatorSettings.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="rangeLow">{t.settings.estimatorSettings.rangeLow}</Label>
                  <div className="relative">
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
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">%</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {t.settings.estimatorSettings.rangeLowHelp}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rangeHigh">{t.settings.estimatorSettings.rangeHigh}</Label>
                  <div className="relative">
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
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">%</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {t.settings.estimatorSettings.rangeHighHelp}
                  </p>
                </div>
              </div>

              {/* Preview */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <p className="text-sm text-slate-600 mb-2">Example: If base estimate is $1,000</p>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Low</p>
                    <p className="text-lg font-bold text-slate-900">
                      ${(1000 * (1 - formState.estimate_range_low / 100)).toFixed(0)}
                    </p>
                  </div>
                  <div className="flex-1 h-2 bg-gradient-to-r from-blue-200 via-blue-500 to-blue-200 rounded-full" />
                  <div className="text-center">
                    <p className="text-xs text-slate-500">High</p>
                    <p className="text-lg font-bold text-slate-900">
                      ${(1000 * (1 + formState.estimate_range_high / 100)).toFixed(0)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Branding Tab */}
      {activeTab === 'branding' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-purple-500" />
                Widget Appearance
              </CardTitle>
              <CardDescription>
                Customize how your estimator looks to customers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      id="primaryColor"
                      value={formState.widget_primary_color}
                      onChange={(e) =>
                        setFormState((prev) => ({
                          ...prev,
                          widget_primary_color: e.target.value,
                        }))
                      }
                      className="h-12 w-16 cursor-pointer rounded-lg border border-slate-200 p-1"
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
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      id="secondaryColor"
                      value={formState.widget_secondary_color}
                      onChange={(e) =>
                        setFormState((prev) => ({
                          ...prev,
                          widget_secondary_color: e.target.value,
                        }))
                      }
                      className="h-12 w-16 cursor-pointer rounded-lg border border-slate-200 p-1"
                    />
                    <Input
                      value={formState.widget_secondary_color}
                      onChange={(e) =>
                        setFormState((prev) => ({
                          ...prev,
                          widget_secondary_color: e.target.value,
                        }))
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Company Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50">
                    {formState.logo_url ? (
                      <img src={formState.logo_url} alt="Logo" className="max-w-full max-h-full object-contain" />
                    ) : (
                      <Upload className="h-8 w-8 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Button variant="outline" className="mb-2">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </Button>
                    <p className="text-xs text-slate-500">
                      Recommended: 200x200px PNG or SVG
                    </p>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-slate-400" />
                  Preview
                </Label>
                <div className="p-6 rounded-xl border border-slate-200 bg-white">
                  <div className="max-w-sm mx-auto">
                    <div
                      className="rounded-xl p-6 text-white"
                      style={{
                        background: `linear-gradient(135deg, ${formState.widget_primary_color}, ${formState.widget_secondary_color})`,
                      }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                          <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold">{formState.name || 'Your Company'}</p>
                          <p className="text-sm opacity-80">Get Your Instant Estimate</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-10 bg-white/20 rounded-lg" />
                        <div className="h-10 bg-white/20 rounded-lg" />
                        <button className="w-full h-12 bg-white text-slate-900 rounded-lg font-semibold">
                          Get Estimate
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-amber-500" />
              {t.settings.notifications.title}
            </CardTitle>
            <CardDescription>
              {t.settings.notifications.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
                <div>
                  <p className="font-medium text-slate-900">Email Notifications</p>
                  <p className="text-sm text-slate-500">Receive email alerts for new leads</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState.notification_email_enabled}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        notification_email_enabled: e.target.checked,
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
                <div>
                  <p className="font-medium text-slate-900">SMS Notifications</p>
                  <p className="text-sm text-slate-500">Get text alerts for high-value leads</p>
                </div>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  Coming Soon
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
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
              <p className="text-xs text-slate-500">
                {t.settings.notifications.notificationEmailHelp}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Embed Tab */}
      {activeTab === 'embed' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-blue-500" />
              {t.settings.embedCode.title}
            </CardTitle>
            <CardDescription>
              {t.settings.embedCode.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>{t.settings.embedCode.publicLink}</Label>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/e/${company.slug}`}
                  className="bg-slate-50"
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

            <div className="space-y-2">
              <Label>{t.settings.embedCode.jsCode}</Label>
              <div className="rounded-lg bg-slate-900 p-4 overflow-x-auto">
                <code className="text-sm text-green-400 whitespace-pre">
                  {`<script src="${typeof window !== 'undefined' ? window.location.origin : ''}/api/widget/${company.slug}"></script>`}
                </code>
              </div>
              <Button variant="outline" onClick={copyEmbedCode}>
                <Copy className="mr-2 h-4 w-4" />
                {t.settings.embedCode.copyCode}
              </Button>
            </div>

            <div className="space-y-2">
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
                rows={4}
              />
              <p className="text-xs text-slate-500">
                {t.settings.embedCode.allowedDomainsHelp}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
