import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background-secondary px-6 text-center">
      <div className="max-w-md">
        <p className="eyebrow">404</p>
        <h1 className="mt-3 text-4xl font-bold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>
          This page is not in the catalog
        </h1>
        <p className="mt-4 text-text-muted">The pair you are looking for may have moved, but the collection is still open.</p>
        <Button asChild className="mt-8">
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    </div>
  );
}
