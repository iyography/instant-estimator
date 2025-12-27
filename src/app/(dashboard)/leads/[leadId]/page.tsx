'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCompany } from '@/hooks/use-company';
import { useDashboardLanguage } from '@/hooks/use-dashboard-language';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatCurrency, formatDate, getStatusColor, cn } from '@/lib/utils';
import { DEMO_LEADS, DEMO_JOB_TYPES, DEMO_QUESTIONS, DEMO_ANSWERS } from '@/lib/demo/data';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Copy,
  ExternalLink,
  Save,
  Calendar,
  DollarSign,
  FileText,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap,
  Send,
  Printer,
  Download,
  User,
  Building,
} from 'lucide-react';
import type { LeadWithResponses, LeadStatus, JobType, Question, AnswerOption } from '@/types/database';

interface EstimateBreakdown {
  label: string;
  amount: number;
}

interface ExtendedLead extends LeadWithResponses {
  estimate_breakdown?: EstimateBreakdown[];
}

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { company } = useCompany();
  const { t, language } = useDashboardLanguage();
  const leadId = params.leadId as string;

  const [lead, setLead] = useState<ExtendedLead | null>(null);
  const [jobType, setJobType] = useState<JobType | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answerOptions, setAnswerOptions] = useState<AnswerOption[]>([]);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<LeadStatus>('new');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const statusOptions = [
    { value: 'new', label: t.status.new },
    { value: 'contacted', label: t.status.contacted },
    { value: 'quoted', label: t.status.quoted },
    { value: 'won', label: t.status.won },
    { value: 'lost', label: t.status.lost },
  ];

  useEffect(() => {
    if (!company) return;

    // Load demo data
    const demoLead = DEMO_LEADS.find(l => l.id === leadId);
    if (demoLead) {
      setLead(demoLead as unknown as ExtendedLead);
      setNotes(demoLead.notes || '');
      setStatus(demoLead.status);

      const demoJobType = DEMO_JOB_TYPES.find(jt => jt.id === demoLead.job_type_id);
      if (demoJobType) {
        setJobType(demoJobType as unknown as JobType);
        const demoQuestions = DEMO_QUESTIONS.filter(q => q.job_type_id === demoJobType.id);
        setQuestions(demoQuestions as unknown as Question[]);
        const questionIds = demoQuestions.map(q => q.id);
        const demoAnswers = DEMO_ANSWERS.filter(a => questionIds.includes(a.question_id));
        setAnswerOptions(demoAnswers as unknown as AnswerOption[]);
      }
    }
    setLoading(false);
  }, [leadId, company]);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLead((prev) => prev ? { ...prev, status, notes } : null);
    setSaving(false);
  };

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getAnswerText = (questionId: string, answerOptionId: string | null, rawAnswer: string | null) => {
    if (rawAnswer) return rawAnswer;
    if (answerOptionId) {
      const answer = answerOptions.find((a) => a.id === answerOptionId);
      return answer?.answer_text || '-';
    }
    return '-';
  };

  const getStatusIcon = (s: LeadStatus) => {
    switch (s) {
      case 'new': return <AlertCircle className="h-4 w-4" />;
      case 'contacted': return <MessageSquare className="h-4 w-4" />;
      case 'quoted': return <FileText className="h-4 w-4" />;
      case 'won': return <CheckCircle2 className="h-4 w-4" />;
      case 'lost': return <AlertCircle className="h-4 w-4" />;
    }
  };

  // Calculate total from breakdown
  const calculateTotal = () => {
    if (!lead?.estimate_breakdown) return 0;
    return lead.estimate_breakdown.reduce((sum, item) => sum + item.amount, 0);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">{t.common.noResults}</p>
        <Link href="/leads">
          <Button variant="outline" className="mt-4">
            {t.common.back}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/leads">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">
                {lead.customer_name}
              </h1>
              <Badge className={cn(getStatusColor(status), 'flex items-center gap-1')}>
                {getStatusIcon(status)}
                {t.status[status as LeadStatus]}
              </Badge>
            </div>
            <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
              {jobType && (
                <span className="flex items-center gap-1">
                  <Zap className="h-4 w-4 text-blue-500" />
                  {jobType.name}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(lead.created_at, language)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Send className="h-4 w-4 mr-2" />
            Send Quote
          </Button>
          <Button onClick={handleSave} isLoading={saving}>
            <Save className="mr-2 h-4 w-4" />
            {t.common.save}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Estimate Breakdown Card */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Estimate Summary</CardTitle>
                  <CardDescription className="text-blue-100">
                    {jobType?.name || 'Service'}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-100">Price Range</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(lead.estimated_price_low, company?.default_currency || 'USD', language)}
                    <span className="text-blue-200 mx-1">-</span>
                    {formatCurrency(lead.estimated_price_high, company?.default_currency || 'USD', language)}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {lead.estimate_breakdown && lead.estimate_breakdown.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {lead.estimate_breakdown.map((item, i) => (
                    <div key={i} className={cn(
                      'flex items-center justify-between px-6 py-3',
                      i === 0 && 'bg-slate-50'
                    )}>
                      <span className={cn(
                        i === 0 ? 'font-semibold text-slate-900' : 'text-slate-600'
                      )}>
                        {item.label}
                      </span>
                      <span className={cn(
                        'font-medium',
                        i === 0 ? 'text-slate-900' : item.amount >= 0 ? 'text-slate-700' : 'text-green-600'
                      )}>
                        {i === 0 ? '' : item.amount >= 0 ? '+' : ''}
                        {formatCurrency(Math.abs(item.amount), company?.default_currency || 'USD', language)}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t-2 border-slate-200">
                    <span className="font-bold text-slate-900">Total Estimate</span>
                    <span className="text-xl font-bold text-slate-900">
                      {formatCurrency(calculateTotal(), company?.default_currency || 'USD', language)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-slate-500">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                  <p>No detailed breakdown available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Responses */}
          {lead.lead_responses && lead.lead_responses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                  {t.leadDetail.responses}
                </CardTitle>
                <CardDescription>
                  Answers provided by the customer during estimation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {questions.map((question, index) => {
                    const response = lead.lead_responses?.find((r) => r.question_id === question.id);
                    if (!response) return null;
                    return (
                      <div key={question.id} className={cn(
                        'p-4 rounded-lg bg-slate-50',
                        index < questions.length - 1 && 'border-b border-slate-100'
                      )}>
                        <p className="text-sm font-medium text-slate-500 mb-1">
                          Q{index + 1}. {question.question_text}
                        </p>
                        <p className="text-slate-900 font-medium">
                          {getAnswerText(question.id, response.answer_option_id, response.raw_answer)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                {t.leadDetail.notes}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t.leadDetail.notesPlaceholder}
                rows={4}
                className="resize-none"
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                {t.leadDetail.contactInfo}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Email */}
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="font-medium text-slate-900 truncate">{lead.customer_email}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => copyToClipboard(lead.customer_email, 'email')}
                >
                  {copiedField === 'email' ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Phone */}
              {lead.customer_phone && (
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500">Phone</p>
                      <p className="font-medium text-slate-900">{lead.customer_phone}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(lead.customer_phone!, 'phone')}
                    >
                      {copiedField === 'phone' ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <a href={`tel:${lead.customer_phone}`}>
                      <Button variant="ghost" size="icon">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                </div>
              )}

              {/* Address */}
              {lead.customer_address && (
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500">Address</p>
                      <p className="font-medium text-slate-900 text-sm">{lead.customer_address}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(lead.customer_address!)}`, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                Lead Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value as LeadStatus)}
                options={statusOptions}
              />

              {/* Status Timeline */}
              <div className="space-y-3 pt-4 border-t">
                {['new', 'contacted', 'quoted', 'won'].map((s, i) => {
                  const statusIndex = ['new', 'contacted', 'quoted', 'won', 'lost'].indexOf(status);
                  const isCompleted = ['new', 'contacted', 'quoted', 'won', 'lost'].indexOf(s) <= statusIndex && status !== 'lost';
                  const isCurrent = s === status;

                  return (
                    <div key={s} className="flex items-center gap-3">
                      <div className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors',
                        isCompleted ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400',
                        isCurrent && 'ring-2 ring-offset-2 ring-blue-500'
                      )}>
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <span className="text-xs font-medium">{i + 1}</span>
                        )}
                      </div>
                      <span className={cn(
                        'text-sm font-medium',
                        isCompleted ? 'text-slate-900' : 'text-slate-400'
                      )}>
                        {t.status[s as LeadStatus]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Send className="h-4 w-4 mr-2" />
                Send Follow-up Email
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Site Visit
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Export to PDF
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
