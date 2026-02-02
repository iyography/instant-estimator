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
import { SERVICE_TEMPLATES, getTemplateIndustries } from '@/lib/service-templates';
import { formatCurrency } from '@/lib/utils';
import {
  Plus, Copy, ExternalLink, X, Check, FileText, Pencil, Trash2, MoreVertical,
  Zap, Flame, Droplets, Snowflake, Home, Wrench, PaintBucket, Trees, Sparkles, Plug
} from 'lucide-react';
import type { JobType, EstimatorForm } from '@/types/database';

// Icon mapping for templates
const iconMap: Record<string, React.ElementType> = {
  zap: Zap,
  plug: Plug,
  flame: Flame,
  droplets: Droplets,
  snowflake: Snowflake,
  home: Home,
  wrench: Wrench,
  paintbrush: PaintBucket,
  'tree-deciduous': Trees,
  sparkles: Sparkles,
};

// Industry display names
const industryNames: Record<string, string> = {
  electrician: 'Electrical',
  plumber: 'Plumbing',
  hvac: 'HVAC',
  roofing: 'Roofing',
  painter: 'Painting',
  landscaper: 'Landscaping',
  cleaning: 'Cleaning',
};

export default function FormsPage() {
  const { company } = useCompany();
  const router = useRouter();
  const { t, language } = useDashboardLanguage();
  const [estimators, setEstimators] = useState<EstimatorForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // New estimator form state
  const [newFormName, setNewFormName] = useState('');
  const [newFormSlug, setNewFormSlug] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');

  // Get unique industries from templates
  const industries = ['all', ...getTemplateIndustries()];

  // Filter templates by selected industry
  const filteredTemplates = selectedIndustry === 'all'
    ? SERVICE_TEMPLATES
    : SERVICE_TEMPLATES.filter(t => t.industry === selectedIndustry);

  useEffect(() => {
    if (!company) return;
    // Load demo data
    setEstimators(DEMO_FORMS as unknown as EstimatorForm[]);
    setLoading(false);
  }, [company]);

  const handleCreateEstimator = () => {
    const template = SERVICE_TEMPLATES.find(t => t.id === selectedTemplateId);

    // Generate slug from name or template name
    const name = newFormName.trim() || template?.name || 'New Estimator';
    const slug = newFormSlug.trim() || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const newEstimator: EstimatorForm = {
      id: `est-${Date.now()}`,
      company_id: company?.id || '',
      name: name,
      slug: slug,
      is_active: true,
      styling: {
        primary_color: '#0f172a',
        background_color: '#ffffff',
        font_family: 'Inter',
      },
      job_type_ids: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setEstimators([...estimators, newEstimator]);
    setShowCreateModal(false);

    // Reset form
    setNewFormName('');
    setNewFormSlug('');
    setSelectedTemplateId(null);
    setSelectedIndustry('all');

    // Navigate to edit page with template param if selected
    const editUrl = selectedTemplateId
      ? `/forms/${newEstimator.id}?template=${selectedTemplateId}`
      : `/forms/${newEstimator.id}`;
    router.push(editUrl);
  };

  const handleDeleteEstimator = async (id: string) => {
    if (!confirm('Are you sure you want to delete this estimator?')) return;
    setEstimators(estimators.filter((e) => e.id !== id));
    setActiveMenu(null);
  };

  const copyEmbedCode = (slug: string) => {
    const code = `<script src="${window.location.origin}/api/widget/${company?.slug}${slug ? `?form=${slug}` : ''}"></script>`;
    navigator.clipboard.writeText(code);
    setActiveMenu(null);
  };

  const openCreateModal = () => {
    setShowCreateModal(true);
    setNewFormName('');
    setNewFormSlug('');
    setSelectedTemplateId(null);
    setSelectedIndustry('all');
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
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Estimators</h1>
          <p className="text-slate-600">
            Create and manage estimator forms. Each estimator includes one service.
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          New Estimator
        </Button>
      </div>

      {/* Default Estimator Card */}
      <Card className="border-2 border-blue-100 bg-blue-50/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Default Estimator</CardTitle>
              <CardDescription>
                Uses all active services ({DEMO_JOB_TYPES.filter((s: any) => s.is_active).length} services)
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

      {/* Custom Estimators */}
      {estimators.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Custom Estimators</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {estimators.map((estimator) => (
              <Card key={estimator.id}>
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div>
                    <CardTitle className="text-lg">{estimator.name}</CardTitle>
                    <p className="text-sm text-slate-500">/{estimator.slug}</p>
                  </div>
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setActiveMenu(activeMenu === estimator.id ? null : estimator.id)}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                    {activeMenu === estimator.id && (
                      <div className="absolute right-0 top-8 z-10 w-48 rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                        <Link href={`/forms/${estimator.id}`}>
                          <button
                            className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            onClick={() => setActiveMenu(null)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </button>
                        </Link>
                        <button
                          className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-slate-50"
                          onClick={() => handleDeleteEstimator(estimator.id)}
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
                    onClick={() => copyEmbedCode(estimator.slug)}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Code
                  </Button>
                  <a
                    href={`${typeof window !== 'undefined' ? window.location.origin : ''}/e/${company?.slug}/${estimator.slug}`}
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
            ))}
          </div>
        </div>
      )}

      {/* Create Estimator Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Create New Estimator</h2>
                <p className="text-slate-600 mt-1">Select a template to get started quickly</p>
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
              {/* Name and Slug inputs */}
              <div className="grid gap-4 md:grid-cols-2">
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
              </div>

              {/* Industry Filter Tabs */}
              <div>
                <Label className="mb-2 block">Select Template</Label>
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={() => setSelectedIndustry('all')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedIndustry === 'all'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All Industries
                  </button>
                  {industries.filter(i => i !== 'all').map((industry) => (
                    <button
                      key={industry}
                      onClick={() => setSelectedIndustry(industry)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedIndustry === industry
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {industryNames[industry] || industry}
                    </button>
                  ))}
                </div>

                {/* Template Cards Grid */}
                <div className="grid gap-3 md:grid-cols-2">
                  {/* Create from Scratch option */}
                  <button
                    onClick={() => setSelectedTemplateId(null)}
                    className={`rounded-xl border-2 p-4 text-left transition-all ${
                      selectedTemplateId === null
                        ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900/10'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-5 w-5 text-slate-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900">Create from Scratch</span>
                          {selectedTemplateId === null && (
                            <Check className="h-5 w-5 text-slate-900" />
                          )}
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5">
                          Start with a blank service and add your own questions
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Template cards */}
                  {filteredTemplates.map((template) => {
                    const IconComponent = iconMap[template.icon] || Zap;
                    const isSelected = selectedTemplateId === template.id;

                    return (
                      <button
                        key={template.id}
                        onClick={() => {
                          setSelectedTemplateId(template.id);
                          if (!newFormName) {
                            setNewFormName(template.name);
                          }
                        }}
                        className={`rounded-xl border-2 p-4 text-left transition-all ${
                          isSelected
                            ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900/10'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            template.industry === 'electrician' ? 'bg-yellow-100 text-yellow-600' :
                            template.industry === 'plumber' ? 'bg-blue-100 text-blue-600' :
                            template.industry === 'hvac' ? 'bg-cyan-100 text-cyan-600' :
                            template.industry === 'roofing' ? 'bg-orange-100 text-orange-600' :
                            template.industry === 'painter' ? 'bg-purple-100 text-purple-600' :
                            template.industry === 'landscaper' ? 'bg-green-100 text-green-600' :
                            template.industry === 'cleaning' ? 'bg-pink-100 text-pink-600' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-slate-900">{template.name}</span>
                              {isSelected && (
                                <Check className="h-5 w-5 text-slate-900" />
                              )}
                            </div>
                            <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">
                              {template.description}
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                              <span>From {formatCurrency(template.basePrice, company?.default_currency || 'USD', 'en')}</span>
                              <span>{template.questions.length} questions</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateEstimator}>
                Create Estimator
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
