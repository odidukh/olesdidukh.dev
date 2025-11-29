import { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { ApiDocumentation } from './components/ApiDocumentation';
import { Code, FileJson, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'API Documentation | Oles Didukh',
  description:
    'API documentation for olesdidukh.dev portfolio website. Learn how to use the contact, newsletter, and OG image endpoints.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ApiDocsPage() {
  return (
    <main className="min-h-screen py-20">
      <Container size="wide" padding="lg">
        <div className="space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <Badge variant="outline" className="mb-4">
              <Code className="mr-2 h-3 w-3" />
              Developer Documentation
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold">
              API{' '}
              <span className="bg-gradient-to-r from-mocha-500 to-accent-green bg-clip-text text-transparent">
                Documentation
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Documentation for the public API endpoints available on this
              portfolio website. Use these endpoints to integrate with the
              contact form, newsletter, and dynamic OG image generation.
            </p>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border bg-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-mocha-100 dark:bg-mocha-900/30">
                  <Zap className="h-5 w-5 text-mocha-600 dark:text-mocha-400" />
                </div>
                <h3 className="font-semibold">Rate Limited</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                All POST endpoints are rate limited to prevent abuse. Check
                response headers for limit info.
              </p>
            </div>

            <div className="p-6 rounded-xl border bg-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-navy-100 dark:bg-navy-900/30">
                  <FileJson className="h-5 w-5 text-navy-600 dark:text-navy-400" />
                </div>
                <h3 className="font-semibold">JSON Responses</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                All endpoints return JSON responses with consistent error
                handling and validation messages.
              </p>
            </div>

            <div className="p-6 rounded-xl border bg-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-success-100 dark:bg-success-900/30">
                  <Code className="h-5 w-5 text-success-600 dark:text-success-400" />
                </div>
                <h3 className="font-semibold">CSRF Protected</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                POST endpoints validate Origin/Referer headers for security.
                Same-origin requests are required.
              </p>
            </div>
          </div>

          {/* API Documentation */}
          <ApiDocumentation />
        </div>
      </Container>
    </main>
  );
}
