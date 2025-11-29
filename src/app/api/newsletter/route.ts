import { z } from 'zod';
import { captureException, addBreadcrumb } from '@/lib/sentry';
import {
  newsletterRateLimiter,
  checkRateLimit,
  rateLimitExceededResponse,
  getIdentifier,
} from '@/lib/ratelimit';
import { validateCsrf } from '@/lib/csrf';
import { env } from '@/lib/env';

const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
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
    const rateLimitResult = await checkRateLimit(
      newsletterRateLimiter,
      identifier
    );

    if (rateLimitResult && !rateLimitResult.success) {
      addBreadcrumb({
        message: 'Newsletter rate limit exceeded',
        category: 'ratelimit',
        level: 'warning',
        data: { identifier, remaining: rateLimitResult.remaining },
      });

      return rateLimitExceededResponse(
        rateLimitResult,
        'Too many subscription attempts. Please try again later.'
      );
    }

    const body: unknown = await request.json();

    const result = newsletterSchema.safeParse(body);
    if (!result.success) {
      addBreadcrumb({
        message: 'Newsletter validation failed',
        category: 'validation',
        level: 'warning',
      });
      return Response.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const { email } = result.data;

    addBreadcrumb({
      message: 'Processing newsletter subscription',
      category: 'newsletter',
      level: 'info',
      data: { email },
    });

    // Buttondown API integration
    const apiKey = env.BUTTONDOWN_API_KEY;

    if (!apiKey) {
      captureException(new Error('BUTTONDOWN_API_KEY is not configured'), {
        api_route: '/api/newsletter',
        config_error: true,
      });
      return Response.json(
        { error: 'Newsletter service is not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(
      'https://api.buttondown.email/v1/subscribers',
      {
        method: 'POST',
        headers: {
          Authorization: `Token ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          tags: ['website-signup'],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Handle already subscribed case
      if (
        response.status === 400 &&
        (errorData as { code?: string }).code === 'email_already_exists'
      ) {
        return Response.json(
          { error: 'This email is already subscribed' },
          { status: 400 }
        );
      }

      captureException(new Error('Buttondown API error'), {
        api_route: '/api/newsletter',
        status_code: response.status,
        error_data: errorData,
        email,
      });

      return Response.json(
        { error: 'Failed to subscribe. Please try again.' },
        { status: 500 }
      );
    }

    addBreadcrumb({
      message: 'Newsletter subscription successful',
      category: 'newsletter',
      level: 'info',
      data: { email },
    });

    // Don't expose rate limit headers on success responses
    // to avoid revealing throttling configuration to potential attackers
    return Response.json({ success: true });
  } catch (error) {
    captureException(error, {
      api_route: '/api/newsletter',
      method: 'POST',
    });

    return Response.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}
