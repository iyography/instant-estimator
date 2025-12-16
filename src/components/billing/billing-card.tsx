'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboardLanguage } from '@/hooks/use-dashboard-language';
import type { SubscriptionStatus } from '@/types/database';

interface BillingCardProps {
  subscriptionStatus: SubscriptionStatus;
  stripeCustomerId: string | null;
}

const pricingPlans = {
  en: {
    free: {
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'For getting started',
      features: [
        'Up to 10 leads/month',
        '1 estimator form',
        'Basic analytics',
        'Email support',
      ],
    },
    pro: {
      name: 'Pro',
      price: '$29',
      yearlyPrice: '$290',
      period: '/month',
      yearlyPeriod: '/year',
      description: 'For growing businesses',
      features: [
        'Unlimited leads',
        'Unlimited forms',
        'AI-powered suggestions',
        'Lead scoring',
        'Email notifications',
        'Priority support',
        'Custom branding',
        'API access',
      ],
    },
  },
  sv: {
    free: {
      name: 'Gratis',
      price: '0 kr',
      period: '/manad',
      description: 'For att komma igang',
      features: [
        'Upp till 10 leads/manad',
        '1 estimatorformular',
        'Grundlaggande analys',
        'E-postsupport',
      ],
    },
    pro: {
      name: 'Pro',
      price: '299 kr',
      yearlyPrice: '2 990 kr',
      period: '/manad',
      yearlyPeriod: '/ar',
      description: 'For vaxande foretag',
      features: [
        'Obegransade leads',
        'Obegransade formular',
        'AI-drivna forslag',
        'Lead-vardering',
        'E-postaviseringar',
        'Prioriterad support',
        'Anpassad branding',
        'API-atkomst',
      ],
    },
  },
};

const statusLabels = {
  en: {
    trial: 'Trial',
    active: 'Active',
    past_due: 'Past Due',
    canceled: 'Canceled',
    inactive: 'Inactive',
  },
  sv: {
    trial: 'Provperiod',
    active: 'Aktiv',
    past_due: 'Forsenad',
    canceled: 'Avslutad',
    inactive: 'Inaktiv',
  },
};

const statusColors: Record<SubscriptionStatus, string> = {
  trial: 'bg-blue-100 text-blue-700',
  active: 'bg-green-100 text-green-700',
  past_due: 'bg-yellow-100 text-yellow-700',
  canceled: 'bg-red-100 text-red-700',
  inactive: 'bg-slate-100 text-slate-700',
};

export function BillingCard({ subscriptionStatus, stripeCustomerId }: BillingCardProps) {
  const { language } = useDashboardLanguage();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(false);

  const plans = pricingPlans[language as 'en' | 'sv'] || pricingPlans.en;
  const labels = statusLabels[language as 'en' | 'sv'] || statusLabels.en;

  const isActive = subscriptionStatus === 'active';

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceType: billingPeriod }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert(language === 'sv' ? 'Kunde inte starta betalning. Forsok igen.' : 'Failed to start checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/billing/portal', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create portal session');
      }
    } catch (error) {
      console.error('Portal error:', error);
      alert(language === 'sv' ? 'Kunde inte oppna portalens. Forsok igen.' : 'Failed to open portal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{language === 'sv' ? 'Abonnemang' : 'Subscription'}</CardTitle>
            <CardDescription>
              {language === 'sv'
                ? 'Hantera ditt abonnemang och fakturering'
                : 'Manage your subscription and billing'}
            </CardDescription>
          </div>
          <Badge className={statusColors[subscriptionStatus]}>
            {labels[subscriptionStatus]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Billing Period Toggle */}
        {!isActive && (
          <div className="flex justify-center">
            <div className="inline-flex rounded-lg bg-slate-100 p-1">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-md transition-all',
                  billingPeriod === 'monthly'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                {language === 'sv' ? 'Manadsvis' : 'Monthly'}
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-md transition-all',
                  billingPeriod === 'yearly'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                {language === 'sv' ? 'Arsvis' : 'Yearly'}
                <span className="ml-1 text-xs text-green-600">
                  {language === 'sv' ? '(Spara 17%)' : '(Save 17%)'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Pricing Plans */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Free Plan */}
          <div className="rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold">{plans.free.name}</h3>
            <div className="mt-2">
              <span className="text-3xl font-bold">{plans.free.price}</span>
              <span className="text-slate-500">{plans.free.period}</span>
            </div>
            <p className="mt-2 text-sm text-slate-600">{plans.free.description}</p>
            <ul className="mt-4 space-y-2">
              {plans.free.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="h-4 w-4 text-slate-400" />
                  {feature}
                </li>
              ))}
            </ul>
            {(subscriptionStatus === 'trial' || subscriptionStatus === 'canceled') && (
              <div className="mt-6">
                <Badge className="bg-slate-100 text-slate-600">
                  {language === 'sv' ? 'Nuvarande plan' : 'Current Plan'}
                </Badge>
              </div>
            )}
          </div>

          {/* Pro Plan */}
          <div className="rounded-xl border-2 border-blue-500 bg-blue-50/50 p-6 relative">
            <div className="absolute -top-3 left-4">
              <Badge className="bg-blue-600 text-white">
                <Sparkles className="mr-1 h-3 w-3" />
                {language === 'sv' ? 'Populart' : 'Popular'}
              </Badge>
            </div>
            <h3 className="text-lg font-semibold">{plans.pro.name}</h3>
            <div className="mt-2">
              <span className="text-3xl font-bold">
                {billingPeriod === 'yearly' ? plans.pro.yearlyPrice : plans.pro.price}
              </span>
              <span className="text-slate-500">
                {billingPeriod === 'yearly' ? plans.pro.yearlyPeriod : plans.pro.period}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-600">{plans.pro.description}</p>
            <ul className="mt-4 space-y-2">
              {plans.pro.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-slate-700">
                  <Check className="h-4 w-4 text-blue-500" />
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              {isActive ? (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleManageSubscription}
                  isLoading={loading}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  {language === 'sv' ? 'Hantera abonnemang' : 'Manage Subscription'}
                </Button>
              ) : (
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={handleSubscribe}
                  isLoading={loading}
                >
                  {language === 'sv' ? 'Uppgradera till Pro' : 'Upgrade to Pro'}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Manage Subscription for Active Users */}
        {isActive && stripeCustomerId && (
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-slate-600 mb-3">
              {language === 'sv'
                ? 'Hantera din fakturering, betalningsmetod eller avsluta ditt abonnemang.'
                : 'Manage your billing, payment method, or cancel your subscription.'}
            </p>
            <Button
              variant="outline"
              onClick={handleManageSubscription}
              isLoading={loading}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              {language === 'sv' ? 'Oppna kundportalen' : 'Open Customer Portal'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
