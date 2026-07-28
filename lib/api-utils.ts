/**
 * Shared API resilience helpers: exponential backoff retries for rate limits /
 * transient failures, plus safe-fallback wrappers for non-critical calls.
 */

export type RetryOptions = {
  /** Max attempts including the first try. Default 5. */
  maxAttempts?: number;
  /** Initial delay in ms before first retry. Default 500. */
  baseDelayMs?: number;
  /** Cap on delay between retries. Default 30000. */
  maxDelayMs?: number;
  /** Optional label for logs. */
  label?: string;
  /**
   * When true (default), treat 429 / quota-style errors as retryable.
   * After exhausting retries, callers decide whether to fall back or throw.
   */
  retryOnRateLimit?: boolean;
};

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Detect OpenAI / HTTP / Edge-TTS style rate-limit or quota errors. */
export function isRateLimitError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const err = error as Record<string, unknown>;

  const status =
    (typeof err.status === "number" && err.status) ||
    (typeof err.statusCode === "number" && err.statusCode) ||
    (err.response &&
      typeof err.response === "object" &&
      typeof (err.response as { status?: number }).status === "number" &&
      (err.response as { status: number }).status) ||
    null;

  if (status === 429 || status === 403) return true;

  const code = String(err.code ?? err.type ?? "").toLowerCase();
  if (
    code.includes("rate_limit") ||
    code.includes("ratelimit") ||
    code.includes("insufficient_quota") ||
    code.includes("quota")
  ) {
    return true;
  }

  const message = String(err.message ?? error).toLowerCase();
  return (
    message.includes("rate limit") ||
    message.includes("too many requests") ||
    message.includes("429") ||
    message.includes("quota") ||
    message.includes("throttl")
  );
}

/** Transient network / 5xx style errors worth retrying. */
export function isRetryableError(error: unknown): boolean {
  if (isRateLimitError(error)) return true;
  if (!error || typeof error !== "object") return false;
  const err = error as Record<string, unknown>;
  const status =
    (typeof err.status === "number" && err.status) ||
    (typeof err.statusCode === "number" && err.statusCode) ||
    null;
  if (typeof status === "number" && status >= 500 && status < 600) return true;

  const code = String(err.code ?? "").toLowerCase();
  if (
    ["etimedout", "econnreset", "econnrefused", "enotfound", "eai_again"].includes(
      code,
    )
  ) {
    return true;
  }

  const message = String(err.message ?? "").toLowerCase();
  return (
    message.includes("timeout") ||
    message.includes("network") ||
    message.includes("socket hang up") ||
    message.includes("fetch failed")
  );
}

function delayForAttempt(
  attempt: number,
  baseDelayMs: number,
  maxDelayMs: number,
): number {
  // attempt is 1-based after a failure; exponential + small jitter
  const exp = Math.min(maxDelayMs, baseDelayMs * 2 ** (attempt - 1));
  const jitter = Math.floor(Math.random() * Math.min(250, exp * 0.2));
  return exp + jitter;
}

/**
 * Run `fn` with exponential backoff on rate-limit / transient errors.
 * Non-retryable errors are rethrown immediately.
 */
export async function withExponentialBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const maxAttempts = options.maxAttempts ?? 5;
  const baseDelayMs = options.baseDelayMs ?? 500;
  const maxDelayMs = options.maxDelayMs ?? 30_000;
  const label = options.label ?? "api-call";
  const retryOnRateLimit = options.retryOnRateLimit !== false;

  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const rateLimited = isRateLimitError(error);
      const retryable =
        (rateLimited && retryOnRateLimit) ||
        (!rateLimited && isRetryableError(error));

      if (!retryable || attempt === maxAttempts) {
        throw error;
      }

      const waitMs = delayForAttempt(attempt, baseDelayMs, maxDelayMs);
      console.warn(
        `[${label}] ${rateLimited ? "rate-limited" : "transient error"} ` +
          `(attempt ${attempt}/${maxAttempts}); retrying in ${waitMs}ms`,
      );
      await sleep(waitMs);
    }
  }

  throw lastError;
}

/**
 * Like `withExponentialBackoff`, but if retries are exhausted on a rate-limit
 * (or any error, when `fallbackOnAnyError` is true), returns `fallback()` instead
 * of throwing. Non-rate-limit errors still rethrow unless `fallbackOnAnyError`.
 */
export async function withBackoffOrFallback<T>(
  fn: () => Promise<T>,
  fallback: () => T | Promise<T>,
  options: RetryOptions & { fallbackOnAnyError?: boolean } = {},
): Promise<T> {
  try {
    return await withExponentialBackoff(fn, options);
  } catch (error) {
    const allowFallback =
      options.fallbackOnAnyError === true || isRateLimitError(error);
    if (!allowFallback) throw error;

    const label = options.label ?? "api-call";
    console.warn(
      `[${label}] quota/rate limit persisted after retries — using safe fallback.`,
    );
    return fallback();
  }
}
