/**
 * In-memory rate limiter for development and single-instance deployments.
 *
 * ╔═══════════════════════════════════════════════════════════════════╗
 * ║  PRODUCTION UPGRADE: Replace with Upstash Redis                 ║
 * ║                                                                 ║
 * ║  This in-memory Map resets on every redeploy/cold start.        ║
 * ║  For production with multiple serverless instances, use:        ║
 * ║                                                                 ║
 * ║  npm install @upstash/ratelimit @upstash/redis                  ║
 * ║                                                                 ║
 * ║  import { Ratelimit } from "@upstash/ratelimit";                ║
 * ║  import { Redis } from "@upstash/redis";                       ║
 * ║                                                                 ║
 * ║  const ratelimit = new Ratelimit({                              ║
 * ║    redis: Redis.fromEnv(),                                      ║
 * ║    limiter: Ratelimit.slidingWindow(10, "10 s"),                ║
 * ║  });                                                            ║
 * ║                                                                 ║
 * ║  Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN        ║
 * ║  in your .env file.                                             ║
 * ╚═══════════════════════════════════════════════════════════════════╝
 */

const rateLimitMap = new Map<
  string,
  { count: number; resetTime: number }
>();

/**
 * Simple in-memory rate limiter.
 * @param identifier - Unique key (e.g. IP address, "otp:user@email.com")
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

/**
 * Convenience: per-email OTP rate limiter.
 * Max 3 OTP requests per email per hour.
 */
export function rateLimitOtp(email: string): boolean {
  return rateLimit(`otp:${email}`, 3, 3600);
}

/**
 * Convenience: per-IP auth rate limiter.
 * Max 10 auth attempts per IP per 15 minutes.
 */
export function rateLimitAuth(ip: string): boolean {
  return rateLimit(`auth:${ip}`, 10, 900);
}

// Cleanup stale entries every 5 minutes to prevent memory leaks
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
