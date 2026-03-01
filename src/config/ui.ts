/**
 * UI Configuration constants
 *
 * Centralized configuration for UI-related settings.
 */

/** Default font sizes available in the UI */
export const FONT_SIZES = ['small', 'normal', 'large'] as const;

/** Type for font size options */
export type FontSize = (typeof FONT_SIZES)[number];
