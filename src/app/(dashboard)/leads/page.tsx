'use client';

import { useEffect, useState, useMemo } from 'react';
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
import { Search, Download, LayoutGrid, List, FileText, ChevronUp, ChevronDown, Calendar, X } from 'lucide-react';
import type { Lead, LeadStatus, JobType, Currency } from '@/types/database';

type SortField = 'customer_name' | 'created_at' | 'estimated_price_low' | 'status';
type SortDirection = 'asc' | 'desc';

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
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <th
      className="px-4 py-3 text-left text-sm font-medium text-slate-600 cursor-pointer hover:bg-slate-100 transition-colors select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        <span className="flex flex-col">
          <ChevronUp className={`h-3 w-3 -mb-1 ${sortField === field && sortDirection === 'asc' ? 'text-blue-600' : 'text-slate-300'}`} />
          <ChevronDown className={`h-3 w-3 ${sortField === field && sortDirection === 'desc' ? 'text-blue-600' : 'text-slate-300'}`} />
        </span>
      </div>
    </th>
  );

  // Generate PDF for a lead
  const generatePDF = (lead: Lead, e: React.MouseEvent) => {
    e.stopPropagation();
    const jobType = jobTypes.find((jt) => jt.id === lead.job_type_id);

    // Create a printable HTML content
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Estimate - ${lead.customer_name}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          .header { border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { color: #1e293b; margin: 0 0 10px 0; }
          .header p { color: #64748b; margin: 0; }
          .section { margin-bottom: 25px; }
          .section-title { font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
          .info-item label { display: block; font-size: 12px; color: #94a3b8; margin-bottom: 4px; }
          .info-item p { margin: 0; color: #1e293b; font-weight: 500; }
          .estimate-box { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 25px; border-radius: 12px; text-align: center; }
          .estimate-box .label { font-size: 14px; opacity: 0.9; }
          .estimate-box .price { font-size: 32px; font-weight: bold; margin-top: 8px; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Estimate</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>

        <div class="section">
          <div class="section-title">Customer Information</div>
          <div class="info-grid">
            <div class="info-item">
              <label>Name</label>
              <p>${lead.customer_name}</p>
            </div>
            <div class="info-item">
              <label>Email</label>
              <p>${lead.customer_email}</p>
            </div>
            <div class="info-item">
              <label>Phone</label>
              <p>${lead.customer_phone || 'N/A'}</p>
            </div>
            <div class="info-item">
              <label>Address</label>
              <p>${lead.customer_address || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Service Details</div>
          <div class="info-grid">
            <div class="info-item">
              <label>Service Type</label>
              <p>${jobType?.name || 'N/A'}</p>
            </div>
            <div class="info-item">
              <label>Submitted</label>
              <p>${new Date(lead.created_at).toLocaleDateString()}</p>
            </div>
            <div class="info-item">
              <label>Status</label>
              <p>${lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}</p>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="estimate-box">
            <div class="label">Estimated Price Range</div>
            <div class="price">$${(lead.estimated_price_low / 100).toLocaleString()} - $${(lead.estimated_price_high / 100).toLocaleString()}</div>
          </div>
        </div>

        <div class="footer">
          <p>This estimate is valid for 30 days. Final price may vary based on site conditions.</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

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

  // Filter and sort leads
  const filteredLeads = useMemo(() => {
    let result = leads.filter((lead) => {
      const matchesSearch =
        !searchQuery ||
        lead.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.customer_email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = !statusFilter || lead.status === statusFilter;
      const matchesJobType = !jobTypeFilter || lead.job_type_id === jobTypeFilter;

      // Date range filtering
      const leadDate = new Date(lead.created_at);
      const matchesDateFrom = !dateFrom || leadDate >= new Date(dateFrom);
      const matchesDateTo = !dateTo || leadDate <= new Date(dateTo + 'T23:59:59');

      return matchesSearch && matchesStatus && matchesJobType && matchesDateFrom && matchesDateTo;
    });

    // Sort leads
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'customer_name':
          comparison = a.customer_name.localeCompare(b.customer_name);
          break;
        case 'created_at':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'estimated_price_low':
          comparison = a.estimated_price_low - b.estimated_price_low;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [leads, searchQuery, statusFilter, jobTypeFilter, dateFrom, dateTo, sortField, sortDirection]);

  const jobTypeOptions = [
    { value: '', label: t.leads.allServices },
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
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder={t.leads.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="w-36">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={statusOptions}
          />
        </div>
        <div className="w-44">
          <Select
            value={jobTypeFilter}
            onChange={(e) => setJobTypeFilter(e.target.value)}
            options={jobTypeOptions}
          />
        </div>

        {/* Date Range Filter */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200">
          <Calendar className="h-4 w-4 text-slate-400" />
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="bg-transparent text-sm text-slate-600 border-none outline-none w-28"
            placeholder="From"
          />
          <span className="text-slate-400">-</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="bg-transparent text-sm text-slate-600 border-none outline-none w-28"
            placeholder="To"
          />
          {(dateFrom || dateTo) && (
            <button
              onClick={() => { setDateFrom(''); setDateTo(''); }}
              className="p-0.5 hover:bg-slate-200 rounded"
            >
              <X className="h-3.5 w-3.5 text-slate-400" />
            </button>
          )}
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
                <SortableHeader field="customer_name">
                  {t.leads.table.customer}
                </SortableHeader>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                  {t.leads.table.jobType}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                  {t.leads.table.value}
                </th>
                <SortableHeader field="estimated_price_low">
                  {t.leads.table.estimate}
                </SortableHeader>
                <SortableHeader field="status">
                  {t.leads.table.status}
                </SortableHeader>
                <SortableHeader field="created_at">
                  {t.leads.table.date}
                </SortableHeader>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 w-20">
                  Actions
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
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => generatePDF(lead, e)}
                        className="p-2 rounded-lg hover:bg-slate-100 transition-colors group"
                        title="Download PDF"
                      >
                        <FileText className="h-4 w-4 text-slate-400 group-hover:text-blue-600" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
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
