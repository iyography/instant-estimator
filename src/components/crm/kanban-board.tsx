'use client';

import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { KanbanColumn } from './kanban-column';
import { LeadCard } from './lead-card';
import { useDashboardLanguage } from '@/hooks/use-dashboard-language';
import type { Lead, LeadStatus } from '@/types/database';

const MAX_VISIBLE_LEADS = 30;

interface KanbanBoardProps {
  leads: Lead[];
  onStatusChange: (leadId: string, newStatus: LeadStatus) => Promise<void>;
  onLeadClick: (lead: Lead) => void;
  currency: string;
  language: string;
}

export function KanbanBoard({
  leads,
  onStatusChange,
  onLeadClick,
  currency,
  language,
}: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeLead = activeId ? leads.find((l) => l.id === activeId) : null;
  const { t } = useDashboardLanguage();

  const COLUMN_CONFIG: { id: LeadStatus; title: string; color: string }[] = [
    { id: 'new', title: t.kanban.columns.new, color: 'bg-blue-500' },
    { id: 'contacted', title: t.kanban.columns.contacted, color: 'bg-yellow-500' },
    { id: 'quoted', title: t.kanban.columns.quoted, color: 'bg-purple-500' },
    { id: 'won', title: t.kanban.columns.won, color: 'bg-green-500' },
    { id: 'lost', title: t.kanban.columns.lost, color: 'bg-gray-500' },
  ];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const getLeadsForStatus = (status: LeadStatus) => {
    return leads
      .filter((lead) => lead.status === status)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const leadId = active.id as string;
    const newStatus = over.id as LeadStatus;

    const lead = leads.find((l) => l.id === leadId);
    if (lead && lead.status !== newStatus) {
      await onStatusChange(leadId, newStatus);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMN_CONFIG.map((column) => {
          const columnLeads = getLeadsForStatus(column.id);
          const visibleLeads = columnLeads.slice(0, MAX_VISIBLE_LEADS);
          const hasMore = columnLeads.length > MAX_VISIBLE_LEADS;
          const overflowCount = columnLeads.length - MAX_VISIBLE_LEADS;

          return (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              color={column.color}
              count={columnLeads.length}
              hasMore={hasMore}
              overflowText={hasMore ? t.kanban.moreLeads.replace('{count}', String(overflowCount)) : undefined}
            >
              <SortableContext
                items={visibleLeads.map((l) => l.id)}
                strategy={verticalListSortingStrategy}
              >
                {visibleLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onClick={() => onLeadClick(lead)}
                    currency={currency}
                    language={language}
                  />
                ))}
              </SortableContext>
            </KanbanColumn>
          );
        })}
      </div>

      <DragOverlay>
        {activeLead ? (
          <LeadCard
            lead={activeLead}
            onClick={() => {}}
            currency={currency}
            language={language}
            isDragging
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
