'use client';

import { EstimatorFlow } from './estimator-flow';
import { DEMO_MODE } from '@/lib/demo/data';
import type { Company, JobType, QuestionWithOptions, CreateLeadRequest } from '@/types/database';

interface EstimatorPageProps {
  company: Company;
  jobTypes: (JobType & { questions: QuestionWithOptions[] })[];
}

export function EstimatorPage({ company, jobTypes }: EstimatorPageProps) {
  const handleSubmit = async (data: CreateLeadRequest) => {
    // Demo mode - simulate success without actual API call
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        success: true,
        lead: {
          id: 'demo-lead-' + Date.now(),
          ...data,
          status: 'new',
          created_at: new Date().toISOString(),
        },
      };
    }

    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit');
    }

    return response.json();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="mx-auto max-w-lg">
        {/* Company Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">{company.name}</h1>
          <p className="mt-1 text-slate-600">Get an instant price estimate</p>
        </div>

        <EstimatorFlow
          company={company}
          jobTypes={jobTypes}
          onSubmit={handleSubmit}
          styling={{
            primaryColor: company.settings?.widget_primary_color || '#0f172a',
          }}
        />

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-400">
          <p>Powered by Instant Estimator</p>
        </div>
      </div>
    </div>
  );
}
