'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/context';
import { Language } from '@/lib/i18n/translations';

const languages = [
  { code: 'en' as Language, label: 'English', flag: '🇺🇸' },
  { code: 'sv' as Language, label: 'Svenska', flag: '🇸🇪' },
];

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export function LanguageSwitcher({ className, variant = 'light' }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  const current = languages.find(l => l.code === language) || languages[0];

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
          variant === 'light'
            ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            : 'text-slate-300 hover:text-white hover:bg-white/10'
        )}
        aria-label="Select language"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{current.flag} {current.label}</span>
        <span className="sm:hidden">{current.flag}</span>
        <svg
          className={cn(
            'h-4 w-4 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      <div
        className={cn(
          'absolute right-0 mt-2 w-44 rounded-xl border shadow-lg overflow-hidden transition-all duration-200 z-50',
          variant === 'light'
            ? 'bg-white border-slate-200'
            : 'bg-slate-800 border-slate-700',
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        )}
      >
        <div className="py-1">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                variant === 'light'
                  ? 'text-slate-700 hover:bg-slate-50'
                  : 'text-slate-200 hover:bg-slate-700',
                language === lang.code && (
                  variant === 'light'
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-blue-900/30 text-blue-400'
                )
              )}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="font-medium">{lang.label}</span>
              {language === lang.code && (
                <svg
                  className="ml-auto h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
