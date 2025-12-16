import { Resend } from 'resend';

// Initialize Resend client
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

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

export async function sendNewLeadNotification(data: NewLeadEmailData) {
  if (!resend) {
    console.warn('Resend not configured - skipping email notification');
    return { success: false, error: 'Resend not configured' };
  }

  const toEmail = data.notificationEmail || data.companyEmail;
  const leadValueLabel = {
    low: 'Low Value',
    medium: 'Medium Value',
    high: 'High Value',
  }[data.leadValue];

  const leadValueColor = {
    low: '#64748b',
    medium: '#3b82f6',
    high: '#22c55e',
  }[data.leadValue];

  try {
    const result = await resend.emails.send({
      from: 'Instant Estimator <notifications@instantestimator.com>',
      to: toEmail,
      subject: `New Lead: ${data.customerName} - ${data.jobTypeName}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Lead Notification</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="margin: 0; font-size: 24px; color: #0f172a;">
        New Lead Received
      </h1>
      <p style="margin: 8px 0 0 0; color: #64748b;">
        ${data.companyName}
      </p>
    </div>

    <!-- Main Card -->
    <div style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden;">
      <!-- Lead Value Banner -->
      <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 20px; text-align: center;">
        <span style="display: inline-block; background-color: ${leadValueColor}; color: white; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase;">
          ${leadValueLabel}
        </span>
        <div style="margin-top: 16px; color: white;">
          <p style="margin: 0; font-size: 14px; opacity: 0.9;">Estimated Value</p>
          <p style="margin: 8px 0 0 0; font-size: 28px; font-weight: 700;">
            ${data.estimateLow} - ${data.estimateHigh}
          </p>
        </div>
      </div>

      <!-- Customer Details -->
      <div style="padding: 24px;">
        <h2 style="margin: 0 0 16px 0; font-size: 18px; color: #0f172a;">
          Customer Information
        </h2>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
              <span style="color: #64748b; font-size: 14px;">Name</span><br>
              <span style="color: #0f172a; font-size: 16px; font-weight: 500;">${data.customerName}</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
              <span style="color: #64748b; font-size: 14px;">Email</span><br>
              <a href="mailto:${data.customerEmail}" style="color: #3b82f6; font-size: 16px; font-weight: 500; text-decoration: none;">${data.customerEmail}</a>
            </td>
          </tr>
          ${data.customerPhone ? `
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
              <span style="color: #64748b; font-size: 14px;">Phone</span><br>
              <a href="tel:${data.customerPhone}" style="color: #3b82f6; font-size: 16px; font-weight: 500; text-decoration: none;">${data.customerPhone}</a>
            </td>
          </tr>
          ` : ''}
          ${data.customerAddress ? `
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
              <span style="color: #64748b; font-size: 14px;">Address</span><br>
              <span style="color: #0f172a; font-size: 16px;">${data.customerAddress}</span>
            </td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 12px 0;">
              <span style="color: #64748b; font-size: 14px;">Service Requested</span><br>
              <span style="color: #0f172a; font-size: 16px; font-weight: 500;">${data.jobTypeName}</span>
            </td>
          </tr>
        </table>

        <!-- CTA Button -->
        <div style="margin-top: 24px; text-align: center;">
          <a href="${data.dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 14px 32px; border-radius: 8px; font-weight: 600; text-decoration: none; font-size: 16px;">
            View in Dashboard
          </a>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div style="margin-top: 32px; text-align: center; color: #94a3b8; font-size: 14px;">
      <p style="margin: 0;">
        This notification was sent by Instant Estimator
      </p>
      <p style="margin: 8px 0 0 0;">
        <a href="${data.dashboardUrl}/settings" style="color: #64748b; text-decoration: underline;">
          Manage notification settings
        </a>
      </p>
    </div>
  </div>
</body>
</html>
      `,
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

export interface WelcomeEmailData {
  companyName: string;
  email: string;
  dashboardUrl: string;
}

export async function sendWelcomeEmail(data: WelcomeEmailData) {
  if (!resend) {
    console.warn('Resend not configured - skipping welcome email');
    return { success: false, error: 'Resend not configured' };
  }

  try {
    const result = await resend.emails.send({
      from: 'Instant Estimator <welcome@instantestimator.com>',
      to: data.email,
      subject: `Welcome to Instant Estimator, ${data.companyName}!`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="margin: 0; font-size: 28px; color: #0f172a;">
        Welcome to Instant Estimator!
      </h1>
    </div>

    <div style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 32px;">
      <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
        Hi ${data.companyName},
      </p>
      <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
        Thank you for signing up for Instant Estimator! You're now ready to start capturing more leads with instant price estimates on your website.
      </p>

      <h3 style="color: #0f172a; font-size: 18px; margin: 0 0 16px 0;">Here's what you can do next:</h3>

      <ol style="color: #334155; font-size: 16px; line-height: 1.8; margin: 0 0 24px 0; padding-left: 20px;">
        <li>Complete your estimator setup</li>
        <li>Add questions for your job types</li>
        <li>Embed the widget on your website</li>
        <li>Start receiving leads!</li>
      </ol>

      <div style="text-align: center; margin-top: 32px;">
        <a href="${data.dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 14px 32px; border-radius: 8px; font-weight: 600; text-decoration: none; font-size: 16px;">
          Go to Dashboard
        </a>
      </div>
    </div>

    <div style="margin-top: 32px; text-align: center; color: #94a3b8; font-size: 14px;">
      <p style="margin: 0;">Need help? Reply to this email or visit our documentation.</p>
    </div>
  </div>
</body>
</html>
      `,
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return { success: false, error };
  }
}
