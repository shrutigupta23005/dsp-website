"use client";

export function useRecentlyViewed() {
  async function log(productId: string) {
    await fetch("/api/recently-viewed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
  }

  return { log };
}
