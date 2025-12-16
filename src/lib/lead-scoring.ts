import type { Lead, Currency } from '@/types/database';

export type LeadValueTier = 'low' | 'medium' | 'high';

// Default thresholds in smallest currency unit (cents/ore)
// These can be customized per company in settings
const DEFAULT_THRESHOLDS = {
  SEK: {
    low: 500000,    // < 5,000 SEK
    high: 2000000,  // > 20,000 SEK
  },
  EUR: {
    low: 50000,     // < 500 EUR
    high: 200000,   // > 2,000 EUR
  },
  USD: {
    low: 50000,     // < 500 USD
    high: 200000,   // > 2,000 USD
  },
};

export interface LeadValueConfig {
  lowThreshold?: number;  // Below this = low value (in smallest currency unit)
  highThreshold?: number; // Above this = high value (in smallest currency unit)
}

/**
 * Calculate the lead value tier based on the estimated price
 */
export function calculateLeadValue(
  lead: Lead,
  currency: Currency = 'SEK',
  config?: LeadValueConfig
): LeadValueTier {
  // Use the average of low and high estimates
  const averageEstimate = (lead.estimated_price_low + lead.estimated_price_high) / 2;

  // Get thresholds - use config if provided, otherwise use defaults
  const thresholds = DEFAULT_THRESHOLDS[currency];
  const lowThreshold = config?.lowThreshold ?? thresholds.low;
  const highThreshold = config?.highThreshold ?? thresholds.high;

  if (averageEstimate < lowThreshold) {
    return 'low';
  } else if (averageEstimate >= highThreshold) {
    return 'high';
  }
  return 'medium';
}

/**
 * Get the color classes for a lead value tier
 */
export function getLeadValueColor(tier: LeadValueTier): string {
  switch (tier) {
    case 'low':
      return 'bg-slate-100 text-slate-700 border-slate-200';
    case 'medium':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'high':
      return 'bg-green-100 text-green-700 border-green-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

/**
 * Get the icon color for a lead value tier
 */
export function getLeadValueIconColor(tier: LeadValueTier): string {
  switch (tier) {
    case 'low':
      return 'text-slate-500';
    case 'medium':
      return 'text-blue-500';
    case 'high':
      return 'text-green-500';
    default:
      return 'text-slate-500';
  }
}

/**
 * Get all leads grouped by value tier
 */
export function groupLeadsByValue(
  leads: Lead[],
  currency: Currency = 'SEK',
  config?: LeadValueConfig
): Record<LeadValueTier, Lead[]> {
  return leads.reduce(
    (acc, lead) => {
      const tier = calculateLeadValue(lead, currency, config);
      acc[tier].push(lead);
      return acc;
    },
    { low: [], medium: [], high: [] } as Record<LeadValueTier, Lead[]>
  );
}

/**
 * Get lead value statistics
 */
export function getLeadValueStats(
  leads: Lead[],
  currency: Currency = 'SEK',
  config?: LeadValueConfig
): {
  low: number;
  medium: number;
  high: number;
  totalValue: number;
  averageValue: number;
} {
  const grouped = groupLeadsByValue(leads, currency, config);

  const totalValue = leads.reduce(
    (sum, lead) => sum + (lead.estimated_price_low + lead.estimated_price_high) / 2,
    0
  );

  return {
    low: grouped.low.length,
    medium: grouped.medium.length,
    high: grouped.high.length,
    totalValue,
    averageValue: leads.length > 0 ? totalValue / leads.length : 0,
  };
}
