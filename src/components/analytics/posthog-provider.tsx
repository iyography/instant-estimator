'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Initialize PostHog
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: false, // We capture manually
    capture_pageleave: true,
    autocapture: true,
    session_recording: {
      maskAllInputs: false,
      maskInputOptions: {
        password: true,
      },
    },
  });
}

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      let url = window.origin + pathname;
      if (searchParams?.toString()) {
        url = url + '?' + searchParams.toString();
      }
      posthog.capture('$pageview', { $current_url: url });
    }
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return <>{children}</>;
  }

  return (
    <PHProvider client={posthog}>
      <PostHogPageView />
      {children}
    </PHProvider>
  );
}

// Analytics helper functions
export const analytics = {
  identify: (userId: string, traits?: Record<string, unknown>) => {
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.identify(userId, traits);
    }
  },

  track: (event: string, properties?: Record<string, unknown>) => {
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.capture(event, properties);
    }
  },

  reset: () => {
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.reset();
    }
  },

  // Pre-defined events
  events: {
    // Auth events
    signUp: (method: 'email' | 'google') =>
      analytics.track('user_signed_up', { method }),
    signIn: (method: 'email' | 'google') =>
      analytics.track('user_signed_in', { method }),
    signOut: () => analytics.track('user_signed_out'),

    // Onboarding events
    onboardingStarted: () => analytics.track('onboarding_started'),
    onboardingCompleted: (industry: string) =>
      analytics.track('onboarding_completed', { industry }),

    // Form events
    formCreated: (formId: string, jobTypeCount: number) =>
      analytics.track('form_created', { form_id: formId, job_type_count: jobTypeCount }),
    formPublished: (formId: string) =>
      analytics.track('form_published', { form_id: formId }),

    // Lead events
    leadReceived: (leadValue: 'low' | 'medium' | 'high', estimateAmount: number) =>
      analytics.track('lead_received', { lead_value: leadValue, estimate_amount: estimateAmount }),
    leadStatusChanged: (status: string, leadValue: 'low' | 'medium' | 'high') =>
      analytics.track('lead_status_changed', { status, lead_value: leadValue }),

    // AI events
    aiSuggestionsRequested: (jobType: string) =>
      analytics.track('ai_suggestions_requested', { job_type: jobType }),
    aiSuggestionsAccepted: (questionCount: number) =>
      analytics.track('ai_suggestions_accepted', { question_count: questionCount }),

    // Billing events
    checkoutStarted: (plan: string, billingPeriod: string) =>
      analytics.track('checkout_started', { plan, billing_period: billingPeriod }),
    subscriptionActivated: (plan: string) =>
      analytics.track('subscription_activated', { plan }),
    subscriptionCanceled: () => analytics.track('subscription_canceled'),

    // Widget events
    widgetLoaded: (companySlug: string) =>
      analytics.track('widget_loaded', { company_slug: companySlug }),
    estimatorStarted: (jobType: string) =>
      analytics.track('estimator_started', { job_type: jobType }),
    estimatorCompleted: (jobType: string, estimateAmount: number) =>
      analytics.track('estimator_completed', { job_type: jobType, estimate_amount: estimateAmount }),
  },
};
