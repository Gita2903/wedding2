type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  limit: number;
  windowMs: number;
};

const entries = new Map<string, RateLimitEntry>();

export function getRequestIdentifier(headers?: Record<string, unknown>) {
  const forwardedFor = headers?.["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.length > 0) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = headers?.["x-real-ip"];
  return typeof realIp === "string" && realIp.length > 0 ? realIp : "unknown";
}

export function checkRateLimit(
  key: string,
  { limit, windowMs }: RateLimitOptions,
) {
  const now = Date.now();
  const current = entries.get(key);
  const entry = !current || current.resetAt <= now
    ? { count: 0, resetAt: now + windowMs }
    : current;

  entry.count += 1;
  entries.set(key, entry);

  return {
    allowed: entry.count <= limit,
    retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
  };
}

export function resetRateLimit(key: string) {
  entries.delete(key);
}
