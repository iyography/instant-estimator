'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useCompany } from '@/hooks/use-company';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { Plus, FileText, MoreVertical, Copy, ExternalLink, Pencil, Trash2 } from 'lucide-react';
import type { JobType, EstimatorForm } from '@/types/database';

export default function FormsPage() {
  const { company } = useCompany();
  const [jobTypes, setJobTypes] = useState<JobType[]>([]);
  const [forms, setForms] = useState<EstimatorForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      if (!company) return;

      try {
        const [jobTypesRes, formsRes] = await Promise.all([
          supabase
            .from('job_types')
            .select('*')
            .eq('company_id', company.id)
            .order('display_order', { ascending: true }),
          supabase
            .from('estimator_forms')
            .select('*')
            .eq('company_id', company.id)
            .order('created_at', { ascending: false }),
        ]);

        if (jobTypesRes.data) setJobTypes(jobTypesRes.data);
        if (formsRes.data) setForms(formsRes.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [company, supabase]);

  const handleDeleteJobType = async (id: string) => {
    if (!confirm('Ar du saker pa att du vill ta bort denna jobbtyp?')) return;

    const { error } = await supabase.from('job_types').delete().eq('id', id);

    if (!error) {
      setJobTypes(jobTypes.filter((jt) => jt.id !== id));
    }
    setActiveMenu(null);
  };

  const copyEmbedCode = (slug: string) => {
    const code = `<script src="${window.location.origin}/widget/${company?.slug}.js" data-form="${slug}"></script>`;
    navigator.clipboard.writeText(code);
    setActiveMenu(null);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Job Types Section */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Jobbtyper</h1>
            <p className="text-slate-600">Hantera dina jobbtyper och fragor</p>
          </div>
          <Link href="/forms/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ny jobbtyp
            </Button>
          </Link>
        </div>

        {jobTypes.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-lg font-medium text-slate-900">
                Inga jobbtyper annu
              </h3>
              <p className="mt-1 text-slate-600">
                Skapa din forsta jobbtyp for att komma igang
              </p>
              <Link href="/forms/new" className="mt-4">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Skapa jobbtyp
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jobTypes.map((jobType) => (
              <Card key={jobType.id} className="relative">
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div>
                    <CardTitle className="text-lg">{jobType.name}</CardTitle>
                    {jobType.description && (
                      <p className="mt-1 text-sm text-slate-500">
                        {jobType.description}
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        setActiveMenu(activeMenu === jobType.id ? null : jobType.id)
                      }
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                    {activeMenu === jobType.id && (
                      <div className="absolute right-0 top-8 z-10 w-48 rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                        <Link
                          href={`/forms/${jobType.id}`}
                          className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          onClick={() => setActiveMenu(null)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Redigera
                        </Link>
                        <button
                          className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-slate-50"
                          onClick={() => handleDeleteJobType(jobType.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Ta bort
                        </button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Baspris</p>
                      <p className="font-semibold">
                        {formatCurrency(
                          jobType.base_price,
                          company?.default_currency || 'SEK',
                          company?.default_language || 'sv'
                        )}
                      </p>
                    </div>
                    <Badge variant={jobType.is_active ? 'success' : 'secondary'}>
                      {jobType.is_active ? 'Aktiv' : 'Inaktiv'}
                    </Badge>
                  </div>
                  <Link href={`/forms/${jobType.id}`}>
                    <Button variant="outline" className="mt-4 w-full">
                      Redigera fragor
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Estimator Forms Section */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Estimatorformular</h2>
            <p className="text-slate-600">
              Anpassade formular for olika andamal
            </p>
          </div>
          <Button variant="outline" disabled={jobTypes.length === 0}>
            <Plus className="mr-2 h-4 w-4" />
            Nytt formular
          </Button>
        </div>

        {forms.length === 0 && jobTypes.length > 0 && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-slate-600">
                Ditt standardformular anvander alla aktiva jobbtyper.
              </p>
              <div className="mt-4 rounded-md bg-slate-100 p-4">
                <p className="mb-2 text-sm font-medium">Publik lank</p>
                <a
                  href={`${window.location.origin}/e/${company?.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center text-blue-600 hover:underline"
                >
                  {window.location.origin}/e/{company?.slug}
                  <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </div>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  const code = `<script src="${window.location.origin}/widget/${company?.slug}.js"></script>`;
                  navigator.clipboard.writeText(code);
                }}
              >
                <Copy className="mr-2 h-4 w-4" />
                Kopiera inbaddningskod
              </Button>
            </CardContent>
          </Card>
        )}

        {forms.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {forms.map((form) => (
              <Card key={form.id}>
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div>
                    <CardTitle className="text-lg">{form.name}</CardTitle>
                    <p className="text-sm text-slate-500">/{form.slug}</p>
                  </div>
                  <Badge variant={form.is_active ? 'success' : 'secondary'}>
                    {form.is_active ? 'Aktiv' : 'Inaktiv'}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => copyEmbedCode(form.slug)}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Kopiera kod
                  </Button>
                  <a
                    href={`${window.location.origin}/e/${company?.slug}/${form.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="ghost" className="w-full">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Oppna
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
