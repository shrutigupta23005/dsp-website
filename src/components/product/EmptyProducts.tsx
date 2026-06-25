"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EmptyProducts() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-white px-8 py-16 text-center">
      {/* Inline SVG shoe box */}
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-6 text-border"
      >
        <rect x="12" y="32" width="56" height="36" rx="4" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M12 44H68" stroke="currentColor" strokeWidth="2" />
        <path d="M24 32V20C24 18.9 24.9 18 26 18H54C55.1 18 56 18.9 56 20V32" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M32 18V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M48 18V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="40" cy="54" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M40 51V57M37 54H43" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      <h3
        className="text-xl font-bold text-text-primary"
        style={{ fontFamily: "var(--font-display)" }}
      >
        No Products Found
      </h3>
      <p className="mt-2 max-w-sm text-sm text-text-muted">
        We could not find any products matching your current filters.
        Try adjusting your search criteria or clearing all filters.
      </p>
      <Button asChild className="mt-6" id="empty-clear-filters-btn">
        <Link href="/products">Clear All Filters</Link>
      </Button>
    </div>
  );
}
