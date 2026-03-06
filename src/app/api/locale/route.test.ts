import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';

// Mock the i18n module
vi.mock('@/i18n', () => ({
  locales: ['en', 'uk'],
}));

// Helper to create requests with required Origin header for CSRF validation
function createLocaleRequest(body: string | null) {
  return new Request('http://localhost/api/locale', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'http://localhost:3000',
    },
    ...(body !== null ? { body } : {}),
  });
}

describe('/api/locale', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST', () => {
    it('sets locale cookie for valid locale', async () => {
      const request = createLocaleRequest(JSON.stringify({ locale: 'en' }));

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
      const request = createLocaleRequest(JSON.stringify({ locale: 'uk' }));

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.locale).toBe('uk');
    });

    it('returns 400 for invalid locale', async () => {
      const request = createLocaleRequest(
        JSON.stringify({ locale: 'invalid' })
      );

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid locale');
    });

    it('returns 400 for empty locale', async () => {
      const request = createLocaleRequest(JSON.stringify({ locale: '' }));

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid locale');
    });

    it('returns 500 for invalid JSON', async () => {
      const request = createLocaleRequest('not valid json');

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to update locale');
    });

    it('returns 500 for missing body', async () => {
      const request = createLocaleRequest(null);

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to update locale');
    });
  });
});
