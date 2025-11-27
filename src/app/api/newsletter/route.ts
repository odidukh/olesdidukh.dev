import { z } from 'zod';

const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    const result = newsletterSchema.safeParse(body);
    if (!result.success) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const { email } = result.data;

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
      return Response.json(
        { error: 'Failed to subscribe. Please try again.' },
        { status: 500 }
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return Response.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}
