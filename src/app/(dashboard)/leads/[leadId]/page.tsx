'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCompany } from '@/hooks/use-company';
import { useDashboardLanguage } from '@/hooks/use-dashboard-language';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils';
import { DEMO_LEADS, DEMO_JOB_TYPES, DEMO_QUESTIONS, DEMO_ANSWERS } from '@/lib/demo/data';
import { ArrowLeft, Mail, Phone, MapPin, Copy, ExternalLink, Save } from 'lucide-react';
import type { LeadWithResponses, LeadStatus, JobType, Question, AnswerOption } from '@/types/database';

export default function LeadDetailPage() {
  const params = useParams();
  const { company } = useCompany();
  const { t, language } = useDashboardLanguage();
  const leadId = params.leadId as string;

  const [lead, setLead] = useState<LeadWithResponses | null>(null);
  const [jobType, setJobType] = useState<JobType | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answerOptions, setAnswerOptions] = useState<AnswerOption[]>([]);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<LeadStatus>('new');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
      setLead(demoLead as unknown as LeadWithResponses);
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getAnswerText = (questionId: string, answerOptionId: string | null, rawAnswer: string | null) => {
    if (rawAnswer) return rawAnswer;
    if (answerOptionId) {
      const answer = answerOptions.find((a) => a.id === answerOptionId);
      return answer?.answer_text || '-';
    }
    return '-';
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
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/leads">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {lead.customer_name}
            </h1>
            <p className="text-slate-600">{jobType?.name || t.leads.table.jobType}</p>
          </div>
        </div>
        <Button onClick={handleSave} isLoading={saving}>
          <Save className="mr-2 h-4 w-4" />
          {t.common.save}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t.leadDetail.contactInfo}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-slate-400" />
                <span>{lead.customer_email}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => copyToClipboard(lead.customer_email)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            {lead.customer_phone && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-slate-400" />
                  <span>{lead.customer_phone}</span>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => copyToClipboard(lead.customer_phone!)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <a href={`tel:${lead.customer_phone}`}>
                    <Button variant="ghost" size="icon">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </a>
                </div>
              </div>
            )}
            {lead.customer_address && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-slate-400" />
                  <span>{lead.customer_address}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(lead.customer_address!)}`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.leadDetail.statusEstimate}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">{t.leads.table.status}</label>
              <Select value={status} onChange={(e) => setStatus(e.target.value as LeadStatus)} options={statusOptions} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">{t.leadDetail.priceEstimate}</label>
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(lead.estimated_price_low, company?.default_currency || 'USD', language)}
                {' - '}
                {formatCurrency(lead.estimated_price_high, company?.default_currency || 'USD', language)}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span>{t.leadDetail.created}: {formatDate(lead.created_at, language)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {lead.lead_responses && lead.lead_responses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t.leadDetail.responses}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {questions.map((question) => {
                const response = lead.lead_responses?.find((r) => r.question_id === question.id);
                if (!response) return null;
                return (
                  <div key={question.id} className="border-b border-slate-100 pb-4 last:border-0">
                    <p className="text-sm font-medium text-slate-600">{question.question_text}</p>
                    <p className="mt-1 text-slate-900">{getAnswerText(question.id, response.answer_option_id, response.raw_answer)}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t.leadDetail.notes}</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t.leadDetail.notesPlaceholder} rows={4} />
        </CardContent>
      </Card>
    </div>
  );
}
