'use client';

import * as React from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Play,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface ApiEndpointProps {
  endpoint: EndpointConfig;
  isExpanded: boolean;
  onToggle: () => void;
}

const methodColors: Record<string, string> = {
  GET: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400',
  POST: 'bg-info-100 text-info-700 dark:bg-info-900/30 dark:text-info-400',
  PUT: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400',
  DELETE:
    'bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive',
};

export function ApiEndpoint({
  endpoint,
  isExpanded,
  onToggle,
}: ApiEndpointProps) {
  const [copied, setCopied] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [response, setResponse] = React.useState<{
    status: number;
    data: unknown;
  } | null>(null);
  const [requestBody, setRequestBody] = React.useState(
    endpoint.requestBody
      ? JSON.stringify(endpoint.requestBody.example, null, 2)
      : ''
  );

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tryEndpoint = async () => {
    setIsLoading(true);
    setResponse(null);

    try {
      const options: RequestInit = {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (endpoint.method === 'POST' && requestBody) {
        options.body = requestBody;
      }

      const res = await fetch(endpoint.path, options);
      const data = await res.json().catch(() => null);

      setResponse({
        status: res.status,
        data,
      });
    } catch {
      setResponse({
        status: 0,
        data: { error: 'Network error or CORS issue' },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border rounded-xl overflow-hidden bg-card">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3 flex-1">
          <Badge
            className={cn(
              'font-mono text-xs px-2 py-0.5',
              methodColors[endpoint.method]
            )}
          >
            {endpoint.method}
          </Badge>
          <code className="text-sm font-mono text-muted-foreground">
            {endpoint.path}
          </code>
        </div>
        <div className="flex items-center gap-3">
          {endpoint.icon}
          <span className="font-medium hidden sm:inline">{endpoint.title}</span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t p-4 space-y-6">
          {/* Description */}
          <div>
            <p className="text-muted-foreground">{endpoint.description}</p>
            {endpoint.rateLimit && (
              <div className="mt-2">
                <Badge variant="warning" size="sm">
                  Rate Limit: {endpoint.rateLimit}
                </Badge>
              </div>
            )}
          </div>

          {/* Request Body */}
          {endpoint.requestBody && (
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Request Body</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Required fields:{' '}
                    <span className="font-mono text-mocha-600 dark:text-mocha-400">
                      {endpoint.requestBody.required.join(', ')}
                    </span>
                  </p>
                  {endpoint.requestBody.optional.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Optional fields:{' '}
                      <span className="font-mono">
                        {endpoint.requestBody.optional.join(', ')}
                      </span>
                    </p>
                  )}
                </div>
              </div>
              <div className="relative">
                <textarea
                  value={requestBody}
                  onChange={e => setRequestBody(e.target.value)}
                  className="w-full h-48 p-3 font-mono text-xs bg-muted/50 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-mocha-500"
                  spellCheck={false}
                />
              </div>
            </div>
          )}

          {/* Query Parameters */}
          {endpoint.queryParams && endpoint.queryParams.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Query Parameters</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4 font-medium">Name</th>
                      <th className="text-left py-2 pr-4 font-medium">Type</th>
                      <th className="text-left py-2 pr-4 font-medium">
                        Default
                      </th>
                      <th className="text-left py-2 font-medium">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {endpoint.queryParams.map(param => (
                      <tr key={param.name} className="border-b last:border-0">
                        <td className="py-2 pr-4 font-mono text-mocha-600 dark:text-mocha-400">
                          {param.name}
                        </td>
                        <td className="py-2 pr-4 text-muted-foreground">
                          {param.type}
                          {param.enum && (
                            <span className="text-xs ml-1">
                              ({param.enum.join(' | ')})
                            </span>
                          )}
                        </td>
                        <td className="py-2 pr-4 font-mono text-xs">
                          {param.default ?? '-'}
                        </td>
                        <td className="py-2 text-muted-foreground">
                          {param.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Responses */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Responses</h4>
            <div className="space-y-2">
              {endpoint.responses.map(res => (
                <div
                  key={res.status}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
                >
                  <Badge
                    variant={
                      res.status < 300
                        ? 'success'
                        : res.status < 500
                          ? 'warning'
                          : 'destructive'
                    }
                    size="sm"
                    className="font-mono"
                  >
                    {res.status}
                  </Badge>
                  <div className="flex-1">
                    <p className="text-sm">{res.description}</p>
                    {res.example && (
                      <pre className="mt-2 p-2 text-xs font-mono bg-background rounded border overflow-x-auto">
                        {JSON.stringify(res.example, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* cURL Example */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm">cURL Example</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(endpoint.curlExample)}
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <pre className="p-3 text-xs font-mono bg-muted/50 rounded-lg border overflow-x-auto whitespace-pre-wrap">
              {endpoint.curlExample}
            </pre>
          </div>

          {/* Try It */}
          {endpoint.method !== 'GET' && (
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">Try It</h4>
                <Button
                  onClick={tryEndpoint}
                  disabled={isLoading}
                  size="sm"
                  variant="outline"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3 mr-1" />
                      Send Request
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Note: Requests are subject to rate limiting and CSRF protection.
                This will make a real request to the API.
              </p>
              {response && (
                <div className="p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant={
                        response.status < 300
                          ? 'success'
                          : response.status < 500
                            ? 'warning'
                            : 'destructive'
                      }
                      size="sm"
                      className="font-mono"
                    >
                      {response.status || 'Error'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Response
                    </span>
                  </div>
                  <pre className="text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(response.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Preview for OG endpoint */}
          {endpoint.path === '/api/og' && (
            <div className="space-y-3 pt-4 border-t">
              <h4 className="font-semibold text-sm">Preview</h4>
              <div className="border rounded-lg overflow-hidden">
                <Image
                  src="/api/og?title=Example%20Title&subtitle=Example%20Subtitle&type=blog"
                  alt="OG Image Preview"
                  width={1200}
                  height={630}
                  className="w-full h-auto"
                  unoptimized
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Try different parameters by modifying the URL above
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
