import { z } from 'zod';
import { captureException, addBreadcrumb } from '@/lib/sentry';

const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: Request) {
  try {
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
    const apiKey = process.env['BUTTONDOWN_API_KEY'];

    if (!apiKey) {
      console.error('BUTTONDOWN_API_KEY is not configured');
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

      console.error('Buttondown API error:', errorData);

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

    return Response.json({ success: true });
  } catch (error) {
    console.error('Newsletter subscription error:', error);

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
