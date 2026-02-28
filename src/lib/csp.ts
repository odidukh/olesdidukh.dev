/**
 * Content Security Policy (CSP) utilities
 *
 * Provides nonce generation and CSP header building for enhanced security.
 * Nonces are cryptographically random values that allow specific inline
 * scripts/styles while blocking all others.
 */

/**
 * Generates a cryptographically secure random nonce.
 * Uses Web Crypto API for secure random generation.
 *
 * @returns A base64-encoded random nonce string
 */
export function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Buffer.from(array).toString('base64');
}

/**
 * Header name for passing the nonce between middleware and pages
 */
export const CSP_NONCE_HEADER = 'x-nonce';

/**
 * Builds CSP directives with the provided nonce.
 *
 * @param nonce - The nonce to include in script-src and style-src directives
 * @param isDev - Whether the app is running in development mode
 * @returns The complete CSP header value
 */
export function buildCSP(nonce: string, isDev: boolean): string {
  const directives = [
    // Default fallback
    "default-src 'self'",

    // Scripts - use nonce in production, allow unsafe-eval in dev for HMR
    isDev
      ? `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://*.sentry.io`
      : `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://va.vercel-scripts.com https://*.sentry.io`,

    // Styles - still need unsafe-inline for Tailwind CSS (CSS-in-JS)
    // Note: style-src nonce doesn't work well with Tailwind's dynamic classes
    "style-src 'self' 'unsafe-inline'",

    // Images - allow self, data URIs, and placeholder services
    "img-src 'self' data: blob: https://via.placeholder.com https://img.youtube.com https://*.supabase.co https://avatars.githubusercontent.com https://lh3.googleusercontent.com https://images.unsplash.com",

    // Fonts - allow self and data URIs
    "font-src 'self' data:",

    // Connect - API endpoints
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.buttondown.email https://*.sentry.io https://va.vercel-scripts.com",

    // Frame ancestors - prevent clickjacking
    "frame-ancestors 'none'",

    // Form actions
    "form-action 'self'",

    // Base URI
    "base-uri 'self'",

    // Object sources
    "object-src 'none'",

    // Upgrade insecure requests in production
    ...(isDev ? [] : ['upgrade-insecure-requests']),
  ];

  return directives.join('; ');
}
