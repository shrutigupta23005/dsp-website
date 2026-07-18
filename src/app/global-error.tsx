"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body
        style={{
          background: "#0A0A0A",
          color: "#F5F5F5",
          fontFamily: "Inter, Arial, sans-serif",
          margin: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "2rem",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 480 }}>
          <div
            style={{
              fontSize: 64,
              marginBottom: 16,
              opacity: 0.3,
              fontFamily: "Georgia, serif",
            }}
          >
            ✕
          </div>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 32,
              fontWeight: 400,
              marginBottom: 12,
              color: "#F5F5F5",
            }}
          >
            Something went wrong.
          </h1>
          <p
            style={{
              fontSize: 15,
              color: "#6B6B6B",
              lineHeight: 1.6,
              marginBottom: 32,
            }}
          >
            We apologize for the inconvenience. Our team has been notified and
            is looking into it.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button
              onClick={reset}
              style={{
                background: "#C9933A",
                color: "#0A0A0A",
                border: "none",
                padding: "12px 28px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                letterSpacing: "0.03em",
              }}
            >
              Try Again
            </button>
            <Link
              href="/"
              style={{
                background: "transparent",
                color: "#F5F5F5",
                border: "1px solid #2A2A2A",
                padding: "12px 28px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              Go Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
