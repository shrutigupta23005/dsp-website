"use client";

import { useState } from "react";

export function useWishlist(initialIds: string[] = []) {
  const [ids, setIds] = useState(initialIds);

  async function toggle(productId: string) {
    const isWishlisted = ids.includes(productId);
    setIds((current) => isWishlisted ? current.filter((id) => id !== productId) : [...current, productId]);
    const res = await fetch(isWishlisted ? `/api/wishlist/${productId}` : "/api/wishlist", {
      method: isWishlisted ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: isWishlisted ? undefined : JSON.stringify({ productId }),
    });
    if (!res.ok) {
      setIds((current) => isWishlisted ? [...current, productId] : current.filter((id) => id !== productId));
      throw new Error("Wishlist update failed");
    }
  }

  return { ids, toggle };
}
