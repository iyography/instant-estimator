'use client';

import { useEffect, useState } from 'react';
import { dashboardTranslations, DashboardLanguage, DashboardTranslations } from '@/lib/i18n/dashboard-translations';

export function useDashboardLanguage() {
  const [language, setLanguageState] = useState<DashboardLanguage>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Get language from localStorage on mount
    const stored = localStorage.getItem('language') as DashboardLanguage;
    if (stored && (stored === 'en' || stored === 'sv')) {
      setLanguageState(stored);
    }
    setMounted(true);

    // Listen for language changes
    const handleLanguageChange = (event: CustomEvent<DashboardLanguage>) => {
      setLanguageState(event.detail);
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, []);

  const setLanguage = (lang: DashboardLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    window.dispatchEvent(new CustomEvent('languageChange', { detail: lang }));
  };

  // Return English translations until mounted to prevent hydration mismatch
  const t: DashboardTranslations = mounted
    ? dashboardTranslations[language]
    : dashboardTranslations.en;

  return { language, setLanguage, t, mounted };
}
