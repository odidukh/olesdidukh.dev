export const runtime = 'edge';

import { Resend } from 'resend';
import { z } from 'zod';
import { captureException, addBreadcrumb, setContext } from '@/lib/sentry';
import {
  checkRateLimit,
  rateLimitExceededResponse,
  getIdentifier,
} from '@/lib/ratelimit';
import { validateCsrf } from '@/lib/csrf';
import { env } from '@/lib/env';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Lazy initialization to avoid build-time errors when env vars are missing
let resendClient: Resend | null = null;
function getResendClient(): Resend {
  if (!resendClient) {
    if (!env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured');
    }
    resendClient = new Resend(env.RESEND_API_KEY);
  }
  return resendClient;
}

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  projectType: z.string().optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function POST(request: Request) {
  try {
    // CSRF protection
    const csrfError = validateCsrf(request);
    if (csrfError) {
      return csrfError;
    }

    // Check rate limit
    const identifier = getIdentifier(request);
    const rateLimitResult = await checkRateLimit('contact', identifier);

    if (rateLimitResult && !rateLimitResult.success) {
      addBreadcrumb({
        message: 'Contact form rate limit exceeded',
        category: 'ratelimit',
        level: 'warning',
        data: { remaining: rateLimitResult.remaining },
      });

      return rateLimitExceededResponse(
        rateLimitResult,
        'Too many contact requests. Please try again in a few minutes.'
      );
    }

    const body: unknown = await request.json();

    const result = contactSchema.safeParse(body);
    if (!result.success) {
      addBreadcrumb({
        message: 'Contact form validation failed',
        category: 'validation',
        level: 'warning',
        data: result.error.flatten(),
      });
      return Response.json(
        { error: 'Validation failed', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      phone,
      company,
      projectType,
      budget,
      timeline,
      message,
    } = result.data;

    // Add breadcrumb for debugging (no PII)
    addBreadcrumb({
      message: 'Processing contact form submission',
      category: 'contact',
      level: 'info',
      data: { hasCompany: !!company, projectType },
    });

    // Set context for this request (no PII)
    setContext('contact_submission', {
      projectType,
      hasPhone: !!phone,
      hasBudget: !!budget,
      hasTimeline: !!timeline,
    });

    // Build email content
    const emailText = `
New Contact Form Submission

From: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}
${company ? `Company: ${company}` : ''}

Project Details:
${projectType ? `Type: ${projectType}` : ''}
${budget ? `Budget: ${budget}` : ''}
${timeline ? `Timeline: ${timeline}` : ''}

Message:
${message}
    `.trim();

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #8B7355, #A08060); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
    .field { margin-bottom: 12px; }
    .label { font-weight: 600; color: #555; }
    .value { margin-top: 4px; }
    .message-box { background: white; padding: 16px; border-radius: 6px; border-left: 4px solid #8B7355; margin-top: 16px; }
    .section-title { font-size: 14px; text-transform: uppercase; color: #888; margin: 20px 0 10px; letter-spacing: 0.5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">New Contact Form Submission</h1>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">From</div>
        <div class="value">${escapeHtml(name)}</div>
      </div>
      <div class="field">
        <div class="label">Email</div>
        <div class="value"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></div>
      </div>
      ${phone ? `<div class="field"><div class="label">Phone</div><div class="value">${escapeHtml(phone)}</div></div>` : ''}
      ${company ? `<div class="field"><div class="label">Company</div><div class="value">${escapeHtml(company)}</div></div>` : ''}

      ${
        projectType || budget || timeline
          ? `
        <div class="section-title">Project Details</div>
        ${projectType ? `<div class="field"><div class="label">Type</div><div class="value">${escapeHtml(projectType)}</div></div>` : ''}
        ${budget ? `<div class="field"><div class="label">Budget</div><div class="value">${escapeHtml(budget)}</div></div>` : ''}
        ${timeline ? `<div class="field"><div class="label">Timeline</div><div class="value">${escapeHtml(timeline)}</div></div>` : ''}
      `
          : ''
      }

      <div class="section-title">Message</div>
      <div class="message-box">
        ${escapeHtml(message).replace(/\n/g, '<br>')}
      </div>
    </div>
  </div>
</body>
</html>
    `.trim();

    const contactEmail = env.CONTACT_EMAIL ?? 'oles.didukh@gmail.com';
    const resend = getResendClient();

    await resend.emails.send({
      from: 'Portfolio Contact <contact@olesdidukh.dev>',
      to: contactEmail,
      subject: `New contact from ${name}${company ? ` (${company})` : ''}`,
      text: emailText,
      html: emailHtml,
      replyTo: email,
    });

    addBreadcrumb({
      message: 'Email sent successfully',
      category: 'email',
      level: 'info',
    });

    // Don't expose rate limit headers on success responses
    // to avoid revealing throttling configuration to potential attackers
    return Response.json({ success: true });
  } catch (error) {
    // Capture the exception with context
    captureException(error, {
      api_route: '/api/contact',
      method: 'POST',
      user_agent: request.headers.get('user-agent'),
    });

    return Response.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
