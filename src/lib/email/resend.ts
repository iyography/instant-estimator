import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = 'ScopeForm <info@scopeform.io>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://scopeform.io';

export interface EmailResult {
  readonly success: boolean;
  readonly data?: unknown;
  readonly error?: string | unknown;
}

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ═══════════════════════════════════════════════════════════════════════════
// SHARED EMAIL LAYOUT
// ═══════════════════════════════════════════════════════════════════════════

function emailLayout(content: string, footerLinks?: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
  <style>
    @media only screen and (max-width: 620px) {
      .container { width: 100% !important; padding: 24px 16px !important; }
      .card { padding: 24px 20px !important; }
      .header-logo { padding: 24px 20px !important; }
      .cta-button { padding: 14px 24px !important; font-size: 15px !important; }
      .hero-title { font-size: 22px !important; }
      .hero-amount { font-size: 24px !important; }
      .step-number { width: 36px !important; height: 36px !important; font-size: 16px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f1f5f9; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
  <div class="container" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Logo Header -->
    <div class="header-logo" style="text-align: center; padding: 0 0 32px 0;">
      <a href="${APP_URL}" style="text-decoration: none; display: inline-flex; align-items: center; gap: 10px;">
        <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #3b82f6, #7c3aed); border-radius: 10px; display: inline-flex; align-items: center; justify-content: center;">
          <span style="color: white; font-size: 18px; line-height: 1;">&#10024;</span>
        </div>
        <span style="font-size: 20px; font-weight: 700; color: #0f172a; letter-spacing: -0.02em;">ScopeForm</span>
      </a>
    </div>

    ${content}

    <!-- Footer -->
    <div style="margin-top: 40px; text-align: center; color: #94a3b8; font-size: 13px; line-height: 1.6;">
      ${footerLinks || ''}
      <p style="margin: 16px 0 0 0;">
        <a href="${APP_URL}" style="color: #64748b; text-decoration: none;">ScopeForm</a>
        &nbsp;&middot;&nbsp;
        <a href="${APP_URL}/settings" style="color: #64748b; text-decoration: none;">Settings</a>
      </p>
      <p style="margin: 8px 0 0 0; color: #cbd5e1; font-size: 12px;">
        &copy; ${new Date().getFullYear()} ScopeForm. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>`;
}

function ctaButton(text: string, url: string, color?: string): string {
  const bg = color || 'linear-gradient(135deg, #3b82f6, #7c3aed)';
  return `<div style="text-align: center; margin: 32px 0 0 0;">
  <a href="${url}" class="cta-button" style="display: inline-block; background: ${bg}; color: white; padding: 14px 32px; border-radius: 8px; font-weight: 600; text-decoration: none; font-size: 16px; line-height: 1.4; mso-padding-alt: 0;">
    <!--[if mso]><i style="mso-font-width:150%;mso-text-raise:30px">&#xA0;</i><![endif]-->
    <span style="mso-text-raise:15px;">${text}</span>
    <!--[if mso]><i style="mso-font-width:150%">&#xA0;</i><![endif]-->
  </a>
</div>`;
}

function card(content: string): string {
  return `<div class="card" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04); overflow: hidden;">
  ${content}
</div>`;
}

function infoRow(label: string, value: string, isLink?: boolean): string {
  const safeLabel = escapeHtml(label);
  const safeValue = escapeHtml(value.replace('mailto:', '').replace('tel:', ''));
  const valueHtml = isLink
    ? `<a href="${value.startsWith('mailto:') || value.startsWith('tel:') ? value : `mailto:${value}`}" style="color: #3b82f6; font-size: 15px; font-weight: 500; text-decoration: none;">${safeValue}</a>`
    : `<span style="color: #0f172a; font-size: 15px; font-weight: 500;">${safeValue}</span>`;

  return `<tr>
  <td style="padding: 14px 0; border-bottom: 1px solid #f1f5f9;">
    <span style="color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">${safeLabel}</span><br>
    ${valueHtml}
  </td>
</tr>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// NEW LEAD NOTIFICATION
// ═══════════════════════════════════════════════════════════════════════════

export interface NewLeadEmailData {
  companyName: string;
  companyEmail: string;
  notificationEmail?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: string;
  jobTypeName: string;
  estimateLow: string;
  estimateHigh: string;
  leadValue: 'low' | 'medium' | 'high';
  dashboardUrl: string;
}

export async function sendNewLeadNotification(data: NewLeadEmailData): Promise<EmailResult> {
  if (!resend) {
    console.warn('Resend not configured - skipping email notification');
    return { success: false, error: 'Resend not configured' };
  }

  const toEmail = data.notificationEmail || data.companyEmail;
  const leadValueConfig = {
    low: { label: 'Low Value', color: '#64748b', bg: '#f1f5f9' },
    medium: { label: 'Medium Value', color: '#3b82f6', bg: '#eff6ff' },
    high: { label: 'High Value', color: '#16a34a', bg: '#f0fdf4' },
  }[data.leadValue];

  const customerRows = [
    infoRow('Name', data.customerName),
    infoRow('Email', data.customerEmail, true),
    data.customerPhone ? infoRow('Phone', data.customerPhone, true) : '',
    data.customerAddress ? infoRow('Address', data.customerAddress) : '',
    infoRow('Service', data.jobTypeName),
  ].join('');

  const content = card(`
    <!-- Banner -->
    <div style="background: linear-gradient(135deg, #3b82f6, #7c3aed); padding: 32px 24px; text-align: center;">
      <p style="margin: 0; font-size: 13px; color: rgba(255,255,255,0.8); text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;">New Lead Received</p>
      <p class="hero-amount" style="margin: 12px 0 0 0; font-size: 32px; font-weight: 800; color: white; letter-spacing: -0.02em;">
        ${escapeHtml(data.estimateLow)} &ndash; ${escapeHtml(data.estimateHigh)}
      </p>
      <div style="margin-top: 16px;">
        <span style="display: inline-block; background-color: ${leadValueConfig.bg}; color: ${leadValueConfig.color}; padding: 5px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">
          ${leadValueConfig.label}
        </span>
      </div>
    </div>

    <!-- Details -->
    <div class="card" style="padding: 28px 24px;">
      <h2 style="margin: 0 0 20px 0; font-size: 16px; color: #0f172a; font-weight: 700;">Customer Details</h2>
      <table style="width: 100%; border-collapse: collapse;">
        ${customerRows}
      </table>
      ${ctaButton('View Lead in Dashboard', `${data.dashboardUrl}/leads`)}
    </div>
  `);

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      subject: `New Lead: ${escapeHtml(data.customerName)} - ${escapeHtml(data.jobTypeName)}`,
      html: emailLayout(content, `
        <p style="margin: 0;">
          <a href="${data.dashboardUrl}/settings" style="color: #64748b; text-decoration: underline;">Manage notification settings</a>
        </p>
      `),
    });
    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to send lead notification email:', error);
    return { success: false, error };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// WELCOME EMAIL
// ═══════════════════════════════════════════════════════════════════════════

export interface WelcomeEmailData {
  companyName: string;
  email: string;
  dashboardUrl: string;
}

export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<EmailResult> {
  if (!resend) {
    console.warn('Resend not configured - skipping welcome email');
    return { success: false, error: 'Resend not configured' };
  }

  const steps = [
    { num: '1', title: 'Set up your services', desc: 'Add the job types you offer with base pricing.' },
    { num: '2', title: 'Customize your estimator', desc: 'Add questions that help calculate accurate estimates.' },
    { num: '3', title: 'Embed on your website', desc: 'Copy a single line of code into your site.' },
    { num: '4', title: 'Start receiving leads', desc: 'Qualified leads with estimates, right to your inbox.' },
  ];

  const stepsHtml = steps.map(s => `
    <tr>
      <td style="padding: 14px 0; vertical-align: top;">
        <table cellpadding="0" cellspacing="0" border="0"><tr>
          <td class="step-number" style="width: 40px; height: 40px; background: linear-gradient(135deg, #3b82f6, #7c3aed); border-radius: 10px; text-align: center; vertical-align: middle; color: white; font-size: 18px; font-weight: 700;">${s.num}</td>
          <td style="padding-left: 16px;">
            <p style="margin: 0; font-size: 15px; font-weight: 600; color: #0f172a;">${s.title}</p>
            <p style="margin: 4px 0 0 0; font-size: 14px; color: #64748b; line-height: 1.5;">${s.desc}</p>
          </td>
        </tr></table>
      </td>
    </tr>
  `).join('');

  const content = card(`
    <!-- Welcome Banner -->
    <div style="background: linear-gradient(135deg, #3b82f6, #7c3aed); padding: 40px 24px; text-align: center;">
      <div style="width: 64px; height: 64px; background: rgba(255,255,255,0.15); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 32px; line-height: 1;">&#128075;</span>
      </div>
      <h1 class="hero-title" style="margin: 0; font-size: 26px; font-weight: 800; color: white;">Welcome to ScopeForm!</h1>
      <p style="margin: 12px 0 0 0; font-size: 15px; color: rgba(255,255,255,0.85); line-height: 1.5;">
        You&rsquo;re all set to start capturing more leads<br>with instant price estimates.
      </p>
    </div>

    <!-- Steps -->
    <div style="padding: 32px 24px;">
      <p style="margin: 0 0 8px 0; font-size: 13px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;">Get started in 4 steps</p>
      <table style="width: 100%; border-collapse: collapse;">
        ${stepsHtml}
      </table>
      ${ctaButton('Go to Dashboard', `${data.dashboardUrl}/overview`)}
    </div>
  `);

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: `Welcome to ScopeForm, ${escapeHtml(data.companyName)}!`,
      html: emailLayout(content),
    });
    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return { success: false, error };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SUBSCRIPTION CONFIRMED
// ═══════════════════════════════════════════════════════════════════════════

export interface SubscriptionConfirmedEmailData {
  companyName: string;
  email: string;
  planName: string;
}

export async function sendSubscriptionConfirmedEmail(data: SubscriptionConfirmedEmailData): Promise<EmailResult> {
  if (!resend) {
    console.warn('Resend not configured - skipping subscription confirmed email');
    return { success: false, error: 'Resend not configured' };
  }

  const features = [
    'Unlimited estimator forms',
    'AI-powered question suggestions',
    'Lead management CRM',
    'Email notifications for new leads',
    'Embeddable widget for your website',
    'Priority support',
  ];

  const featuresHtml = features.map(f => `
    <tr>
      <td style="padding: 6px 0; font-size: 15px; color: #334155; line-height: 1.5;">
        <span style="color: #16a34a; margin-right: 8px;">&#10003;</span> ${f}
      </td>
    </tr>
  `).join('');

  const content = card(`
    <div style="background: linear-gradient(135deg, #16a34a, #15803d); padding: 40px 24px; text-align: center;">
      <div style="width: 64px; height: 64px; background: rgba(255,255,255,0.15); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 32px; line-height: 1;">&#127881;</span>
      </div>
      <h1 class="hero-title" style="margin: 0; font-size: 26px; font-weight: 800; color: white;">You&rsquo;re on the ${escapeHtml(data.planName)} Plan!</h1>
      <p style="margin: 12px 0 0 0; font-size: 15px; color: rgba(255,255,255,0.85);">
        Thank you for subscribing, ${escapeHtml(data.companyName)}.
      </p>
    </div>

    <div style="padding: 32px 24px;">
      <p style="margin: 0 0 16px 0; font-size: 13px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;">What&rsquo;s included</p>
      <table style="width: 100%; border-collapse: collapse;">
        ${featuresHtml}
      </table>
      ${ctaButton('Go to Dashboard', `${APP_URL}/overview`)}
      <p style="margin: 24px 0 0 0; text-align: center; font-size: 13px; color: #94a3b8;">
        Manage your subscription in <a href="${APP_URL}/settings" style="color: #3b82f6; text-decoration: none; font-weight: 500;">Settings</a>
      </p>
    </div>
  `);

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: `Subscription confirmed - ${escapeHtml(data.planName)} Plan`,
      html: emailLayout(content),
    });
    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to send subscription confirmed email:', error);
    return { success: false, error };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// PAYMENT FAILED
// ═══════════════════════════════════════════════════════════════════════════

export interface PaymentFailedEmailData {
  companyName: string;
  email: string;
}

export async function sendPaymentFailedEmail(data: PaymentFailedEmailData): Promise<EmailResult> {
  if (!resend) {
    console.warn('Resend not configured - skipping payment failed email');
    return { success: false, error: 'Resend not configured' };
  }

  const content = card(`
    <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); padding: 40px 24px; text-align: center;">
      <div style="width: 64px; height: 64px; background: rgba(255,255,255,0.15); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 32px; line-height: 1;">&#9888;&#65039;</span>
      </div>
      <h1 class="hero-title" style="margin: 0; font-size: 26px; font-weight: 800; color: white;">Payment Failed</h1>
      <p style="margin: 12px 0 0 0; font-size: 15px; color: rgba(255,255,255,0.85);">
        We couldn&rsquo;t process your latest payment.
      </p>
    </div>

    <div style="padding: 32px 24px;">
      <p style="margin: 0 0 16px 0; font-size: 15px; color: #334155; line-height: 1.6;">
        Hi ${escapeHtml(data.companyName)},
      </p>
      <p style="margin: 0 0 16px 0; font-size: 15px; color: #334155; line-height: 1.6;">
        Your most recent payment didn&rsquo;t go through. This could be due to an expired card, insufficient funds, or a temporary bank issue.
      </p>
      <p style="margin: 0 0 8px 0; font-size: 15px; color: #334155; line-height: 1.6;">
        To keep your ScopeForm account active, please update your payment method:
      </p>

      ${ctaButton('Update Payment Method', `${APP_URL}/settings`)}

      <div style="margin-top: 32px; padding: 16px; background: #fef2f2; border-radius: 8px; border-left: 4px solid #dc2626;">
        <p style="margin: 0; font-size: 14px; color: #991b1b; line-height: 1.5;">
          <strong>Important:</strong> If payment isn&rsquo;t resolved within 7 days, your account will be downgraded and you may lose access to premium features.
        </p>
      </div>
    </div>
  `);

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: 'Action required: Payment failed for your ScopeForm subscription',
      html: emailLayout(content),
    });
    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to send payment failed email:', error);
    return { success: false, error };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SUBSCRIPTION CANCELED
// ═══════════════════════════════════════════════════════════════════════════

export interface SubscriptionCanceledEmailData {
  companyName: string;
  email: string;
}

export async function sendSubscriptionCanceledEmail(data: SubscriptionCanceledEmailData): Promise<EmailResult> {
  if (!resend) {
    console.warn('Resend not configured - skipping subscription canceled email');
    return { success: false, error: 'Resend not configured' };
  }

  const content = card(`
    <div style="background: linear-gradient(135deg, #475569, #334155); padding: 40px 24px; text-align: center;">
      <h1 class="hero-title" style="margin: 0; font-size: 26px; font-weight: 800; color: white;">Subscription Canceled</h1>
      <p style="margin: 12px 0 0 0; font-size: 15px; color: rgba(255,255,255,0.8);">
        We&rsquo;re sorry to see you go, ${escapeHtml(data.companyName)}.
      </p>
    </div>

    <div style="padding: 32px 24px;">
      <p style="margin: 0 0 16px 0; font-size: 15px; color: #334155; line-height: 1.6;">
        Your ScopeForm subscription has been canceled. Your account will remain accessible, but premium features will be disabled.
      </p>

      <div style="margin: 24px 0; padding: 20px; background: #f8fafc; border-radius: 10px;">
        <p style="margin: 0 0 8px 0; font-size: 13px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;">What you&rsquo;ll lose</p>
        <ul style="margin: 0; padding-left: 20px; color: #64748b; font-size: 14px; line-height: 2;">
          <li>AI-powered question suggestions</li>
          <li>Email notifications for new leads</li>
          <li>Priority support</li>
        </ul>
      </div>

      <p style="margin: 0 0 8px 0; font-size: 15px; color: #334155; line-height: 1.6;">
        Changed your mind? You can resubscribe anytime from your settings.
      </p>

      ${ctaButton('Resubscribe', `${APP_URL}/settings`)}
    </div>
  `);

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: 'Your ScopeForm subscription has been canceled',
      html: emailLayout(content),
    });
    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to send subscription canceled email:', error);
    return { success: false, error };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SEND TEST EMAILS (for development/testing)
// ═══════════════════════════════════════════════════════════════════════════

export async function sendAllTestEmails(toEmail: string) {
  const results = {
    welcome: await sendWelcomeEmail({
      companyName: 'Anderson Electric',
      email: toEmail,
      dashboardUrl: APP_URL,
    }),
    newLead: await sendNewLeadNotification({
      companyName: 'Anderson Electric',
      companyEmail: toEmail,
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah.j@example.com',
      customerPhone: '+1 (555) 234-5678',
      customerAddress: '742 Evergreen Terrace, Springfield, IL',
      jobTypeName: 'EV Charger Installation',
      estimateLow: '$1,200',
      estimateHigh: '$2,400',
      leadValue: 'high',
      dashboardUrl: APP_URL,
    }),
    subscriptionConfirmed: await sendSubscriptionConfirmedEmail({
      companyName: 'Anderson Electric',
      email: toEmail,
      planName: 'Pro',
    }),
    paymentFailed: await sendPaymentFailedEmail({
      companyName: 'Anderson Electric',
      email: toEmail,
    }),
    subscriptionCanceled: await sendSubscriptionCanceledEmail({
      companyName: 'Anderson Electric',
      email: toEmail,
    }),
  };

  return results;
}
