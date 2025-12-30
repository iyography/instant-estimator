'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCompany } from '@/hooks/use-company';
import { useDashboardLanguage } from '@/hooks/use-dashboard-language';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { DEMO_JOB_TYPES } from '@/lib/demo/data';
import { SERVICE_TEMPLATES, getTemplatesByIndustry, type ServiceTemplate } from '@/lib/service-templates';
import { Plus, FileText, MoreVertical, Pencil, Trash2, X, Zap, Flame, Droplets, Snowflake, Home, Wrench, PaintBucket, TreeDeciduous, Sparkles, LayoutTemplate, FileEdit, GripVertical } from 'lucide-react';
import type { JobType } from '@/types/database';

// Icon mapping for templates
const iconMap: Record<string, React.ElementType> = {
  zap: Zap,
  plug: Zap,
  flame: Flame,
  droplets: Droplets,
  snowflake: Snowflake,
  home: Home,
  wrench: Wrench,
  paintbrush: PaintBucket,
  'tree-deciduous': TreeDeciduous,
  sparkles: Sparkles,
};

export default function ServicesPage() {
  const { company } = useCompany();
  const router = useRouter();
  const { t, language } = useDashboardLanguage();
  const [services, setServices] = useState<JobType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');

  // Get templates filtered by industry
  const filteredTemplates = selectedIndustry === 'all'
    ? SERVICE_TEMPLATES
    : getTemplatesByIndustry(selectedIndustry);

  const industries = [
    { value: 'all', label: 'All Industries' },
    { value: 'electrician', label: 'Electrical' },
    { value: 'plumber', label: 'Plumbing' },
    { value: 'hvac', label: 'HVAC' },
    { value: 'roofing', label: 'Roofing' },
    { value: 'painter', label: 'Painting' },
    { value: 'landscaper', label: 'Landscaping' },
    { value: 'cleaning', label: 'Cleaning' },
  ];

  const handleSelectTemplate = (template: ServiceTemplate) => {
    const newService: JobType = {
      id: `template-${Date.now()}`,
      company_id: company?.id || '',
      name: template.name,
      name_sv: null,
      description: template.description,
      description_sv: null,
      base_price: template.basePrice,
      is_active: true,
      display_order: services.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setServices([...services, newService]);
    setShowTemplateModal(false);
    router.push(`/forms/${newService.id}`);
  };

  const handleCreateFromScratch = () => {
    setShowTemplateModal(false);
    router.push('/forms/new');
  };

  useEffect(() => {
    if (!company) return;
    // Always use demo data
    setServices(DEMO_JOB_TYPES as unknown as JobType[]);
    setLoading(false);
  }, [company]);

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    setServices(services.filter((s) => s.id !== id));
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
      {/* Services Section */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Services</h1>
            <p className="text-slate-600">Manage your services and their questions. Services are templates that can be included in estimators.</p>
          </div>
          <Button onClick={() => setShowTemplateModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Service
          </Button>
        </div>

        {services.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-lg font-medium text-slate-900">
                No services yet
              </h3>
              <p className="mt-1 text-slate-600">
                Create your first service to get started
              </p>
              <Button className="mt-4" onClick={() => setShowTemplateModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Service
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card key={service.id} className="relative">
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    {service.description && (
                      <p className="mt-1 text-sm text-slate-500">
                        {service.description}
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        setActiveMenu(activeMenu === service.id ? null : service.id)
                      }
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                    {activeMenu === service.id && (
                      <div className="absolute right-0 top-8 z-10 w-48 rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                        <Link
                          href={`/forms/${service.id}`}
                          className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          onClick={() => setActiveMenu(null)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          {t.common.edit}
                        </Link>
                        <button
                          className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-slate-50"
                          onClick={() => handleDeleteService(service.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t.common.delete}
                        </button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Base price</p>
                      <p className="font-semibold">
                        {formatCurrency(
                          service.base_price,
                          company?.default_currency || 'USD',
                          language
                        )}
                      </p>
                    </div>
                    <Badge variant={service.is_active ? 'success' : 'secondary'}>
                      {service.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <Link href={`/forms/${service.id}`}>
                    <Button variant="outline" className="mt-4 w-full">
                      Edit Questions
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Template Selection Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Create New Service</h2>
                <p className="text-slate-600 mt-1">Choose a template to get started quickly, or create from scratch</p>
              </div>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            {/* Industry Filter */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex flex-wrap gap-2">
                {industries.map((industry) => (
                  <button
                    key={industry.value}
                    onClick={() => setSelectedIndustry(industry.value)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedIndustry === industry.value
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {industry.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Templates Grid */}
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Create from Scratch Option */}
                <button
                  onClick={handleCreateFromScratch}
                  className="group p-5 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center mb-4 transition-colors">
                    <FileEdit className="h-6 w-6 text-slate-500 group-hover:text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">Create from Scratch</h3>
                  <p className="text-sm text-slate-500">Start with a blank service and add your own questions</p>
                </button>

                {/* Template Cards */}
                {filteredTemplates.map((template) => {
                  const Icon = iconMap[template.icon] || Zap;
                  const categoryColors = {
                    major: 'from-red-500 to-orange-500',
                    standard: 'from-blue-500 to-cyan-500',
                    specialty: 'from-purple-500 to-pink-500',
                  };
                  return (
                    <button
                      key={template.id}
                      onClick={() => handleSelectTemplate(template)}
                      className="group p-5 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all text-left bg-white"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${categoryColors[template.category]} flex items-center justify-center mb-4`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-1">{template.name}</h3>
                      <p className="text-sm text-slate-500 mb-3 line-clamp-2">{template.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-900">
                          From ${(template.basePrice / 100).toLocaleString()}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {template.questions.length} questions
                        </Badge>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
              <p className="text-sm text-slate-500">
                <LayoutTemplate className="h-4 w-4 inline mr-1" />
                {filteredTemplates.length} templates available
              </p>
              <Button variant="ghost" onClick={() => setShowTemplateModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
