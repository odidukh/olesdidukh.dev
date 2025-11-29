/**
 * Retry Logic with Exponential Backoff
 *
 * Provides utilities for retrying failed operations with configurable
 * retry strategies and exponential backoff.
 */

export interface RetryOptions {
  /** Maximum number of retry attempts (default: 3) */
  maxRetries?: number;
  /** Initial delay in milliseconds (default: 1000) */
  initialDelay?: number;
  /** Maximum delay in milliseconds (default: 30000) */
  maxDelay?: number;
  /** Backoff multiplier (default: 2) */
  backoffMultiplier?: number;
  /** Add randomness to delay to prevent thundering herd (default: true) */
  jitter?: boolean;
  /** HTTP status codes that should trigger a retry (default: [408, 429, 500, 502, 503, 504]) */
  retryableStatuses?: number[];
  /** Custom function to determine if error is retryable */
  shouldRetry?: (error: unknown, attempt: number) => boolean;
  /** Callback fired before each retry attempt */
  onRetry?: (error: unknown, attempt: number, delay: number) => void;
}

const DEFAULT_OPTIONS: Required<Omit<RetryOptions, 'shouldRetry' | 'onRetry'>> =
  {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 30000,
    backoffMultiplier: 2,
    jitter: true,
    retryableStatuses: [408, 429, 500, 502, 503, 504],
  };

/**
 * Default retryable status codes:
 * - 408: Request Timeout
 * - 429: Too Many Requests
 * - 500: Internal Server Error
 * - 502: Bad Gateway
 * - 503: Service Unavailable
 * - 504: Gateway Timeout
 */
export const RETRYABLE_STATUS_CODES = DEFAULT_OPTIONS.retryableStatuses;

/**
 * Calculate delay with exponential backoff and optional jitter
 */
function calculateDelay(
  attempt: number,
  initialDelay: number,
  maxDelay: number,
  backoffMultiplier: number,
  jitter: boolean
): number {
  // Exponential backoff: initialDelay * multiplier^attempt
  let delay = initialDelay * Math.pow(backoffMultiplier, attempt);

  // Cap at maxDelay
  delay = Math.min(delay, maxDelay);

  // Add jitter (±25% randomness)
  if (jitter) {
    const jitterRange = delay * 0.25;
    delay = delay - jitterRange + Math.random() * jitterRange * 2;
  }

  return Math.round(delay);
}

/**
 * Check if an error is retryable based on status code
 */
function isRetryableError(
  error: unknown,
  retryableStatuses: number[]
): boolean {
  // Network errors are retryable
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return true;
  }

  // Check for status code in error object
  if (error && typeof error === 'object') {
    const status = (error as { status?: number }).status;
    if (status && retryableStatuses.includes(status)) {
      return true;
    }
  }

  return false;
}

/**
 * Sleep for a specified duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry an async operation with exponential backoff
 *
 * @example
 * ```typescript
 * const result = await retry(
 *   () => fetch('/api/data').then(r => r.json()),
 *   { maxRetries: 3, initialDelay: 1000 }
 * );
 * ```
 */
export async function retry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const {
    maxRetries,
    initialDelay,
    maxDelay,
    backoffMultiplier,
    jitter,
    retryableStatuses,
    shouldRetry,
    onRetry,
  } = config;

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      // Check if we've exhausted retries
      if (attempt >= maxRetries) {
        break;
      }

      // Check if error is retryable
      const isRetryable = shouldRetry
        ? shouldRetry(error, attempt)
        : isRetryableError(error, retryableStatuses);

      if (!isRetryable) {
        break;
      }

      // Calculate delay
      const delay = calculateDelay(
        attempt,
        initialDelay,
        maxDelay,
        backoffMultiplier,
        jitter
      );

      // Fire onRetry callback
      if (onRetry) {
        onRetry(error, attempt + 1, delay);
      }

      // Log in development
      if (process.env.NODE_ENV === 'development') {
        console.log(
          `[Retry] Attempt ${attempt + 1}/${maxRetries} failed, retrying in ${delay}ms...`
        );
      }

      // Wait before retrying
      await sleep(delay);
    }
  }

  throw lastError;
}

/**
 * Wrapper for fetch with automatic retry
 *
 * @example
 * ```typescript
 * const response = await fetchWithRetry('/api/data', {
 *   method: 'POST',
 *   body: JSON.stringify({ data: 'test' }),
 * });
 * ```
 */
export async function fetchWithRetry(
  input: RequestInfo | URL,
  init?: RequestInit,
  retryOptions?: RetryOptions
): Promise<Response> {
  return retry(async () => {
    const response = await fetch(input, init);

    // Throw an error for retryable status codes so retry logic can catch it
    const retryableStatuses =
      retryOptions?.retryableStatuses ?? DEFAULT_OPTIONS.retryableStatuses;
    if (!response.ok && retryableStatuses.includes(response.status)) {
      const error = new Error(
        `HTTP ${response.status}: ${response.statusText}`
      );
      (error as Error & { status: number }).status = response.status;
      throw error;
    }

    return response;
  }, retryOptions);
}

/**
 * Create a retry wrapper with preset options
 *
 * @example
 * ```typescript
 * const retryWithLogging = createRetryWrapper({
 *   maxRetries: 5,
 *   onRetry: (error, attempt) => console.log(`Retry ${attempt}`)
 * });
 *
 * const result = await retryWithLogging(() => fetchData());
 * ```
 */
export function createRetryWrapper(defaultOptions: RetryOptions) {
  return <T>(
    operation: () => Promise<T>,
    overrideOptions?: RetryOptions
  ): Promise<T> => {
    return retry(operation, { ...defaultOptions, ...overrideOptions });
  };
}

/**
 * Pre-configured retry wrapper for API calls
 * - 3 retries with exponential backoff
 * - Handles common transient failures
 */
export const retryApi = createRetryWrapper({
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  onRetry: (error, attempt, delay) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[API Retry] Attempt ${attempt}, waiting ${delay}ms`, error);
    }
  },
});

/**
 * Pre-configured retry wrapper for critical operations
 * - 5 retries with longer delays
 * - For operations that absolutely must succeed
 */
export const retryCritical = createRetryWrapper({
  maxRetries: 5,
  initialDelay: 2000,
  maxDelay: 30000,
  onRetry: (error, attempt, delay) => {
    console.warn(
      `[Critical Retry] Attempt ${attempt}, waiting ${delay}ms`,
      error
    );
  },
});
