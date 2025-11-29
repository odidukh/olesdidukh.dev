import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { defaultLocale, locales, type Locale } from './config';

/**
 * Get the user's preferred locale from cookies or Accept-Language header.
 *
 * Priority:
 * 1. Explicit locale cookie (user preference)
 * 2. Accept-Language header (browser preference)
 * 3. Default locale (fallback)
 */
async function getPreferredLocale(): Promise<Locale> {
  // Check for explicit locale preference in cookie
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('locale')?.value;

  if (localeCookie && locales.includes(localeCookie as Locale)) {
    return localeCookie as Locale;
  }

  // Parse Accept-Language header for browser preference
  const headersList = await headers();
  const acceptLanguage = headersList.get('Accept-Language');

  if (acceptLanguage) {
    // Parse and sort by quality value
    const languages = acceptLanguage
      .split(',')
      .map(lang => {
        const [locale, quality] = lang.trim().split(';q=');
        return {
          locale: locale?.split('-')[0] ?? '',
          quality: quality ? parseFloat(quality) : 1,
        };
      })
      .sort((a, b) => b.quality - a.quality);

    // Find first matching locale
    for (const { locale } of languages) {
      if (locales.includes(locale as Locale)) {
        return locale as Locale;
      }
    }
  }

  return defaultLocale;
}

export default getRequestConfig(async () => {
  const locale = await getPreferredLocale();

  return {
    locale,
    messages: (await import(`../../../messages/${locale}.json`)).default,
  };
});
