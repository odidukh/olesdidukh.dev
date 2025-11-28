/**
 * API-related types
 */

/**
 * Contact form data
 */
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  message: string;
}

/**
 * Contact form response
 */
export interface ContactFormResponse {
  success: boolean;
  error?: string;
}

/**
 * Newsletter subscription data
 */
export interface NewsletterSubscribeData {
  email: string;
}

/**
 * Newsletter subscription response
 */
export interface NewsletterSubscribeResponse {
  success: boolean;
  error?: string;
}

/**
 * Rate limit info returned in headers
 */
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Rate limit exceeded response
 */
export interface RateLimitExceededResponse {
  error: string;
  retryAfter: number;
}

/**
 * API error response
 */
export interface ApiErrorResponse {
  error: string;
  details?: Record<string, string[]>;
  code?: string;
}

/**
 * HTTP methods
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Fetch options with typed body
 */
export interface TypedFetchOptions<T = unknown>
  extends Omit<RequestInit, 'body'> {
  body?: T;
}
