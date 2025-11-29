import { NextResponse } from 'next/server';
import { locales, type Locale } from '@/i18n';

export async function POST(request: Request) {
  try {
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
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: 'Failed to update locale' },
      { status: 500 }
    );
  }
}
