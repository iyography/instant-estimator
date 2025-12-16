'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useCompany } from '@/hooks/use-company';
import { useDashboardLanguage } from '@/hooks/use-dashboard-language';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LeadValueBadge } from '@/components/crm/lead-value-badge';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { calculateLeadValue } from '@/lib/lead-scoring';
import { Users, FileText, TrendingUp, DollarSign, Plus, ArrowRight, Copy, Check } from 'lucide-react';
import type { Lead, LeadStatus, Currency } from '@/types/database';

interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  wonLeads: number;
  estimatedRevenue: number;
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

  const supabase = createClient();

  useEffect(() => {
    async function fetchDashboardData() {
      if (!company) return;

      try {
        // Fetch all leads for stats
        const { data: leads } = await supabase
          .from('leads')
          .select('*')
          .eq('company_id', company.id)
          .order('created_at', { ascending: false });

        if (leads) {
          const totalLeads = leads.length;
          const newLeads = leads.filter((l) => l.status === 'new').length;
          const wonLeads = leads.filter((l) => l.status === 'won').length;
          const estimatedRevenue = leads
            .filter((l) => l.status === 'won')
            .reduce((sum, l) => sum + ((l.estimated_price_low + l.estimated_price_high) / 2), 0);

          setStats({
            totalLeads,
            newLeads,
            wonLeads,
            estimatedRevenue,
          });

          setRecentLeads(leads.slice(0, 5));
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [company, supabase]);

  const conversionRate = stats.totalLeads > 0
    ? Math.round((stats.wonLeads / stats.totalLeads) * 100)
    : 0;

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {t.overview.welcome}, {company?.name}
          </h1>
          <p className="text-slate-600">{t.overview.subtitle}</p>
        </div>
        <Link href="/forms/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t.overview.createEstimator}
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              {t.overview.totalLeads}
            </CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              {t.overview.newLeads}
            </CardTitle>
            <FileText className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newLeads}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              {t.overview.conversionRate}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              {t.overview.estimatedRevenue}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.estimatedRevenue, company?.default_currency || 'SEK', language)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Leads */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t.overview.recentLeads}</CardTitle>
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
              <p className="text-sm text-slate-500">
                {t.overview.shareEstimator}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentLeads.map((lead) => {
                const leadValue = calculateLeadValue(lead, company?.default_currency as Currency);
                return (
                  <Link
                    key={lead.id}
                    href={`/leads/${lead.id}`}
                    className="flex items-center justify-between rounded-lg border border-slate-200 p-4 transition-colors hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium text-slate-900">
                          {lead.customer_name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {lead.customer_email}
                        </p>
                      </div>
                      <LeadValueBadge tier={leadValue} />
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(lead.status)}>
                        {t.status[lead.status as LeadStatus]}
                      </Badge>
                      <p className="mt-1 text-sm text-slate-500">
                        {formatDate(lead.created_at, language)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.overview.embedCode}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-slate-600">
              {t.overview.embedDescription}
            </p>
            <div className="rounded-md bg-slate-100 p-3">
              <code className="text-sm text-slate-800 break-all">
                {`<script src="${typeof window !== 'undefined' ? window.location.origin : ''}/api/widget/${company?.slug}"></script>`}
              </code>
            </div>
            <Button
              variant="outline"
              className="mt-3 w-full"
              onClick={copyEmbedCode}
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  {t.common.copied}
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  {t.overview.copyCode}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
