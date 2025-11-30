/**
 * UI Configuration constants
 *
 * Centralized configuration for UI-related settings.
 */

/** PWA install prompt cooldown period in milliseconds (7 days) */
export const PWA_DISMISS_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;

/** PWA install prompt cooldown period in days */
export const PWA_DISMISS_COOLDOWN_DAYS = 7;

/** Default font sizes available in the UI */
export const FONT_SIZES = ['small', 'normal', 'large'] as const;

/** Type for font size options */
export type FontSize = (typeof FONT_SIZES)[number];
