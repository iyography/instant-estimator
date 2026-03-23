import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy - ScopeForm',
  description: 'ScopeForm privacy policy. Learn how we collect, use, and protect your data.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          &larr; Back to ScopeForm
        </Link>

        <h1 className="mt-8 text-3xl font-bold text-slate-900">Privacy Policy</h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: March 23, 2026</p>

        <div className="mt-8 space-y-8 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-slate-900">1. Introduction</h2>
            <p className="mt-2">
              ScopeForm (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates the website scopeform.io (the &quot;Service&quot;).
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information
              when you use our Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">2. Information We Collect</h2>
            <h3 className="mt-3 font-semibold text-slate-800">Account Information</h3>
            <p className="mt-1">
              When you create an account, we collect your name, email address, and company information.
              If you sign in via Google, we receive your name and email from Google.
            </p>
            <h3 className="mt-3 font-semibold text-slate-800">Lead Data</h3>
            <p className="mt-1">
              When end-users submit estimates through your embedded forms, we collect the information they
              provide (name, email, phone, address, and form responses). This data is stored on your behalf
              as the data controller.
            </p>
            <h3 className="mt-3 font-semibold text-slate-800">Payment Information</h3>
            <p className="mt-1">
              Payment processing is handled by Stripe. We do not store credit card numbers on our servers.
              We retain your Stripe customer ID and subscription status.
            </p>
            <h3 className="mt-3 font-semibold text-slate-800">Usage Data</h3>
            <p className="mt-1">
              We use PostHog to collect anonymized analytics data including pages visited, features used,
              and session recordings (with sensitive inputs masked). You can opt out via the cookie consent banner.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">3. How We Use Your Information</h2>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>To provide and maintain the Service</li>
              <li>To process payments and manage subscriptions</li>
              <li>To send transactional emails (welcome, lead notifications, billing updates)</li>
              <li>To improve the Service based on usage patterns</li>
              <li>To provide AI-powered question suggestions for your forms</li>
              <li>To respond to support requests</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">4. Data Sharing</h2>
            <p className="mt-2">We share data only with the following service providers who process data on our behalf:</p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li><strong>Supabase</strong> &mdash; Authentication and database hosting</li>
              <li><strong>Stripe</strong> &mdash; Payment processing</li>
              <li><strong>Resend</strong> &mdash; Transactional email delivery</li>
              <li><strong>Anthropic</strong> &mdash; AI-powered suggestions (no personal data sent)</li>
              <li><strong>PostHog</strong> &mdash; Product analytics</li>
              <li><strong>Vercel</strong> &mdash; Application hosting</li>
            </ul>
            <p className="mt-2">We do not sell your personal data to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">5. Data Retention</h2>
            <p className="mt-2">
              We retain your account data for as long as your account is active. Lead data is retained
              until you delete it or close your account. You can export or delete your data at any time
              by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">6. Your Rights (GDPR)</h2>
            <p className="mt-2">If you are in the EU/EEA, you have the right to:</p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Access your personal data</li>
              <li>Rectify inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Restrict or object to processing</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="mt-2">To exercise these rights, contact us at info@scopeform.io.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">7. Cookies</h2>
            <p className="mt-2">
              We use essential cookies for authentication and session management. We also use analytics
              cookies (PostHog) with your consent. You can manage your cookie preferences via the
              consent banner displayed on your first visit.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">8. Security</h2>
            <p className="mt-2">
              We implement appropriate technical and organizational measures to protect your data,
              including HTTPS encryption, row-level security policies, input validation, and secure
              authentication practices.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">9. Changes to This Policy</h2>
            <p className="mt-2">
              We may update this policy from time to time. We will notify you of significant changes
              by email or through the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">10. Contact</h2>
            <p className="mt-2">
              For questions about this privacy policy, contact us at{' '}
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
