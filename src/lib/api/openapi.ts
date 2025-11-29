/**
 * OpenAPI 3.0 Specification for Portfolio Website API
 *
 * This specification documents all public API endpoints.
 */

export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Oles Didukh Portfolio API',
    description: `
API documentation for olesdidukh.dev portfolio website.

## Overview

This API provides endpoints for:
- **Contact Form**: Submit contact form messages
- **Newsletter**: Subscribe to the newsletter
- **OG Images**: Generate dynamic Open Graph images

## Authentication

Most endpoints are public but protected by:
- CSRF validation (Origin/Referer header check)
- Rate limiting (IP-based)

## Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| Contact | 5 requests | 15 minutes |
| Newsletter | 3 requests | 1 hour |

Rate limit headers are included in all responses:
- \`X-RateLimit-Limit\`: Maximum requests allowed
- \`X-RateLimit-Remaining\`: Requests remaining
- \`X-RateLimit-Reset\`: Unix timestamp when limit resets
    `.trim(),
    version: '1.0.0',
    contact: {
      name: 'Oles Didukh',
      url: 'https://olesdidukh.dev',
      email: 'oles.didukh@gmail.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'https://olesdidukh.dev',
      description: 'Production server',
    },
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  tags: [
    {
      name: 'Contact',
      description: 'Contact form submission endpoint',
    },
    {
      name: 'Newsletter',
      description: 'Newsletter subscription endpoint',
    },
    {
      name: 'OG Images',
      description: 'Dynamic Open Graph image generation',
    },
  ],
  paths: {
    '/api/contact': {
      post: {
        tags: ['Contact'],
        summary: 'Submit contact form',
        description: `
Submit a contact form message. The message will be sent via email to the site owner.

**Rate Limit**: 5 requests per 15 minutes per IP address.
        `.trim(),
        operationId: 'submitContactForm',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ContactFormRequest',
              },
              examples: {
                basic: {
                  summary: 'Basic contact',
                  value: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    message:
                      'Hi, I would like to discuss a potential project with you.',
                  },
                },
                detailed: {
                  summary: 'Detailed inquiry',
                  value: {
                    name: 'Jane Smith',
                    email: 'jane@company.com',
                    phone: '+1 (555) 123-4567',
                    company: 'Tech Corp',
                    projectType: 'Web Application',
                    budget: '$10,000 - $25,000',
                    timeline: '2-3 months',
                    message:
                      'We are looking for a senior front-end engineer to help build our new SaaS platform.',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Message sent successfully',
            headers: {
              'X-RateLimit-Limit': {
                $ref: '#/components/headers/X-RateLimit-Limit',
              },
              'X-RateLimit-Remaining': {
                $ref: '#/components/headers/X-RateLimit-Remaining',
              },
              'X-RateLimit-Reset': {
                $ref: '#/components/headers/X-RateLimit-Reset',
              },
            },
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ValidationErrorResponse',
                },
                example: {
                  error: 'Validation failed',
                  details: {
                    fieldErrors: {
                      email: ['Invalid email address'],
                      message: ['Message must be at least 10 characters'],
                    },
                  },
                },
              },
            },
          },
          '403': {
            description: 'CSRF validation failed',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
                example: {
                  error: 'Invalid request origin',
                },
              },
            },
          },
          '429': {
            description: 'Rate limit exceeded',
            headers: {
              'Retry-After': {
                $ref: '#/components/headers/Retry-After',
              },
            },
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/RateLimitErrorResponse',
                },
              },
            },
          },
          '500': {
            description: 'Server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
                example: {
                  error: 'Failed to send message',
                },
              },
            },
          },
        },
      },
    },
    '/api/newsletter': {
      post: {
        tags: ['Newsletter'],
        summary: 'Subscribe to newsletter',
        description: `
Subscribe an email address to the newsletter via Buttondown.

**Rate Limit**: 3 requests per hour per IP address.
        `.trim(),
        operationId: 'subscribeNewsletter',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/NewsletterRequest',
              },
              example: {
                email: 'subscriber@example.com',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Successfully subscribed',
            headers: {
              'X-RateLimit-Limit': {
                $ref: '#/components/headers/X-RateLimit-Limit',
              },
              'X-RateLimit-Remaining': {
                $ref: '#/components/headers/X-RateLimit-Remaining',
              },
              'X-RateLimit-Reset': {
                $ref: '#/components/headers/X-RateLimit-Reset',
              },
            },
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SuccessResponse',
                },
              },
            },
          },
          '400': {
            description: 'Invalid email or already subscribed',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
                examples: {
                  invalid: {
                    summary: 'Invalid email',
                    value: {
                      error: 'Invalid email address',
                    },
                  },
                  exists: {
                    summary: 'Already subscribed',
                    value: {
                      error: 'This email is already subscribed',
                    },
                  },
                },
              },
            },
          },
          '403': {
            description: 'CSRF validation failed',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '429': {
            description: 'Rate limit exceeded',
            headers: {
              'Retry-After': {
                $ref: '#/components/headers/Retry-After',
              },
            },
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/RateLimitErrorResponse',
                },
              },
            },
          },
          '500': {
            description: 'Server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/api/og': {
      get: {
        tags: ['OG Images'],
        summary: 'Generate Open Graph image',
        description: `
Generate a dynamic Open Graph image for social media sharing.

The image is generated on-the-fly using Vercel's OG image generation.
Images are 1200x630 pixels (standard OG image size).

**No rate limiting** - images are cached by CDN.
        `.trim(),
        operationId: 'generateOgImage',
        parameters: [
          {
            name: 'title',
            in: 'query',
            description: 'Main title text',
            schema: {
              type: 'string',
              default: 'Oles Didukh',
            },
            example: 'Building Modern Web Applications',
          },
          {
            name: 'subtitle',
            in: 'query',
            description: 'Subtitle or tagline',
            schema: {
              type: 'string',
              default: 'Senior Front-End Engineer',
            },
            example: 'A deep dive into React Server Components',
          },
          {
            name: 'description',
            in: 'query',
            description: 'Additional description text',
            schema: {
              type: 'string',
            },
            example: 'Learn how to build performant applications with Next.js',
          },
          {
            name: 'type',
            in: 'query',
            description: 'Content type (affects styling)',
            schema: {
              type: 'string',
              enum: ['default', 'blog', 'project'],
              default: 'default',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Generated OG image',
            content: {
              'image/png': {
                schema: {
                  type: 'string',
                  format: 'binary',
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      ContactFormRequest: {
        type: 'object',
        required: ['name', 'email', 'message'],
        properties: {
          name: {
            type: 'string',
            minLength: 2,
            description: 'Full name of the sender',
            example: 'John Doe',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'Email address for replies',
            example: 'john@example.com',
          },
          phone: {
            type: 'string',
            description: 'Optional phone number',
            example: '+1 (555) 123-4567',
          },
          company: {
            type: 'string',
            description: 'Company or organization name',
            example: 'Tech Corp',
          },
          projectType: {
            type: 'string',
            description: 'Type of project inquiry',
            example: 'Web Application',
          },
          budget: {
            type: 'string',
            description: 'Budget range for the project',
            example: '$10,000 - $25,000',
          },
          timeline: {
            type: 'string',
            description: 'Expected project timeline',
            example: '2-3 months',
          },
          message: {
            type: 'string',
            minLength: 10,
            description: 'Message content',
            example: 'I would like to discuss a potential project.',
          },
        },
      },
      NewsletterRequest: {
        type: 'object',
        required: ['email'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'Email address to subscribe',
            example: 'subscriber@example.com',
          },
        },
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            description: 'Error message',
          },
        },
      },
      ValidationErrorResponse: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            example: 'Validation failed',
          },
          details: {
            type: 'object',
            properties: {
              fieldErrors: {
                type: 'object',
                additionalProperties: {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
      RateLimitErrorResponse: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            example: 'Too many requests. Please try again later.',
          },
          retryAfter: {
            type: 'number',
            description: 'Seconds until rate limit resets',
            example: 60,
          },
        },
      },
    },
    headers: {
      'X-RateLimit-Limit': {
        description: 'Maximum number of requests allowed in the window',
        schema: {
          type: 'integer',
          example: 5,
        },
      },
      'X-RateLimit-Remaining': {
        description: 'Number of requests remaining in the window',
        schema: {
          type: 'integer',
          example: 4,
        },
      },
      'X-RateLimit-Reset': {
        description: 'Unix timestamp when the rate limit resets',
        schema: {
          type: 'integer',
          example: 1699574400,
        },
      },
      'Retry-After': {
        description: 'Seconds to wait before retrying',
        schema: {
          type: 'integer',
          example: 60,
        },
      },
    },
  },
} as const;

export type OpenApiSpec = typeof openApiSpec;
