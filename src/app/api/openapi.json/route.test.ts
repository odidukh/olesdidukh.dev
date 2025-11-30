import { describe, it, expect } from 'vitest';
import { GET } from './route';
import { openApiSpec } from '@/lib/api/openapi';

describe('/api/openapi.json', () => {
  describe('GET', () => {
    it('returns OpenAPI specification', async () => {
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(openApiSpec);
    });

    it('returns correct content-type header', async () => {
      const response = await GET();
      const contentType = response.headers.get('content-type');

      expect(contentType).toBe('application/json');
    });

    it('returns cache-control header', async () => {
      const response = await GET();
      const cacheControl = response.headers.get('cache-control');

      expect(cacheControl).toBe('public, max-age=3600');
    });

    it('returns valid OpenAPI 3.0 structure', async () => {
      const response = await GET();
      const data = await response.json();

      expect(data.openapi).toBe('3.0.3');
      expect(data.info).toBeDefined();
      expect(data.info.title).toBe('Oles Didukh Portfolio API');
      expect(data.info.version).toBe('1.0.0');
      expect(data.paths).toBeDefined();
      expect(data.components).toBeDefined();
    });

    it('includes all expected API paths', async () => {
      const response = await GET();
      const data = await response.json();

      expect(data.paths['/api/contact']).toBeDefined();
      expect(data.paths['/api/newsletter']).toBeDefined();
      expect(data.paths['/api/og']).toBeDefined();
    });

    it('includes server definitions', async () => {
      const response = await GET();
      const data = await response.json();

      expect(data.servers).toHaveLength(2);
      expect(data.servers[0].url).toBe('https://olesdidukh.dev');
      expect(data.servers[1].url).toBe('http://localhost:3000');
    });
  });
});
