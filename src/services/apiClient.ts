/**
 * API Client - Base HTTP client for making API requests
 */

export interface ApiClientOptions {
  baseUrl?: string;
  headers?: Record<string, string>;
  timeout?: number;
}

interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  timeout?: number;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}

class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

function createApiClient(defaultOptions: ApiClientOptions = {}) {
  const {
    baseUrl = '',
    headers: defaultHeaders = {},
    timeout: defaultTimeout = 30000,
  } = defaultOptions;

  async function request<TResponse>(
    endpoint: string,
    options: RequestOptions & { body?: string } = {}
  ): Promise<ApiResponse<TResponse>> {
    const {
      body,
      timeout = defaultTimeout,
      headers: requestHeaders,
      method = 'GET',
    } = options;

    const url = `${baseUrl}${endpoint}`;
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...defaultHeaders,
      ...requestHeaders,
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const fetchOptions: RequestInit = {
        method,
        headers,
        signal: controller.signal,
      };

      if (body !== undefined) {
        fetchOptions.body = body;
      }

      const response = await fetch(url, fetchOptions);

      clearTimeout(timeoutId);

      const data = (await response.json()) as TResponse;

      if (!response.ok) {
        throw new ApiClientError(
          `Request failed with status ${response.status}`,
          response.status,
          data
        );
      }

      return {
        data,
        status: response.status,
        headers: response.headers,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiClientError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiClientError('Request timeout', 408);
      }

      throw new ApiClientError(
        error instanceof Error ? error.message : 'Unknown error',
        0
      );
    }
  }

  return {
    get: <TResponse>(endpoint: string, options?: RequestOptions) =>
      request<TResponse>(endpoint, { ...options, method: 'GET' }),

    post: <TResponse, TBody>(
      endpoint: string,
      body: TBody,
      options?: RequestOptions
    ) =>
      request<TResponse>(endpoint, {
        ...options,
        method: 'POST',
        body: JSON.stringify(body),
      }),

    put: <TResponse, TBody>(
      endpoint: string,
      body: TBody,
      options?: RequestOptions
    ) =>
      request<TResponse>(endpoint, {
        ...options,
        method: 'PUT',
        body: JSON.stringify(body),
      }),

    patch: <TResponse, TBody>(
      endpoint: string,
      body: TBody,
      options?: RequestOptions
    ) =>
      request<TResponse>(endpoint, {
        ...options,
        method: 'PATCH',
        body: JSON.stringify(body),
      }),

    delete: <TResponse>(endpoint: string, options?: RequestOptions) =>
      request<TResponse>(endpoint, { ...options, method: 'DELETE' }),
  };
}

// Default API client for internal API routes
export const apiClient = createApiClient({
  baseUrl: '/api',
});

export { createApiClient, ApiClientError };
