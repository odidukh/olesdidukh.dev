import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Use vi.hoisted to create mocks that are available before vi.mock factory runs
const { mockSend, mockEnv } = vi.hoisted(() => ({
  mockSend: vi.fn(),
  mockEnv: {
    RESEND_API_KEY: 'test-resend-key',
    CONTACT_EMAIL: 'test@example.com',
    BUTTONDOWN_API_KEY: 'test-api-key',
    NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
  },
}));

// Mock modules before any imports
vi.mock('resend', () => {
  return {
    Resend: class MockResend {
      emails = { send: mockSend };
    },
  };
});

vi.mock('@/lib/sentry', () => ({
  captureException: vi.fn(),
  addBreadcrumb: vi.fn(),
  setContext: vi.fn(),
}));

// Mock rate limiting (not configured in tests)
vi.mock('@/lib/ratelimit', () => ({
  contactRateLimiter: null,
  checkRateLimit: vi.fn().mockResolvedValue(null),
  rateLimitExceededResponse: vi.fn(),
  getIdentifier: vi.fn().mockReturnValue('test-ip'),
}));

// Mock CSRF (skip in tests)
vi.mock('@/lib/csrf', () => ({
  validateCsrf: vi.fn().mockReturnValue(null),
}));

// Mock env module - use hoisted mockEnv
vi.mock('@/lib/env', () => ({
  env: mockEnv,
}));

// Dynamic import to ensure mocks are in place
const { POST } = await import('./route');

describe('/api/contact', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSend.mockResolvedValue({ id: 'test-email-id' });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const createRequest = (body: unknown) =>
    new Request('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

  const validPayload = {
    name: 'John Doe',
    email: 'john@example.com',
    message: 'This is a test message that is long enough.',
  };

  describe('validation', () => {
    it('should return 400 if name is missing', async () => {
      const response = await POST(
        createRequest({
          email: 'john@example.com',
          message: 'Test message here',
        })
      );

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Validation failed');
    });

    it('should return 400 if name is too short', async () => {
      const response = await POST(
        createRequest({
          name: 'J',
          email: 'john@example.com',
          message: 'Test message here',
        })
      );

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Validation failed');
    });

    it('should return 400 if email is invalid', async () => {
      const response = await POST(
        createRequest({
          name: 'John Doe',
          email: 'invalid-email',
          message: 'Test message here',
        })
      );

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Validation failed');
    });

    it('should return 400 if message is missing', async () => {
      const response = await POST(
        createRequest({
          name: 'John Doe',
          email: 'john@example.com',
        })
      );

      expect(response.status).toBe(400);
    });

    it('should return 400 if message is too short', async () => {
      const response = await POST(
        createRequest({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Short',
        })
      );

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Validation failed');
    });
  });

  describe('successful submission', () => {
    it('should send email and return success', async () => {
      const response = await POST(createRequest(validPayload));

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(mockSend).toHaveBeenCalledTimes(1);
    });

    it('should include optional fields when provided', async () => {
      const payloadWithOptionals = {
        ...validPayload,
        phone: '+1234567890',
        company: 'Test Company',
        projectType: 'Web Application',
        budget: '$10,000 - $50,000',
        timeline: '1-3 months',
      };

      const response = await POST(createRequest(payloadWithOptionals));

      expect(response.status).toBe(200);
      expect(mockSend).toHaveBeenCalledTimes(1);

      // Verify email content includes optional fields
      const emailCall = mockSend.mock.calls[0]?.[0];
      expect(emailCall?.subject).toContain('Test Company');
      expect(emailCall?.text).toContain('+1234567890');
      expect(emailCall?.text).toContain('Test Company');
      expect(emailCall?.text).toContain('Web Application');
    });

    it('should set reply-to header to sender email', async () => {
      await POST(createRequest(validPayload));

      const emailCall = mockSend.mock.calls[0]?.[0];
      expect(emailCall?.replyTo).toBe('john@example.com');
    });
  });

  describe('error handling', () => {
    it('should return 500 if email sending fails', async () => {
      mockSend.mockRejectedValueOnce(new Error('Email service error'));

      const response = await POST(createRequest(validPayload));

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Failed to send message');
    });

    it('should handle malformed JSON', async () => {
      const request = new Request('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'not valid json',
      });

      const response = await POST(request);
      expect(response.status).toBe(500);
    });
  });
});
