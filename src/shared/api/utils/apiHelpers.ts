/**
 * API helper utilities for retry logic and error handling
 */

export interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
  onRetry?: (attempt: number, error: Error) => void;
}

const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 10000,
  onRetry: () => {},
};

/**
 * Fetch with retry logic and timeout
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retryOptions: RetryOptions = {}
): Promise<Response> {
  const config = { ...DEFAULT_RETRY_OPTIONS, ...retryOptions };
  const { maxRetries, retryDelay, timeout, onRetry } = config;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      // Merge abort signals if provided
      const signal = options.signal
        ? AbortSignal.any([controller.signal, options.signal])
        : controller.signal;

      const response = await fetch(url, {
        ...options,
        signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Don't retry on client errors (4xx), only server errors (5xx) and network errors
        if (
          response.status >= 400 &&
          response.status < 500 &&
          attempt < maxRetries
        ) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        if (response.status >= 500 || response.status === 429) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }

      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on abort (timeout) or if it's the last attempt
      if (lastError.name === "AbortError" || attempt === maxRetries) {
        break;
      }

      // Call retry callback
      onRetry(attempt + 1, lastError);

      // Exponential backoff: delay increases with each retry
      const delay = retryDelay * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error("Failed to fetch after retries");
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  // Network errors are retryable
  if (error.name === "TypeError" && error.message.includes("fetch")) {
    return true;
  }

  // Abort errors (timeouts) are retryable
  if (error.name === "AbortError") {
    return true;
  }

  // HTTP 5xx errors are retryable
  if (error.message.includes("HTTP 5")) {
    return true;
  }

  // Rate limiting is retryable
  if (error.message.includes("HTTP 429")) {
    return true;
  }

  return false;
}
