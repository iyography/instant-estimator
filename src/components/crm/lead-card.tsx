'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { formatCurrency, formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { calculateLeadValue } from '@/lib/lead-scoring';
import { LeadValueBadge } from './lead-value-badge';
import type { Lead, Currency, Language } from '@/types/database';

interface LeadCardProps {
  lead: Lead;
  onClick: () => void;
  currency: string;
  language: string;
  isDragging?: boolean;
}

export function LeadCard({
  lead,
  onClick,
  currency,
  language,
  isDragging = false,
}: LeadCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const leadValue = calculateLeadValue(lead, currency as Currency);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        'cursor-pointer rounded-md border border-slate-200 bg-white p-3 shadow-sm transition-all hover:border-slate-300 hover:shadow',
        (isDragging || isSortableDragging) && 'opacity-50 shadow-lg',
        isDragging && 'rotate-3'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-slate-900">
            {lead.customer_name}
          </p>
          <p className="truncate text-sm text-slate-500">{lead.customer_email}</p>
        </div>
        <LeadValueBadge tier={leadValue} showIcon={false} />
      </div>
      <div className="mt-2 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">
          {formatCurrency(
            lead.estimated_price_low,
            currency as Currency,
            language as Language
          )}
          {' - '}
          {formatCurrency(
            lead.estimated_price_high,
            currency as Currency,
            language as Language
          )}
        </span>
        <span className="text-slate-400">
          {formatDate(lead.created_at, language as Language)}
        </span>
      </div>
    </div>
  );
}
