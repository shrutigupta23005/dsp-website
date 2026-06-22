"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Hero from "@/components/home/Hero";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import AboutStrip from "@/components/home/AboutStrip";
import QuizTeaser from "@/components/home/QuizTeaser";
import StoreInfo from "@/components/home/StoreInfo";
import type { ProductWithRelations } from "@/types";

interface HomePageClientProps {
  featuredProducts: ProductWithRelations[];
  isAuthenticated: boolean;
  wishlistedIds: string[];
}

export default function HomePageClient({
  featuredProducts,
  isAuthenticated,
  wishlistedIds: initialWishlistedIds,
}: HomePageClientProps) {
  const [wishlistedIds, setWishlistedIds] = useState<string[]>(initialWishlistedIds);

  const handleWishlistToggle = async (productId: string) => {
    if (!isAuthenticated) {
      toast.error("Please login to use wishlist");
      return;
    }

    const isWishlisted = wishlistedIds.includes(productId);

    // Optimistic update
    if (isWishlisted) {
      setWishlistedIds((prev) => prev.filter((id) => id !== productId));
    } else {
      setWishlistedIds((prev) => [...prev, productId]);
    }

    try {
      if (isWishlisted) {
        const res = await fetch(`/api/wishlist/${productId}`, { method: "DELETE" });
        if (!res.ok) throw new Error();
        toast.success("Removed from wishlist");
      } else {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
        if (!res.ok) throw new Error();
        toast.success("Added to wishlist");
      }
    } catch {
      // Revert optimistic update
      if (isWishlisted) {
        setWishlistedIds((prev) => [...prev, productId]);
      } else {
        setWishlistedIds((prev) => prev.filter((id) => id !== productId));
      }
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <Hero />
      <CategoryGrid />
      <FeaturedProducts
        products={featuredProducts}
        isAuthenticated={isAuthenticated}
        wishlistedIds={wishlistedIds}
        onWishlistToggle={handleWishlistToggle}
      />
      <AboutStrip />
      <QuizTeaser />
      <StoreInfo />
    </>
  );
}
