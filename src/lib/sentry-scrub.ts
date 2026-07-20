import type { ErrorEvent } from "@sentry/nextjs";

/**
 * List of sensitive field names to scrub from Sentry events.
 * These will be replaced with "[REDACTED]" in breadcrumbs, request data, and extras.
 */
const SENSITIVE_FIELDS = [
  "password",
  "confirmPassword",
  "newPassword",
  "otp",
  "token",
  "resetToken",
  "secret",
  "authorization",
  "cookie",
  "creditCard",
  "cardNumber",
  "cvv",
  "ssn",
];

/**
 * Recursively scrub sensitive fields from an object.
 */
function scrubObject(obj: Record<string, unknown>): Record<string, unknown> {
  const scrubbed: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_FIELDS.some((field) => key.toLowerCase().includes(field.toLowerCase()))) {
      scrubbed[key] = "[REDACTED]";
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      scrubbed[key] = scrubObject(value as Record<string, unknown>);
    } else {
      scrubbed[key] = value;
    }
  }
  return scrubbed;
}

/**
 * Sentry beforeSend hook that scrubs PII/secrets from events.
 * Attach to both client and server Sentry configs.
 */
export function scrubSensitiveData(event: ErrorEvent): ErrorEvent {
  // Scrub request body data
  if (event.request?.data && typeof event.request.data === "object") {
    event.request.data = scrubObject(event.request.data as Record<string, unknown>);
  }

  // Scrub request headers (cookies, authorization)
  if (event.request?.headers) {
    const headers = event.request.headers;
    for (const key of Object.keys(headers)) {
      if (SENSITIVE_FIELDS.some((f) => key.toLowerCase().includes(f.toLowerCase()))) {
        headers[key] = "[REDACTED]";
      }
    }
  }

  // Scrub breadcrumb data
  if (event.breadcrumbs) {
    event.breadcrumbs = event.breadcrumbs.map((breadcrumb) => {
      if (breadcrumb.data && typeof breadcrumb.data === "object") {
        breadcrumb.data = scrubObject(breadcrumb.data as Record<string, unknown>);
      }
      return breadcrumb;
    });
  }

  // Scrub extras
  if (event.extra && typeof event.extra === "object") {
    event.extra = scrubObject(event.extra as Record<string, unknown>);
  }

  return event;
}
