'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCompany } from '@/hooks/use-company';
import { useDashboardLanguage } from '@/hooks/use-dashboard-language';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { KanbanBoard } from '@/components/crm/kanban-board';
import { LeadValueBadge } from '@/components/crm/lead-value-badge';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { calculateLeadValue } from '@/lib/lead-scoring';
import { DEMO_LEADS, DEMO_JOB_TYPES } from '@/lib/demo/data';
import { Search, Download, LayoutGrid, List } from 'lucide-react';
import type { Lead, LeadStatus, JobType, Currency } from '@/types/database';

export default function LeadsPage() {
  const { company } = useCompany();
  const router = useRouter();
  const { t, language } = useDashboardLanguage();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [jobTypes, setJobTypes] = useState<JobType[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');

  const statusOptions = [
    { value: '', label: t.leads.allStatuses },
    { value: 'new', label: t.status.new },
    { value: 'contacted', label: t.status.contacted },
    { value: 'quoted', label: t.status.quoted },
    { value: 'won', label: t.status.won },
    { value: 'lost', label: t.status.lost },
  ];

  useEffect(() => {
    if (!company) return;

    // Always use demo data
    setLeads(DEMO_LEADS as unknown as Lead[]);
    setJobTypes(DEMO_JOB_TYPES as unknown as JobType[]);
    setLoading(false);
  }, [company]);

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    // Update local state
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );
  };

  const handleLeadClick = (lead: Lead) => {
    router.push(`/leads/${lead.id}`);
  };

  const exportToCSV = () => {
    const headers = [
      t.leads.table.customer,
      t.leads.table.email,
      t.leads.table.phone,
      t.leads.table.address,
      t.leads.table.status,
      t.leads.table.estimateLow,
      t.leads.table.estimateHigh,
      t.leads.table.date,
    ];

    const rows = filteredLeads.map((lead) => [
      lead.customer_name,
      lead.customer_email,
      lead.customer_phone || '',
      lead.customer_address || '',
      t.status[lead.status as LeadStatus],
      (lead.estimated_price_low / 100).toString(),
      (lead.estimated_price_high / 100).toString(),
      new Date(lead.created_at).toISOString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      !searchQuery ||
      lead.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.customer_email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = !statusFilter || lead.status === statusFilter;
    const matchesJobType = !jobTypeFilter || lead.job_type_id === jobTypeFilter;

    return matchesSearch && matchesStatus && matchesJobType;
  });

  const jobTypeOptions = [
    { value: '', label: t.leads.allJobTypes },
    ...jobTypes.map((jt) => ({ value: jt.id, label: jt.name })),
  ];

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t.leads.title}</h1>
          <p className="text-slate-600">
            {t.leads.totalLeads.replace('{count}', String(filteredLeads.length))}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            {t.leads.exportCSV}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder={t.leads.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="w-40">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={statusOptions}
          />
        </div>
        <div className="w-48">
          <Select
            value={jobTypeFilter}
            onChange={(e) => setJobTypeFilter(e.target.value)}
            options={jobTypeOptions}
          />
        </div>
        <div className="flex rounded-md border border-slate-200">
          <Button
            variant={view === 'kanban' ? 'secondary' : 'ghost'}
            size="sm"
            className="rounded-r-none"
            onClick={() => setView('kanban')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={view === 'list' ? 'secondary' : 'ghost'}
            size="sm"
            className="rounded-l-none"
            onClick={() => setView('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Views */}
      {view === 'kanban' ? (
        <KanbanBoard
          leads={filteredLeads}
          onStatusChange={handleStatusChange}
          onLeadClick={handleLeadClick}
          currency={company?.default_currency || 'SEK'}
          language={language}
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                  {t.leads.table.customer}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                  {t.leads.table.jobType}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                  {t.leads.table.value}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                  {t.leads.table.estimate}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                  {t.leads.table.status}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                  {t.leads.table.date}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => {
                const jobType = jobTypes.find((jt) => jt.id === lead.job_type_id);
                const leadValue = calculateLeadValue(lead, company?.default_currency as Currency);
                return (
                  <tr
                    key={lead.id}
                    className="cursor-pointer border-b border-slate-100 transition-colors hover:bg-slate-50"
                    onClick={() => handleLeadClick(lead)}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-slate-900">
                          {lead.customer_name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {lead.customer_email}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {jobType?.name || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <LeadValueBadge tier={leadValue} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium">
                        {formatCurrency(
                          lead.estimated_price_low,
                          company?.default_currency || 'SEK',
                          language
                        )}
                        {' - '}
                        {formatCurrency(
                          lead.estimated_price_high,
                          company?.default_currency || 'SEK',
                          language
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={getStatusColor(lead.status)}>
                        {t.status[lead.status as LeadStatus]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {formatDate(lead.created_at, language)}
                    </td>
                  </tr>
                );
              })}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    {t.leads.noLeadsFound}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
