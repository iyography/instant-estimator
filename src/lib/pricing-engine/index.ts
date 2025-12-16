import type {
  PriceModifierType,
  Currency,
  EstimateResult,
  AnswerOption,
  JobType,
  CompanySettings,
} from '@/types/database';

export interface PriceModifier {
  question_id: string;
  modifier_type: PriceModifierType;
  modifier_value: number;
}

export function applyModifier(
  currentPrice: number,
  modifierType: PriceModifierType,
  modifierValue: number
): number {
  switch (modifierType) {
    case 'fixed_add':
      return currentPrice + modifierValue * 100; // Convert to smallest unit
    case 'fixed_subtract':
      return Math.max(0, currentPrice - modifierValue * 100);
    case 'percentage_add':
      return currentPrice * (1 + modifierValue / 100);
    case 'percentage_subtract':
      return currentPrice * (1 - modifierValue / 100);
    case 'multiply':
      return currentPrice * modifierValue;
    default:
      return currentPrice;
  }
}

export function calculateEstimate(
  jobType: JobType,
  selectedAnswers: AnswerOption[],
  companySettings: CompanySettings,
  currency: Currency
): EstimateResult {
  let currentPrice = jobType.base_price;
  const modifiersApplied: EstimateResult['modifiers_applied'] = [];

  // Apply each answer's price modifier in sequence
  for (const answer of selectedAnswers) {
    const priceBefore = currentPrice;
    currentPrice = applyModifier(
      currentPrice,
      answer.price_modifier_type,
      answer.price_modifier_value
    );

    modifiersApplied.push({
      question_id: answer.question_id,
      modifier_type: answer.price_modifier_type,
      modifier_value: answer.price_modifier_value,
      price_before: Math.round(priceBefore),
      price_after: Math.round(currentPrice),
    });
  }

  // Ensure price doesn't go below zero
  currentPrice = Math.max(0, Math.round(currentPrice));

  // Calculate price range
  const rangeLow = companySettings.estimate_range_low_percentage ?? 10;
  const rangeHigh = companySettings.estimate_range_high_percentage ?? 15;

  const priceLow = Math.round(currentPrice * (1 - rangeLow / 100));
  const priceHigh = Math.round(currentPrice * (1 + rangeHigh / 100));

  return {
    base_price: jobType.base_price,
    final_price: currentPrice,
    price_low: priceLow,
    price_high: priceHigh,
    currency,
    modifiers_applied: modifiersApplied,
  };
}

export function formatPriceRange(
  priceLow: number,
  priceHigh: number,
  currency: Currency,
  locale: string = 'sv'
): string {
  const localeMap: Record<string, string> = {
    sv: 'sv-SE',
    en: 'en-US',
  };

  const formatter = new Intl.NumberFormat(localeMap[locale] || 'sv-SE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return `${formatter.format(priceLow / 100)} - ${formatter.format(priceHigh / 100)}`;
}

export function getModifierDescription(
  type: PriceModifierType,
  value: number,
  locale: string = 'sv'
): string {
  const descriptions: Record<string, Record<PriceModifierType, string>> = {
    sv: {
      fixed_add: `+${value} kr`,
      fixed_subtract: `-${value} kr`,
      percentage_add: `+${value}%`,
      percentage_subtract: `-${value}%`,
      multiply: `×${value}`,
    },
    en: {
      fixed_add: `+${value}`,
      fixed_subtract: `-${value}`,
      percentage_add: `+${value}%`,
      percentage_subtract: `-${value}%`,
      multiply: `×${value}`,
    },
  };

  return descriptions[locale]?.[type] || descriptions.en[type];
}

// Preview estimate for form builder
export function previewEstimate(
  basePrice: number,
  modifiers: PriceModifier[],
  companySettings: CompanySettings
): {
  finalPrice: number;
  priceLow: number;
  priceHigh: number;
  breakdown: { description: string; priceAfter: number }[];
} {
  let currentPrice = basePrice;
  const breakdown: { description: string; priceAfter: number }[] = [
    { description: 'Base price', priceAfter: basePrice },
  ];

  for (const modifier of modifiers) {
    currentPrice = applyModifier(
      currentPrice,
      modifier.modifier_type,
      modifier.modifier_value
    );
    breakdown.push({
      description: getModifierDescription(modifier.modifier_type, modifier.modifier_value),
      priceAfter: Math.round(currentPrice),
    });
  }

  const finalPrice = Math.max(0, Math.round(currentPrice));
  const rangeLow = companySettings.estimate_range_low_percentage ?? 10;
  const rangeHigh = companySettings.estimate_range_high_percentage ?? 15;

  return {
    finalPrice,
    priceLow: Math.round(finalPrice * (1 - rangeLow / 100)),
    priceHigh: Math.round(finalPrice * (1 + rangeHigh / 100)),
    breakdown,
  };
}
