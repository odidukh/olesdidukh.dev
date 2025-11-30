import { describe, it, expect } from 'vitest';
import { generateNonce, buildCSP, CSP_NONCE_HEADER } from './csp';

describe('CSP utilities', () => {
  describe('generateNonce', () => {
    it('generates a base64-encoded string', () => {
      const nonce = generateNonce();
      // Base64 characters: A-Z, a-z, 0-9, +, /, =
      expect(nonce).toMatch(/^[A-Za-z0-9+/]+=*$/);
    });

    it('generates nonces of consistent length', () => {
      const nonce = generateNonce();
      // 16 bytes -> 24 chars in base64 (with padding)
      expect(nonce.length).toBe(24);
    });

    it('generates unique nonces', () => {
      const nonces = new Set<string>();
      for (let i = 0; i < 100; i++) {
        nonces.add(generateNonce());
      }
      // All 100 nonces should be unique
      expect(nonces.size).toBe(100);
    });
  });

  describe('buildCSP', () => {
    it('includes nonce in production script-src', () => {
      const nonce = 'test-nonce-123';
      const csp = buildCSP(nonce, false);

      expect(csp).toContain(`'nonce-${nonce}'`);
      expect(csp).toContain("'strict-dynamic'");
    });

    it('uses unsafe-inline and unsafe-eval in development', () => {
      const nonce = 'test-nonce-123';
      const csp = buildCSP(nonce, true);

      expect(csp).toContain("'unsafe-inline'");
      expect(csp).toContain("'unsafe-eval'");
      expect(csp).not.toContain(`'nonce-${nonce}'`);
    });

    it('includes default-src directive', () => {
      const csp = buildCSP('nonce', false);
      expect(csp).toContain("default-src 'self'");
    });

    it('includes style-src with unsafe-inline for Tailwind', () => {
      const csp = buildCSP('nonce', false);
      expect(csp).toContain("style-src 'self' 'unsafe-inline'");
    });

    it('includes img-src with allowed sources', () => {
      const csp = buildCSP('nonce', false);
      expect(csp).toContain('img-src');
      expect(csp).toContain('data:');
      expect(csp).toContain('blob:');
      expect(csp).toContain('https://via.placeholder.com');
    });

    it('includes connect-src with API endpoints', () => {
      const csp = buildCSP('nonce', false);
      expect(csp).toContain('connect-src');
      expect(csp).toContain('https://*.supabase.co');
      expect(csp).toContain('https://api.buttondown.email');
    });

    it('includes frame-ancestors none to prevent clickjacking', () => {
      const csp = buildCSP('nonce', false);
      expect(csp).toContain("frame-ancestors 'none'");
    });

    it('includes upgrade-insecure-requests in production', () => {
      const csp = buildCSP('nonce', false);
      expect(csp).toContain('upgrade-insecure-requests');
    });

    it('excludes upgrade-insecure-requests in development', () => {
      const csp = buildCSP('nonce', true);
      expect(csp).not.toContain('upgrade-insecure-requests');
    });

    it('includes object-src none', () => {
      const csp = buildCSP('nonce', false);
      expect(csp).toContain("object-src 'none'");
    });
  });

  describe('CSP_NONCE_HEADER', () => {
    it('has the correct header name', () => {
      expect(CSP_NONCE_HEADER).toBe('x-nonce');
    });
  });
});
