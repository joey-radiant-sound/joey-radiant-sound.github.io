/**
 * In-memory IP-keyed token bucket. Good enough for a single-region Vercel
 * deploy with low contact-form volume; swap to Upstash Redis in Phase 2 if
 * we outgrow a single instance.
 *
 * @param key    usually a caller IP
 * @param max    bucket size (max submissions in the window)
 * @param windowMs  window length in ms
 * @returns  { ok: true } or { ok: false, retryAfterMs }
 */
type Bucket = { tokens: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function checkRateLimit(
  key: string,
  max = 3,
  windowMs = 15 * 60 * 1000,
): { ok: true } | { ok: false; retryAfterMs: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { tokens: max - 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (bucket.tokens <= 0) {
    return { ok: false, retryAfterMs: bucket.resetAt - now };
  }

  bucket.tokens -= 1;
  return { ok: true };
}
