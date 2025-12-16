import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Currency, Language } from '@/types/database';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency: Currency,
  locale: Language = 'sv'
): string {
  const localeMap: Record<Language, string> = {
    sv: 'sv-SE',
    en: 'en-US',
  };

  return new Intl.NumberFormat(localeMap[locale], {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount / 100); // Convert from smallest unit
}

export function formatNumber(
  amount: number,
  locale: Language = 'sv'
): string {
  const localeMap: Record<Language, string> = {
    sv: 'sv-SE',
    en: 'en-US',
  };

  return new Intl.NumberFormat(localeMap[locale], {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(
  date: string | Date,
  locale: Language = 'sv',
  options?: Intl.DateTimeFormatOptions
): string {
  const localeMap: Record<Language, string> = {
    sv: 'sv-SE',
    en: 'en-US',
  };

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  return new Intl.DateTimeFormat(
    localeMap[locale],
    options || defaultOptions
  ).format(new Date(date));
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function debounce<T extends (...args: Parameters<T>) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function parsePrice(value: string, currency: Currency): number {
  // Remove currency symbols and formatting
  const cleaned = value.replace(/[^\d.,]/g, '');
  // Handle Swedish number format (space as thousand separator, comma as decimal)
  const normalized = cleaned.replace(/\s/g, '').replace(',', '.');
  const parsed = parseFloat(normalized);

  if (isNaN(parsed)) return 0;

  // Convert to smallest unit (öre/cents)
  return Math.round(parsed * 100);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    quoted: 'bg-purple-100 text-purple-800',
    won: 'bg-green-100 text-green-800',
    lost: 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}
