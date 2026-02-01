/**
 * Contact information obfuscation utilities to prevent scraping.
 *
 * Uses a combination of Base64 encoding and string reversal
 * to make contact details unreadable in HTML source.
 * The data is only decoded client-side via JavaScript.
 */

/**
 * Encode a string to prevent scraping.
 * Reverses the string then Base64 encodes it.
 */
export function encodeString(value: string): string {
  if (typeof window !== 'undefined') {
    return btoa(value.split('').reverse().join(''));
  }
  // Server-side fallback using Buffer
  return Buffer.from(value.split('').reverse().join('')).toString('base64');
}

/**
 * Decode an obfuscated string.
 * Works both client-side (atob) and server-side (Buffer).
 */
export function decodeString(encoded: string): string {
  if (typeof window !== 'undefined') {
    return atob(encoded).split('').reverse().join('');
  }
  // Server-side fallback using Buffer
  return Buffer.from(encoded, 'base64').toString().split('').reverse().join('');
}

// Aliases for backward compatibility
export const encodeEmail = encodeString;
export const decodeEmail = decodeString;

/**
 * Pre-encoded email for SSR safety.
 * This is oles.didukh@gmail.com encoded.
 */
export const ENCODED_EMAIL = 'bW9jLmxpYW1nQGhrdWRpZC5zZWxv';

/**
 * Pre-encoded phone number for SSR safety.
 * This is +380678899570 encoded.
 */
export const ENCODED_PHONE = 'MDc1OTk4ODc2MDgzKw==';

/**
 * Formatted phone display: +38 067 88 99 570
 * Encoded for display purposes.
 */
export const ENCODED_PHONE_DISPLAY = 'MDc1IDk5IDg4IDc2MCA4Mys=';
