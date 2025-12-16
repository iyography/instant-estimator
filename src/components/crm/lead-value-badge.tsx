'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LeadValueTier, getLeadValueColor, getLeadValueIconColor } from '@/lib/lead-scoring';
import { useDashboardLanguage } from '@/hooks/use-dashboard-language';

interface LeadValueBadgeProps {
  tier: LeadValueTier;
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

export function LeadValueBadge({
  tier,
  className,
  showIcon = true,
  size = 'sm',
}: LeadValueBadgeProps) {
  const { t } = useDashboardLanguage();

  const Icon = tier === 'high' ? TrendingUp : tier === 'low' ? TrendingDown : Minus;
  const iconColor = getLeadValueIconColor(tier);
  const bgColor = getLeadValueColor(tier);

  const label = t.leadValue[tier];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-medium',
        bgColor,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        className
      )}
    >
      {showIcon && (
        <Icon className={cn('h-3 w-3', iconColor, size === 'md' && 'h-4 w-4')} />
      )}
      {label}
    </span>
  );
}
