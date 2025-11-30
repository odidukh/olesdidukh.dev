import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';

// Mock the i18n module
vi.mock('@/i18n', () => ({
  locales: ['en', 'uk'],
}));

describe('/api/locale', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST', () => {
    it('sets locale cookie for valid locale', async () => {
      const request = new Request('http://localhost/api/locale', {
        method: 'POST',
        body: JSON.stringify({ locale: 'en' }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.locale).toBe('en');

      // Check cookie was set
      const setCookie = response.headers.get('set-cookie');
      expect(setCookie).toContain('locale=en');
      expect(setCookie).toContain('Path=/');
    });

    it('sets locale cookie for uk locale', async () => {
      const request = new Request('http://localhost/api/locale', {
        method: 'POST',
        body: JSON.stringify({ locale: 'uk' }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.locale).toBe('uk');
    });

    it('returns 400 for invalid locale', async () => {
      const request = new Request('http://localhost/api/locale', {
        method: 'POST',
        body: JSON.stringify({ locale: 'invalid' }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid locale');
    });

    it('returns 400 for empty locale', async () => {
      const request = new Request('http://localhost/api/locale', {
        method: 'POST',
        body: JSON.stringify({ locale: '' }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid locale');
    });

    it('returns 500 for invalid JSON', async () => {
      const request = new Request('http://localhost/api/locale', {
        method: 'POST',
        body: 'not valid json',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to update locale');
    });

    it('returns 500 for missing body', async () => {
      const request = new Request('http://localhost/api/locale', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to update locale');
    });
  });
});
