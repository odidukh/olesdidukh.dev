'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Send, Mail, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { ApiEndpoint } from './ApiEndpoint';

interface EndpointConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  rateLimit?: string;
  requestBody?: {
    required: string[];
    optional: string[];
    example: Record<string, unknown>;
  };
  queryParams?: {
    name: string;
    type: string;
    description: string;
    default?: string;
    enum?: string[];
  }[];
  responses: {
    status: number;
    description: string;
    example?: Record<string, unknown>;
  }[];
  curlExample: string;
}

const endpoints: EndpointConfig[] = [
  {
    method: 'POST',
    path: '/api/contact',
    title: 'Submit Contact Form',
    description:
      'Submit a contact form message. The message will be sent via email to the site owner using Resend.',
    icon: <Send className="h-4 w-4" />,
    rateLimit: '5 requests per 15 minutes',
    requestBody: {
      required: ['name', 'email', 'message'],
      optional: ['phone', 'company', 'projectType', 'budget', 'timeline'],
      example: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 (555) 123-4567',
        company: 'Tech Corp',
        projectType: 'Web Application',
        budget: '$10,000 - $25,000',
        timeline: '2-3 months',
        message:
          'Hi, I would like to discuss a potential project with you. We are looking for a senior front-end engineer.',
      },
    },
    responses: [
      {
        status: 200,
        description: 'Message sent successfully',
        example: { success: true },
      },
      {
        status: 400,
        description: 'Validation error',
        example: {
          error: 'Validation failed',
          details: {
            fieldErrors: {
              email: ['Invalid email address'],
            },
          },
        },
      },
      {
        status: 429,
        description: 'Rate limit exceeded',
        example: {
          error:
            'Too many contact requests. Please try again in a few minutes.',
          retryAfter: 60,
        },
      },
    ],
    curlExample: `curl -X POST https://olesdidukh.dev/api/contact \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello, I would like to discuss a project."
  }'`,
  },
  {
    method: 'POST',
    path: '/api/newsletter',
    title: 'Subscribe to Newsletter',
    description:
      'Subscribe an email address to the newsletter. Uses Buttondown for email list management.',
    icon: <Mail className="h-4 w-4" />,
    rateLimit: '3 requests per hour',
    requestBody: {
      required: ['email'],
      optional: [],
      example: {
        email: 'subscriber@example.com',
      },
    },
    responses: [
      {
        status: 200,
        description: 'Successfully subscribed',
        example: { success: true },
      },
      {
        status: 400,
        description: 'Invalid email or already subscribed',
        example: { error: 'This email is already subscribed' },
      },
      {
        status: 429,
        description: 'Rate limit exceeded',
        example: {
          error: 'Too many subscription attempts. Please try again later.',
          retryAfter: 3600,
        },
      },
    ],
    curlExample: `curl -X POST https://olesdidukh.dev/api/newsletter \\
  -H "Content-Type: application/json" \\
  -d '{"email": "subscriber@example.com"}'`,
  },
  {
    method: 'GET',
    path: '/api/og',
    title: 'Generate OG Image',
    description:
      'Generate a dynamic Open Graph image for social media sharing. Images are 1200x630 pixels and cached by CDN.',
    icon: <ImageIcon className="h-4 w-4" />,
    queryParams: [
      {
        name: 'title',
        type: 'string',
        description: 'Main title text',
        default: 'Oles Didukh',
      },
      {
        name: 'subtitle',
        type: 'string',
        description: 'Subtitle or tagline',
        default: 'Senior Front-End Engineer',
      },
      {
        name: 'description',
        type: 'string',
        description: 'Additional description text',
      },
      {
        name: 'type',
        type: 'string',
        description: 'Content type (affects styling)',
        default: 'default',
        enum: ['default', 'blog', 'project'],
      },
    ],
    responses: [
      {
        status: 200,
        description: 'PNG image (1200x630)',
      },
    ],
    curlExample: `curl "https://olesdidukh.dev/api/og?title=My%20Blog%20Post&type=blog"`,
  },
];

export function ApiDocumentation() {
  const [expandedEndpoints, setExpandedEndpoints] = React.useState<Set<string>>(
    new Set(['/api/contact'])
  );

  const toggleEndpoint = (path: string) => {
    setExpandedEndpoints(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Endpoints</h2>
        <Badge variant="secondary">{endpoints.length} endpoints</Badge>
      </div>

      <div className="space-y-4">
        {endpoints.map(endpoint => (
          <ApiEndpoint
            key={endpoint.path}
            endpoint={endpoint}
            isExpanded={expandedEndpoints.has(endpoint.path)}
            onToggle={() => toggleEndpoint(endpoint.path)}
          />
        ))}
      </div>

      {/* Rate Limit Headers Info */}
      <div className="mt-12 p-6 rounded-xl border bg-muted/30">
        <h3 className="text-lg font-semibold mb-4">Rate Limit Headers</h3>
        <p className="text-sm text-muted-foreground mb-4">
          All rate-limited endpoints include the following headers in their
          responses:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 font-medium">Header</th>
                <th className="text-left py-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              <tr className="border-b">
                <td className="py-2 pr-4 text-mocha-600 dark:text-mocha-400">
                  X-RateLimit-Limit
                </td>
                <td className="py-2 text-muted-foreground">
                  Maximum requests allowed in the window
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 text-mocha-600 dark:text-mocha-400">
                  X-RateLimit-Remaining
                </td>
                <td className="py-2 text-muted-foreground">
                  Requests remaining in the current window
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 text-mocha-600 dark:text-mocha-400">
                  X-RateLimit-Reset
                </td>
                <td className="py-2 text-muted-foreground">
                  Unix timestamp when the rate limit resets
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 text-mocha-600 dark:text-mocha-400">
                  Retry-After
                </td>
                <td className="py-2 text-muted-foreground">
                  Seconds to wait before retrying (only on 429 responses)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* OpenAPI Spec Download */}
      <div className="mt-8 p-6 rounded-xl border bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">OpenAPI Specification</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Download the full OpenAPI 3.0 specification for use with Swagger
              UI, Postman, or other API tools.
            </p>
          </div>
          <Button variant="outline" asChild>
            <a href="/api/openapi.json" target="_blank" rel="noopener">
              <ExternalLink className="mr-2 h-4 w-4" />
              View JSON
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
