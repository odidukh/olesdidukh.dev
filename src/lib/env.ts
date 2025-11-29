import { z } from 'zod';

/**
 * Server-side environment variables schema.
 * These are only available on the server and should never be exposed to the client.
 */
const serverSchema = z.object({
  // Email service (Resend)
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required'),
  CONTACT_EMAIL: z.string().email().optional(),

  // Newsletter service (Buttondown)
  BUTTONDOWN_API_KEY: z.string().min(1).optional(),

  // Rate limiting (Upstash Redis)
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),

  // Admin authentication
  ADMIN_EMAIL: z.string().email().optional(),

  // Error tracking (Sentry)
  SENTRY_DSN: z.string().url().optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),
});

/**
 * Client-side environment variables schema.
 * These are prefixed with NEXT_PUBLIC_ and are exposed to the browser.
 */
const clientSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required'),

  // Analytics
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
  NEXT_PUBLIC_CLARITY_PROJECT_ID: z.string().optional(),

  // Error tracking
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
});

/**
 * Combined schema for all environment variables.
 */
const envSchema = serverSchema.merge(clientSchema);

/**
 * Type for validated environment variables.
 */
export type Env = z.infer<typeof envSchema>;

/**
 * Validates environment variables and returns typed env object.
 * Throws an error with helpful messages if validation fails.
 */
function validateEnv(): Env {
  // In development, we parse and validate
  // In production, we skip validation if already validated at build time
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    const errorMessages = Object.entries(errors)
      .map(([key, messages]) => `  ${key}: ${messages?.join(', ')}`)
      .join('\n');

    // Only throw in development or during build
    // In production runtime, log warning but don't crash
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Invalid environment variables:\n' + errorMessages);
      throw new Error('Invalid environment variables. Check your .env file.');
    } else {
      console.warn(
        '⚠️ Some environment variables are missing or invalid:\n' +
          errorMessages
      );
    }
  }

  return parsed.data as Env;
}

/**
 * Validated environment variables.
 * Use this throughout the app instead of process.env directly.
 *
 * @example
 * ```ts
 * import { env } from '@/lib/env';
 *
 * const resend = new Resend(env.RESEND_API_KEY);
 * ```
 */
export const env = validateEnv();

/**
 * Type-safe getter for client environment variables.
 * Safe to use in both server and client components.
 */
export const clientEnv = {
  NEXT_PUBLIC_SUPABASE_URL: process.env['NEXT_PUBLIC_SUPABASE_URL'] ?? '',
  NEXT_PUBLIC_SUPABASE_ANON_KEY:
    process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] ?? '',
  NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env['NEXT_PUBLIC_GA_MEASUREMENT_ID'],
  NEXT_PUBLIC_CLARITY_PROJECT_ID: process.env['NEXT_PUBLIC_CLARITY_PROJECT_ID'],
  NEXT_PUBLIC_SENTRY_DSN: process.env['NEXT_PUBLIC_SENTRY_DSN'],
} as const;
