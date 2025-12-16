'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useCompany } from '@/hooks/use-company';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { ArrowLeft, Mail, Phone, MapPin, Copy, ExternalLink, Save } from 'lucide-react';
import type { LeadWithResponses, LeadStatus, JobType, Question, AnswerOption } from '@/types/database';

const statusOptions = [
  { value: 'new', label: 'Ny' },
  { value: 'contacted', label: 'Kontaktad' },
  { value: 'quoted', label: 'Offert' },
  { value: 'won', label: 'Vunnen' },
  { value: 'lost', label: 'Forlorad' },
];

const statusLabels: Record<LeadStatus, string> = {
  new: 'Ny',
  contacted: 'Kontaktad',
  quoted: 'Offert',
  won: 'Vunnen',
  lost: 'Forlorad',
};

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { company } = useCompany();
  const leadId = params.leadId as string;

  const [lead, setLead] = useState<LeadWithResponses | null>(null);
  const [jobType, setJobType] = useState<JobType | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answerOptions, setAnswerOptions] = useState<AnswerOption[]>([]);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<LeadStatus>('new');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      if (!company) return;

      try {
        // Fetch lead with responses
        const { data: leadData, error: leadError } = await supabase
          .from('leads')
          .select(`
            *,
            lead_responses (*)
          `)
          .eq('id', leadId)
          .single();

        if (leadError) throw leadError;

        setLead(leadData);
        setNotes(leadData.notes || '');
        setStatus(leadData.status);

        // Fetch job type
        if (leadData.job_type_id) {
          const { data: jobTypeData } = await supabase
            .from('job_types')
            .select('*')
            .eq('id', leadData.job_type_id)
            .single();

          if (jobTypeData) {
            setJobType(jobTypeData);

            // Fetch questions for this job type
            const { data: questionsData } = await supabase
              .from('questions')
              .select('*')
              .eq('job_type_id', jobTypeData.id)
              .order('display_order', { ascending: true });

            if (questionsData) {
              setQuestions(questionsData);

              // Fetch answer options
              const questionIds = questionsData.map((q) => q.id);
              const { data: answersData } = await supabase
                .from('answer_options')
                .select('*')
                .in('question_id', questionIds);

              if (answersData) setAnswerOptions(answersData);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch lead:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [leadId, company, supabase]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('leads')
        .update({
          status,
          notes,
        })
        .eq('id', leadId);

      if (error) throw error;

      setLead((prev) =>
        prev ? { ...prev, status, notes } : null
      );
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Kunde inte spara. Forsok igen.');
    } finally {
      setSaving(false);
    }
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
        <p className="text-slate-600">Lead hittades inte</p>
        <Link href="/leads">
          <Button variant="outline" className="mt-4">
            Tillbaka till leads
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
            <p className="text-slate-600">{jobType?.name || 'Okand jobbtyp'}</p>
          </div>
        </div>
        <Button onClick={handleSave} isLoading={saving}>
          <Save className="mr-2 h-4 w-4" />
          Spara
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle>Kontaktinformation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-slate-400" />
                <span>{lead.customer_email}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(lead.customer_email)}
              >
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
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(lead.customer_phone!)}
                  >
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
                  onClick={() =>
                    window.open(
                      `https://maps.google.com/?q=${encodeURIComponent(lead.customer_address!)}`,
                      '_blank'
                    )
                  }
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status & Estimate */}
        <Card>
          <CardHeader>
            <CardTitle>Status & Uppskattning</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Status
              </label>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value as LeadStatus)}
                options={statusOptions}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Prisuppskattning
              </label>
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(
                  lead.estimated_price_low,
                  company?.default_currency || 'SEK',
                  company?.default_language || 'sv'
                )}
                {' - '}
                {formatCurrency(
                  lead.estimated_price_high,
                  company?.default_currency || 'SEK',
                  company?.default_language || 'sv'
                )}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span>
                Skapad: {formatDate(lead.created_at, company?.default_language || 'sv')}
              </span>
              {lead.source_url && (
                <a
                  href={lead.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:underline"
                >
                  Kalla
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Responses */}
      {lead.lead_responses && lead.lead_responses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Svar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {questions.map((question) => {
                const response = lead.lead_responses?.find(
                  (r) => r.question_id === question.id
                );
                if (!response) return null;

                return (
                  <div key={question.id} className="border-b border-slate-100 pb-4 last:border-0">
                    <p className="text-sm font-medium text-slate-600">
                      {question.question_text}
                    </p>
                    <p className="mt-1 text-slate-900">
                      {getAnswerText(
                        question.id,
                        response.answer_option_id,
                        response.raw_answer
                      )}
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
          <CardTitle>Anteckningar</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Lagg till anteckningar om denna lead..."
            rows={4}
          />
        </CardContent>
      </Card>
    </div>
  );
}
