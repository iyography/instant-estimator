'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCompany } from '@/hooks/use-company';
import { useDashboardLanguage } from '@/hooks/use-dashboard-language';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DEMO_JOB_TYPES, DEMO_FORMS } from '@/lib/demo/data';
import { Plus, Copy, ExternalLink, X, Check, FileText, Pencil, Trash2, MoreVertical } from 'lucide-react';
import type { JobType, EstimatorForm } from '@/types/database';

export default function FormsPage() {
  const { company } = useCompany();
  const router = useRouter();
  const { t, language } = useDashboardLanguage();
  const [services, setServices] = useState<JobType[]>([]);
  const [forms, setForms] = useState<EstimatorForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // New estimator form state
  const [newFormName, setNewFormName] = useState('');
  const [newFormSlug, setNewFormSlug] = useState('');
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);

  useEffect(() => {
    if (!company) return;
    // Always use demo data
    setServices(DEMO_JOB_TYPES as unknown as JobType[]);
    setForms(DEMO_FORMS as unknown as EstimatorForm[]);
    setLoading(false);
  }, [company]);

  const handleCreateEstimator = () => {
    if (!newFormName.trim()) return;

    const slug = newFormSlug.trim() || newFormName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const newForm: EstimatorForm = {
      id: `form-${Date.now()}`,
      company_id: company?.id || '',
      name: newFormName,
      slug: slug,
      is_active: true,
      styling: {
        primary_color: '#0f172a',
        background_color: '#ffffff',
        font_family: 'Inter',
      },
      job_type_ids: selectedServiceIds.length > 0 ? selectedServiceIds : services.map(s => s.id),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setForms([...forms, newForm]);
    setShowCreateModal(false);
    setNewFormName('');
    setNewFormSlug('');
    setSelectedServiceIds([]);
  };

  const handleDeleteForm = async (id: string) => {
    if (!confirm('Are you sure you want to delete this estimator?')) return;
    setForms(forms.filter((f) => f.id !== id));
    setActiveMenu(null);
  };

  const copyEmbedCode = (slug: string) => {
    const code = `<script src="${window.location.origin}/api/widget/${company?.slug}${slug ? `?form=${slug}` : ''}"></script>`;
    navigator.clipboard.writeText(code);
    setActiveMenu(null);
  };

  const toggleServiceSelection = (serviceId: string) => {
    setSelectedServiceIds(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
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
      {/* Estimator Forms Section */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Estimators</h1>
            <p className="text-slate-600">
              Create and manage estimator forms. Each estimator can include one or more services.
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} disabled={services.length === 0}>
            <Plus className="mr-2 h-4 w-4" />
            New Estimator
          </Button>
        </div>

        {services.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-lg font-medium text-slate-900">
                Create services first
              </h3>
              <p className="mt-1 text-slate-600 text-center">
                You need to create at least one service before you can create an estimator.
              </p>
              <Link href="/services">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Service
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Default Estimator Card */}
            <Card className="mb-6 border-2 border-blue-100 bg-blue-50/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Default Estimator</CardTitle>
                    <CardDescription>
                      Uses all active services ({services.filter(s => s.is_active).length} services)
                    </CardDescription>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="mb-2 text-sm font-medium text-slate-700">Public Link</p>
                  <div className="flex items-center gap-2">
                    <Input
                      readOnly
                      value={`${typeof window !== 'undefined' ? window.location.origin : ''}/e/${company?.slug}`}
                      className="bg-white"
                    />
                    <a
                      href={`${typeof window !== 'undefined' ? window.location.origin : ''}/e/${company?.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="icon">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const code = `<script src="${window.location.origin}/api/widget/${company?.slug}"></script>`;
                    navigator.clipboard.writeText(code);
                  }}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Embed Code
                </Button>
              </CardContent>
            </Card>

            {/* Custom Estimator Forms */}
            {forms.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Custom Estimators</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {forms.map((form) => {
                    const formServices = services.filter(s => form.job_type_ids?.includes(s.id));
                    return (
                      <Card key={form.id}>
                        <CardHeader className="flex flex-row items-start justify-between pb-2">
                          <div>
                            <CardTitle className="text-lg">{form.name}</CardTitle>
                            <p className="text-sm text-slate-500">/{form.slug}</p>
                            <p className="text-xs text-slate-400 mt-1">
                              {formServices.length} service{formServices.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <div className="relative">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setActiveMenu(activeMenu === form.id ? null : form.id)}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                            {activeMenu === form.id && (
                              <div className="absolute right-0 top-8 z-10 w-48 rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                                <button
                                  className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                  onClick={() => {
                                    setActiveMenu(null);
                                    // TODO: Open edit modal
                                  }}
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </button>
                                <button
                                  className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-slate-50"
                                  onClick={() => handleDeleteForm(form.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => copyEmbedCode(form.slug)}
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Code
                          </Button>
                          <a
                            href={`${typeof window !== 'undefined' ? window.location.origin : ''}/e/${company?.slug}/${form.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="ghost" className="w-full">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Preview
                            </Button>
                          </a>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Estimator Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Create New Estimator</h2>
                <p className="text-slate-600 mt-1">Select which services to include in this estimator</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
              <div>
                <Label htmlFor="formName">Estimator Name</Label>
                <Input
                  id="formName"
                  value={newFormName}
                  onChange={(e) => setNewFormName(e.target.value)}
                  placeholder="e.g., Residential Services"
                />
              </div>

              <div>
                <Label htmlFor="formSlug">URL Slug (optional)</Label>
                <Input
                  id="formSlug"
                  value={newFormSlug}
                  onChange={(e) => setNewFormSlug(e.target.value)}
                  placeholder="e.g., residential"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Leave empty to auto-generate from name
                </p>
              </div>

              <div>
                <Label className="mb-2 block">Select Services</Label>
                <p className="text-sm text-slate-500 mb-3">
                  {selectedServiceIds.length === 0
                    ? 'All services will be included by default'
                    : `${selectedServiceIds.length} service${selectedServiceIds.length !== 1 ? 's' : ''} selected`
                  }
                </p>
                <div className="space-y-2">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => toggleServiceSelection(service.id)}
                      className={`w-full rounded-lg border-2 p-3 text-left transition-all ${
                        selectedServiceIds.includes(service.id)
                          ? 'border-slate-900 bg-slate-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">{service.name}</span>
                          {service.description && (
                            <p className="text-sm text-slate-500 mt-0.5">{service.description}</p>
                          )}
                        </div>
                        {selectedServiceIds.includes(service.id) && (
                          <Check className="h-5 w-5 text-slate-900" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateEstimator} disabled={!newFormName.trim()}>
                Create Estimator
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
