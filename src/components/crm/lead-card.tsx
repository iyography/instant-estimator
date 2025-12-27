'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { formatCurrency, formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { calculateLeadValue } from '@/lib/lead-scoring';
import { LeadValueBadge } from './lead-value-badge';
import { DEMO_JOB_TYPES } from '@/lib/demo/data';
import { Clock, MapPin, Zap, FileText } from 'lucide-react';
import type { Lead, Currency, Language } from '@/types/database';

interface ExtendedLead extends Lead {
  estimate_breakdown?: Array<{
    label: string;
    amount: number;
  }>;
}

interface LeadCardProps {
  lead: ExtendedLead;
  onClick: () => void;
  currency: string;
  language: string;
  isDragging?: boolean;
  showDetails?: boolean;
}

export function LeadCard({
  lead,
  onClick,
  currency,
  language,
  isDragging = false,
  showDetails = false,
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
  const jobType = DEMO_JOB_TYPES.find(jt => jt.id === lead.job_type_id);

  // Calculate days since created
  const daysSince = Math.floor((Date.now() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60 * 24));
  const isUrgent = daysSince > 3 && lead.status === 'new';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        'cursor-pointer rounded-lg border bg-white p-3 shadow-sm transition-all hover:shadow-md',
        (isDragging || isSortableDragging) && 'opacity-50 shadow-lg scale-105',
        isDragging && 'rotate-2',
        isUrgent ? 'border-amber-300 bg-amber-50/50' : 'border-slate-200 hover:border-slate-300'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-slate-900">
            {lead.customer_name}
          </p>
          <p className="truncate text-sm text-slate-500">{lead.customer_email}</p>
        </div>
        <LeadValueBadge tier={leadValue} showIcon={false} />
      </div>

      {/* Job Type Badge */}
      {jobType && (
        <div className="mt-2 flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 text-blue-500" />
          <span className="text-xs font-medium text-slate-600">{jobType.name}</span>
        </div>
      )}

      {/* Price Range */}
      <div className="mt-2 flex items-center justify-between">
        <span className="text-sm font-bold text-slate-900">
          {formatCurrency(
            lead.estimated_price_low,
            currency as Currency,
            language as Language
          )}
          <span className="text-slate-400 font-normal"> - </span>
          {formatCurrency(
            lead.estimated_price_high,
            currency as Currency,
            language as Language
          )}
        </span>
      </div>

      {/* Estimate Breakdown Preview */}
      {showDetails && lead.estimate_breakdown && lead.estimate_breakdown.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
          <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
            <FileText className="h-3 w-3" />
            <span>Breakdown</span>
          </div>
          {lead.estimate_breakdown.slice(0, 3).map((item, i) => (
            <div key={i} className="flex justify-between text-xs">
              <span className="text-slate-500 truncate max-w-[120px]">{item.label}</span>
              <span className={cn(
                'font-medium',
                item.amount >= 0 ? 'text-slate-700' : 'text-green-600'
              )}>
                {item.amount >= 0 ? '+' : ''}{formatCurrency(item.amount, currency as Currency, language as Language)}
              </span>
            </div>
          ))}
          {lead.estimate_breakdown.length > 3 && (
            <p className="text-xs text-slate-400">
              +{lead.estimate_breakdown.length - 3} more items
            </p>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between text-xs">
        {lead.customer_address && (
          <div className="flex items-center gap-1 text-slate-400 truncate max-w-[120px]">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{lead.customer_address.split(',')[0]}</span>
          </div>
        )}
        <div className={cn(
          'flex items-center gap-1 ml-auto',
          isUrgent ? 'text-amber-600' : 'text-slate-400'
        )}>
          <Clock className="h-3 w-3" />
          <span>
            {daysSince === 0 ? 'Today' : daysSince === 1 ? 'Yesterday' : `${daysSince}d ago`}
          </span>
        </div>
      </div>
    </div>
  );
}
