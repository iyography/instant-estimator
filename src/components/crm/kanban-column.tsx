'use client';

import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import type { LeadStatus } from '@/types/database';

interface KanbanColumnProps {
  id: LeadStatus;
  title: string;
  color: string;
  count: number;
  hasMore: boolean;
  overflowText?: string;
  children: React.ReactNode;
}

export function KanbanColumn({
  id,
  title,
  color,
  count,
  hasMore,
  overflowText,
  children,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex w-72 flex-shrink-0 flex-col rounded-lg bg-slate-100 transition-colors',
        isOver && 'bg-slate-200'
      )}
    >
      <div className="flex items-center gap-2 p-3">
        <div className={cn('h-3 w-3 rounded-full', color)} />
        <h3 className="font-medium text-slate-900">{title}</h3>
        <span className="ml-auto rounded-full bg-slate-200 px-2 py-0.5 text-sm text-slate-600">
          {count}
        </span>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto p-2">
        {children}
        {hasMore && overflowText && (
          <div className="py-2 text-center">
            <span className="text-sm text-slate-500">
              {overflowText}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
