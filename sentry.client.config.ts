import * as Sentry from "@sentry/nextjs";
import { scrubSensitiveData } from "@/lib/sentry-scrub";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.05,
  replaysOnErrorSampleRate: 1.0,
  environment: process.env.NODE_ENV,
  beforeSend(event) {
    // Don't send events in development
    if (process.env.NODE_ENV === "development") return null;
    // Scrub PII (passwords, OTPs, tokens) before sending
    return scrubSensitiveData(event);
  },
});
