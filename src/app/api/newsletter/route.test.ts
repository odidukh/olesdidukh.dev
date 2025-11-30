import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock Sentry
vi.mock('@/lib/sentry', () => ({
  captureException: vi.fn(),
  addBreadcrumb: vi.fn(),
}));

// Mock rate limiting (not configured in tests)
vi.mock('@/lib/ratelimit', () => ({
  newsletterRateLimiter: null,
  checkRateLimit: vi.fn().mockResolvedValue(null),
  rateLimitExceededResponse: vi.fn(),
  getIdentifier: vi.fn().mockReturnValue('test-ip'),
}));

// Mock CSRF (skip in tests)
vi.mock('@/lib/csrf', () => ({
  validateCsrf: vi.fn().mockReturnValue(null),
}));

// Mock env module with mutable object
vi.mock('@/lib/env', () => ({
  env: {
    BUTTONDOWN_API_KEY: 'test-api-key',
    RESEND_API_KEY: 'test-resend-key',
    NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
  },
}));

import { POST } from './route';
import { env } from '@/lib/env';

describe('/api/newsletter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset env mock to default
    (env as { BUTTONDOWN_API_KEY: string }).BUTTONDOWN_API_KEY = 'test-api-key';
    // Reset fetch mock
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const createRequest = (body: unknown) =>
    new Request('http://localhost:3000/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

  describe('validation', () => {
    it('should return 400 if email is missing', async () => {
      const response = await POST(createRequest({}));

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Invalid email address');
    });

    it('should return 400 if email is invalid', async () => {
      const response = await POST(createRequest({ email: 'not-an-email' }));

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Invalid email address');
    });

    it('should return 400 if email is empty string', async () => {
      const response = await POST(createRequest({ email: '' }));

      expect(response.status).toBe(400);
    });
  });

  describe('API key configuration', () => {
    it('should return 500 if BUTTONDOWN_API_KEY is not configured', async () => {
      // Clear the API key in mock
      (env as { BUTTONDOWN_API_KEY: string }).BUTTONDOWN_API_KEY = '';

      const response = await POST(createRequest({ email: 'test@example.com' }));

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Newsletter service is not configured');
    });
  });

  describe('successful subscription', () => {
    it('should subscribe user and return success', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ id: 'subscriber-id' }),
      });
      vi.stubGlobal('fetch', mockFetch);

      const response = await POST(createRequest({ email: 'test@example.com' }));

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);

      // Verify API call
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.buttondown.email/v1/subscribers',
        expect.objectContaining({
          method: 'POST',
          headers: {
            Authorization: 'Token test-api-key',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email_address: 'test@example.com',
            tags: ['website-signup'],
          }),
        })
      );
    });
  });

  describe('error handling', () => {
    it('should return 400 if email is already subscribed', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ code: 'email_already_exists' }),
      });
      vi.stubGlobal('fetch', mockFetch);

      const response = await POST(
        createRequest({ email: 'existing@example.com' })
      );

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('This email is already subscribed');
    });

    it('should return 500 on Buttondown API error', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: 'Server error' }),
      });
      vi.stubGlobal('fetch', mockFetch);

      const response = await POST(createRequest({ email: 'test@example.com' }));

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Failed to subscribe. Please try again.');
    });

    it('should handle network errors', async () => {
      const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
      vi.stubGlobal('fetch', mockFetch);

      const response = await POST(createRequest({ email: 'test@example.com' }));

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Failed to subscribe. Please try again.');
    });

    it('should handle malformed JSON response from Buttondown', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.reject(new Error('Invalid JSON')),
      });
      vi.stubGlobal('fetch', mockFetch);

      const response = await POST(createRequest({ email: 'test@example.com' }));

      // Should not throw, should handle gracefully
      expect(response.status).toBe(500);
    });

    it('should handle malformed JSON in request body', async () => {
      const request = new Request('http://localhost:3000/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'not valid json',
      });

      const response = await POST(request);
      expect(response.status).toBe(500);
    });
  });
});
