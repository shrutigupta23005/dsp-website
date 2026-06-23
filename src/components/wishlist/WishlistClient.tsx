"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import type { WishlistItem } from "@/types";

export default function WishlistClient({ items }: { items: WishlistItem[] }) {
  const [wishlist, setWishlist] = useState(items);

  const remove = async (productId: string) => {
    const previous = wishlist;
    setWishlist((current) => current.filter((item) => item.productId !== productId));
    try {
      const res = await fetch(`/api/wishlist/${productId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Removed from wishlist");
    } catch {
      setWishlist(previous);
      toast.error("Could not remove product");
    }
  };

  if (!wishlist.length) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-white p-12 text-center">
        <p className="eyebrow">Wishlist Empty</p>
        <h1 className="mt-3 text-3xl font-semibold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>Save your favorites</h1>
        <p className="mx-auto mt-3 max-w-xl text-text-muted">Tap the heart on any product to build a shortlist before visiting the store.</p>
        <Button asChild className="mt-6">
          <Link href="/products">Browse Collection</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {wishlist.map((item, index) => (
        <ProductCard
          key={item.id}
          product={item.product}
          index={index}
          isWishlisted
          onWishlistToggle={() => remove(item.productId)}
        />
      ))}
    </div>
  );
}
