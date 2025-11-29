/**
 * Internationalization configuration
 *
 * Defines supported locales and default language settings.
 */

export const locales = ['en', 'uk'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  uk: 'Українська',
};

export const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  uk: '🇺🇦',
};
