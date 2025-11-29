import { openApiSpec } from '@/lib/api/openapi';

export async function GET() {
  return Response.json(openApiSpec, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
