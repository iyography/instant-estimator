'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const CONSENT_KEY = 'scopeform-cookie-consent';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    setVisible(false);
    // Disable PostHog if user declines
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.opt_out_capturing();
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white p-4 shadow-lg sm:flex sm:items-center sm:justify-between sm:px-6">
      <p className="text-sm text-slate-600">
        We use cookies for authentication and analytics to improve your experience.
        See our{' '}
        <Link href="/privacy" className="text-blue-600 underline hover:text-blue-800">
          Privacy Policy
        </Link>.
      </p>
      <div className="mt-3 flex gap-3 sm:mt-0 sm:ml-4 sm:shrink-0">
        <button
          onClick={decline}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Decline
        </button>
        <button
          onClick={accept}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Accept
        </button>
      </div>
    </div>
  );
}

// Extend Window for PostHog
declare global {
  interface Window {
    posthog?: { opt_out_capturing: () => void };
  }
}
