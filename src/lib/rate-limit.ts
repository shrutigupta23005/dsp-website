const rateLimitMap = new Map<
  string,
  { count: number; resetTime: number }
>();

/**
 * Simple in-memory rate limiter.
 * @param identifier - Unique key (e.g. IP address or user ID)
 * @param limit - Max requests allowed in the window
 * @param windowSeconds - Time window in seconds
 * @returns true if the request is allowed, false if rate-limited
 */
export function rateLimit(
  identifier: string,
  limit: number,
  windowSeconds: number
): boolean {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count++;
  return true;
}

// Cleanup stale entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap.entries()) {
      if (now > entry.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}
