"use client";

export function useCompare() {
  async function add(productId: string) {
    const res = await fetch("/api/compare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    if (!res.ok) throw new Error("Could not add product to compare");
  }

  async function remove(productId: string) {
    const res = await fetch(`/api/compare/${productId}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Could not remove product from compare");
  }

  return { add, remove };
}
