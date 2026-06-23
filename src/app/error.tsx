"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background-secondary px-6 text-center">
      <div className="max-w-md">
        <p className="eyebrow">Something Went Wrong</p>
        <h1 className="mt-3 text-4xl font-bold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>
          The catalog needs a quick refresh
        </h1>
        <p className="mt-4 text-text-muted">Please try again. If the problem continues, contact the store on WhatsApp.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Button onClick={reset}>Try Again</Button>
          <Button asChild variant="outline">
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
