import { NextResponse } from 'next/server';
import { locales, type Locale } from '@/i18n';
import { validateCsrf } from '@/lib/csrf';

export async function POST(request: Request) {
  try {
    // CSRF protection
    const csrfError = validateCsrf(request);
    if (csrfError) {
      return csrfError;
    }

    const { locale } = (await request.json()) as { locale: string };

    // Validate locale
    if (!locales.includes(locale as Locale)) {
      return NextResponse.json({ error: 'Invalid locale' }, { status: 400 });
    }

    // Create response with locale cookie
    const response = NextResponse.json({ success: true, locale });

    // Set cookie for 1 year
    response.cookies.set('locale', locale, {
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: 'Failed to update locale' },
      { status: 500 }
    );
  }
}
