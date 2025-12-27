'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useCompany } from '@/hooks/use-company';
import { useDashboardLanguage } from '@/hooks/use-dashboard-language';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LeadValueBadge } from '@/components/crm/lead-value-badge';
import { formatCurrency, formatDate, getStatusColor, cn } from '@/lib/utils';
import { calculateLeadValue } from '@/lib/lead-scoring';
import { DEMO_LEADS, DEMO_JOB_TYPES, getDemoStats } from '@/lib/demo/data';
import {
  Users,
  FileText,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Plus,
  ArrowRight,
  Copy,
  Check,
  Target,
  Zap,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import type { Lead, LeadStatus, Currency } from '@/types/database';

interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  wonLeads: number;
  estimatedRevenue: number;
  servicePopularity?: Array<{ name: string; count: number; percentage: number }>;
  leadSources?: Array<{ source: string; count: number; percentage: number }>;
  timeSeriesData?: Array<{ date: string; leads: number; revenue: number }>;
}

// Simple CSS-based bar chart component
function BarChart({ data, height = 200 }: { data: Array<{ label: string; value: number; color?: string }>; height?: number }) {
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="flex items-end justify-between gap-2" style={{ height }}>
      {data.map((item, i) => {
        const barHeight = (item.value / maxValue) * 100;
        return (
          <div key={i} className="flex flex-col items-center flex-1 gap-2">
            <div className="relative w-full flex flex-col justify-end" style={{ height: height - 40 }}>
              <div
                className={cn(
                  'w-full rounded-t-lg transition-all duration-500 hover:opacity-80',
                  item.color || 'bg-gradient-to-t from-blue-600 to-blue-400'
                )}
                style={{ height: `${barHeight}%`, minHeight: item.value > 0 ? 4 : 0 }}
              />
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-slate-700">
                {item.value}
              </span>
            </div>
            <span className="text-xs text-slate-500 text-center truncate w-full">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// Donut chart component
function DonutChart({ data, size = 120 }: { data: Array<{ label: string; value: number; color: string }>; size?: number }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let cumulativePercent = 0;

  const segments = data.map((item, i) => {
    const percent = total > 0 ? (item.value / total) * 100 : 0;
    const startPercent = cumulativePercent;
    cumulativePercent += percent;

    return {
      ...item,
      percent,
      startPercent,
      endPercent: cumulativePercent,
    };
  });

  // Create gradient for conic-gradient
  const gradientStops = segments
    .map(s => `${s.color} ${s.startPercent}% ${s.endPercent}%`)
    .join(', ');

  return (
    <div className="flex items-center gap-4">
      <div
        className="rounded-full flex-shrink-0"
        style={{
          width: size,
          height: size,
          background: total > 0 ? `conic-gradient(${gradientStops})` : '#e2e8f0',
          position: 'relative',
        }}
      >
        <div
          className="absolute bg-white rounded-full"
          style={{
            width: size * 0.6,
            height: size * 0.6,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
      <div className="space-y-2">
        {segments.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-sm text-slate-600">{s.label}</span>
            <span className="text-sm font-medium text-slate-900">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Mini sparkline component
function Sparkline({ data, color = 'text-blue-500' }: { data: number[]; color?: string }) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((v - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 100 50" className="h-12 w-24">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={color}
      />
    </svg>
  );
}

// KPI Card with trend
function KPICard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  trend,
  sparklineData,
}: {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
  sparklineData?: number[];
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
            {change !== undefined && (
              <div className={cn(
                'flex items-center gap-1 mt-2 text-sm font-medium',
                trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-slate-500'
              )}>
                {trend === 'up' ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : trend === 'down' ? (
                  <ArrowDownRight className="h-4 w-4" />
                ) : null}
                <span>{change > 0 ? '+' : ''}{change}%</span>
                <span className="text-slate-400 font-normal">{changeLabel}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className={cn(
              'p-3 rounded-xl',
              trend === 'up' ? 'bg-green-100' : trend === 'down' ? 'bg-red-100' : 'bg-blue-100'
            )}>
              <Icon className={cn(
                'h-5 w-5',
                trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-blue-600'
              )} />
            </div>
            {sparklineData && (
              <Sparkline
                data={sparklineData}
                color={trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-blue-500'}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function OverviewPage() {
  const { company } = useCompany();
  const { t, language } = useDashboardLanguage();
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    newLeads: 0,
    wonLeads: 0,
    estimatedRevenue: 0,
  });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!company) return;

    // Always use demo data
    const demoStats = getDemoStats() as unknown as DashboardStats;
    setStats(demoStats);
    setRecentLeads(DEMO_LEADS.slice(0, 5) as unknown as Lead[]);
    setLoading(false);
  }, [company]);

  const conversionRate = stats.totalLeads > 0
    ? Math.round((stats.wonLeads / stats.totalLeads) * 100)
    : 0;

  // Calculate status distribution for donut chart
  const statusDistribution = useMemo(() => {
    const distribution = DEMO_LEADS.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { label: 'New', value: distribution['new'] || 0, color: '#3b82f6' },
      { label: 'Contacted', value: distribution['contacted'] || 0, color: '#eab308' },
      { label: 'Quoted', value: distribution['quoted'] || 0, color: '#a855f7' },
      { label: 'Won', value: distribution['won'] || 0, color: '#22c55e' },
      { label: 'Lost', value: distribution['lost'] || 0, color: '#94a3b8' },
    ];
  }, []);

  // Calculate service popularity
  const servicePopularity = useMemo(() => {
    const popularity = DEMO_LEADS.reduce((acc, lead) => {
      acc[lead.job_type_id] = (acc[lead.job_type_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(popularity)
      .map(([id, count]) => ({
        id,
        name: DEMO_JOB_TYPES.find(jt => jt.id === id)?.name || 'Unknown',
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, []);

  // Monthly data for bar chart
  const monthlyData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const baseValues = [12, 18, 15, 22, 25, 21];
    return months.map((label, i) => ({
      label,
      value: baseValues[i],
    }));
  }, []);

  // Sparkline data
  const revenueSparkline = [150, 180, 165, 200, 220, 195, 240];
  const leadsSparkline = [8, 12, 10, 15, 14, 18, 21];

  const copyEmbedCode = () => {
    if (company) {
      navigator.clipboard.writeText(
        `<script src="${window.location.origin}/api/widget/${company.slug}"></script>`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {t.overview.welcome}, {company?.name}
          </h1>
          <p className="text-slate-600">{t.overview.subtitle}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/demo">
            <Button variant="outline">
              <Activity className="mr-2 h-4 w-4" />
              View Demo
            </Button>
          </Link>
          <Link href="/forms/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t.overview.createEstimator}
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title={t.overview.totalLeads}
          value={stats.totalLeads}
          change={12}
          changeLabel="vs last month"
          icon={Users}
          trend="up"
          sparklineData={leadsSparkline}
        />
        <KPICard
          title={t.overview.newLeads}
          value={stats.newLeads}
          change={-5}
          changeLabel="vs last month"
          icon={FileText}
          trend="down"
        />
        <KPICard
          title={t.overview.conversionRate}
          value={`${conversionRate}%`}
          change={8}
          changeLabel="vs last month"
          icon={Target}
          trend="up"
        />
        <KPICard
          title={t.overview.estimatedRevenue}
          value={formatCurrency(stats.estimatedRevenue, company?.default_currency || 'USD', language)}
          change={24}
          changeLabel="vs last month"
          icon={DollarSign}
          trend="up"
          sparklineData={revenueSparkline}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Leads Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  Monthly Leads
                </CardTitle>
                <CardDescription>Lead volume over the past 6 months</CardDescription>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                <TrendingUp className="h-3 w-3 mr-1" />
                +15%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <BarChart data={monthlyData} height={180} />
          </CardContent>
        </Card>

        {/* Pipeline Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-purple-500" />
              Pipeline Distribution
            </CardTitle>
            <CardDescription>Current status of all leads</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart data={statusDistribution} size={140} />
          </CardContent>
        </Card>
      </div>

      {/* Service Popularity & Recent Leads Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Popular Services */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              Popular Services
            </CardTitle>
            <CardDescription>Most requested service types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {servicePopularity.map((service, i) => {
                const maxCount = servicePopularity[0]?.count || 1;
                const percentage = (service.count / maxCount) * 100;
                return (
                  <div key={service.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700 truncate flex-1">
                        {service.name}
                      </span>
                      <span className="text-sm font-bold text-slate-900">{service.count}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          i === 0 ? 'bg-gradient-to-r from-blue-500 to-purple-500' :
                          i === 1 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                          i === 2 ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                          'bg-slate-300'
                        )}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Leads */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{t.overview.recentLeads}</CardTitle>
              <CardDescription>Latest incoming leads</CardDescription>
            </div>
            <Link href="/leads">
              <Button variant="ghost" size="sm">
                {t.overview.viewAll}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentLeads.length === 0 ? (
              <div className="py-8 text-center">
                <Users className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-2 text-slate-600">{t.overview.noLeadsYet}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentLeads.map((lead) => {
                  const leadValue = calculateLeadValue(lead, company?.default_currency as Currency);
                  const jobType = DEMO_JOB_TYPES.find(jt => jt.id === lead.job_type_id);
                  return (
                    <Link
                      key={lead.id}
                      href={`/leads/${lead.id}`}
                      className="flex items-center justify-between rounded-lg border border-slate-200 p-3 transition-all hover:bg-slate-50 hover:border-slate-300"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                          {lead.customer_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-slate-900 truncate">
                            {lead.customer_name}
                          </p>
                          <p className="text-sm text-slate-500 flex items-center gap-2">
                            {jobType && (
                              <span className="flex items-center gap-1">
                                <Zap className="h-3 w-3 text-blue-500" />
                                {jobType.name}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                          <p className="font-semibold text-slate-900 text-sm">
                            {formatCurrency(lead.estimated_price_low, company?.default_currency || 'USD', language)}
                          </p>
                          <p className="text-xs text-slate-400">
                            {formatDate(lead.created_at, language)}
                          </p>
                        </div>
                        <Badge className={cn(getStatusColor(lead.status), 'flex-shrink-0')}>
                          {t.status[lead.status as LeadStatus]}
                        </Badge>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Embed Code */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{t.overview.quickActions}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/forms/new" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                {t.overview.createEstimator}
              </Button>
            </Link>
            <Link href="/forms" className="block">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                {t.overview.manageForms}
              </Button>
            </Link>
            <Link href="/leads" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                {t.overview.viewLeads}
              </Button>
            </Link>
            <Link href="/settings" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Target className="mr-2 h-4 w-4" />
                Customize Settings
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t.overview.embedCode}</CardTitle>
            <CardDescription>{t.overview.embedDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-slate-900 p-4 overflow-x-auto">
              <code className="text-sm text-green-400 whitespace-pre">
                {`<script src="${typeof window !== 'undefined' ? window.location.origin : ''}/api/widget/${company?.slug}"></script>`}
              </code>
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={copyEmbedCode}
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    {t.common.copied}
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    {t.overview.copyCode}
                  </>
                )}
              </Button>
              <Link href={`/e/${company?.slug}`} target="_blank">
                <Button variant="outline">
                  Preview
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
