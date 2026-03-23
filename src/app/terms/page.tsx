import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service - ScopeForm',
  description: 'ScopeForm terms of service. Read our terms and conditions for using the platform.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          &larr; Back to ScopeForm
        </Link>

        <h1 className="mt-8 text-3xl font-bold text-slate-900">Terms of Service</h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: March 23, 2026</p>

        <div className="mt-8 space-y-8 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-slate-900">1. Acceptance of Terms</h2>
            <p className="mt-2">
              By accessing or using ScopeForm (&quot;the Service&quot;), operated at scopeform.io,
              you agree to be bound by these Terms of Service. If you do not agree to these terms,
              do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">2. Description of Service</h2>
            <p className="mt-2">
              ScopeForm provides a platform that allows contractors and service businesses to create
              embeddable price estimator forms for their websites. The Service includes form building,
              lead capture, AI-powered suggestions, and billing management.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">3. Account Registration</h2>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>You must provide accurate and complete information when creating an account.</li>
              <li>You are responsible for maintaining the security of your account credentials.</li>
              <li>You must notify us immediately of any unauthorized use of your account.</li>
              <li>You must be at least 18 years old to use the Service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">4. Subscription and Payments</h2>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Paid plans are billed monthly or yearly through Stripe.</li>
              <li>You can cancel your subscription at any time through the billing settings.</li>
              <li>Cancellations take effect at the end of the current billing period.</li>
              <li>Refunds are handled on a case-by-case basis. Contact us at info@scopeform.io.</li>
              <li>We reserve the right to change pricing with 30 days notice.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">5. Acceptable Use</h2>
            <p className="mt-2">You agree not to:</p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Use the Service for any unlawful purpose</li>
              <li>Submit misleading or fraudulent pricing information</li>
              <li>Attempt to gain unauthorized access to other users&apos; data</li>
              <li>Interfere with or disrupt the Service or its infrastructure</li>
              <li>Use automated tools to scrape or abuse the Service</li>
              <li>Resell or redistribute the Service without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">6. Data Ownership</h2>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>You retain ownership of all content and data you upload to the Service.</li>
              <li>Lead data collected through your forms belongs to you.</li>
              <li>We may use aggregated, anonymized data to improve the Service.</li>
              <li>You are responsible for compliance with applicable data protection laws (e.g., GDPR)
                regarding the lead data you collect.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">7. Intellectual Property</h2>
            <p className="mt-2">
              The Service, including its design, code, and branding, is owned by ScopeForm.
              You are granted a limited, non-exclusive license to use the Service for its intended purpose.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">8. Limitation of Liability</h2>
            <p className="mt-2">
              To the maximum extent permitted by law, ScopeForm shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages, including loss of profits, data,
              or business opportunities, arising from your use of the Service.
            </p>
            <p className="mt-2">
              The Service is provided &quot;as is&quot; without warranties of any kind. We do not guarantee
              uninterrupted or error-free operation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">9. Termination</h2>
            <p className="mt-2">
              We may suspend or terminate your account if you violate these terms. Upon termination,
              your right to use the Service ceases. You may request export of your data within 30 days
              of account closure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">10. Changes to Terms</h2>
            <p className="mt-2">
              We may modify these terms at any time. Material changes will be communicated via email
              or through the Service at least 14 days before taking effect. Continued use after changes
              constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">11. Governing Law</h2>
            <p className="mt-2">
              These terms are governed by the laws of Sweden. Any disputes shall be resolved in the
              courts of Sweden.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">12. Contact</h2>
            <p className="mt-2">
              For questions about these terms, contact us at{' '}
              <a href="mailto:info@scopeform.io" className="text-blue-600 hover:underline">
                info@scopeform.io
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
