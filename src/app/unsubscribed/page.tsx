import Link from "next/link";
import { CheckCircle } from "lucide-react";

export const metadata = {
  title: "Unsubscribed",
};

export default function UnsubscribedPage() {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="text-center max-w-md">
        <div
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
          style={{ background: "var(--accent-muted)" }}
        >
          <CheckCircle
            className="h-8 w-8"
            style={{ color: "var(--accent-color)" }}
          />
        </div>
        <h1
          className="text-2xl font-bold mb-3"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--text-primary)",
          }}
        >
          You&apos;ve been unsubscribed.
        </h1>
        <p
          className="text-sm mb-8"
          style={{ color: "var(--text-muted)" }}
        >
          You&apos;ll no longer receive emails from Delhi Shoe Palace.
          If this was a mistake, you can always resubscribe from our website.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-colors"
          style={{
            background: "var(--accent-color)",
            color: "var(--text-on-accent)",
          }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
