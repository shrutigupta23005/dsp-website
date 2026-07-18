"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import ProductCard from "@/components/product/ProductCard";
import { getWhatsAppUrl } from "@/lib/utils";
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-dashed border-border bg-card p-16 text-center"
      >
        <Heart className="w-16 h-16 text-border mx-auto mb-6" strokeWidth={1} />
        <h2
          className="text-xl font-semibold text-text-primary"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Your wishlist is empty
        </h2>
        <p className="text-sm text-text-muted mt-2 max-w-sm mx-auto">
          Save products you love and find them here anytime
        </p>
        <Link
          href="/products"
          className="inline-block mt-6 px-6 py-3 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-lg transition-colors"
        >
          Browse Collection
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {wishlist.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <ProductCard
            product={item.product}
            index={index}
            isWishlisted
            onWishlistToggle={() => remove(item.productId)}
          />
          {/* Quick actions below card */}
          <div className="flex items-center justify-between mt-2 px-1">
            <button
              onClick={() => remove(item.productId)}
              className="text-xs text-text-muted hover:text-red-500 transition-colors flex items-center gap-1"
            >
              <Heart className="w-3 h-3" />
              Remove
            </button>
            <a
              href={getWhatsAppUrl(item.product.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-green-600 hover:text-green-700 transition-colors flex items-center gap-1"
            >
              <MessageCircle className="w-3 h-3" />
              WhatsApp
            </a>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
