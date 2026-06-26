"use client";

import useSWR from "swr";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import ProductCard from "@/components/product/ProductCard";
import { formatPrice, getInitials } from "@/lib/utils";
import type { ProductWithRelations } from "@/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json()).then((d) => d.data || []);

interface RecentlyViewedItem {
  id: string;
  productId: string;
  product: ProductWithRelations;
}

interface PersonalizedSectionProps {
  user: {
    name?: string | null;
    email?: string | null;
    createdAt?: string;
  };
  wishlistedIds: string[];
  onWishlistToggle: (productId: string) => void;
}

function CardSkeleton() {
  return (
    <div className="flex-shrink-0 w-[180px]">
      <div className="aspect-square rounded-xl animate-pulse bg-border/40" />
      <div className="mt-2 h-3 w-16 animate-pulse rounded bg-border/40" />
      <div className="mt-1 h-4 w-full animate-pulse rounded bg-border/40" />
      <div className="mt-1 h-4 w-20 animate-pulse rounded bg-border/40" />
    </div>
  );
}

export default function PersonalizedSection({
  user,
  wishlistedIds,
  onWishlistToggle,
}: PersonalizedSectionProps) {
  const { data: recentlyViewed, isLoading: rvLoading } = useSWR<RecentlyViewedItem[]>(
    "/api/recently-viewed",
    fetcher
  );
  const { data: recommendations, isLoading: recLoading } = useSWR<ProductWithRelations[]>(
    "/api/recommendations",
    fetcher
  );

  const initials = getInitials(user.name || "U");
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })
    : "";

  return (
    <>
      {/* Welcome Banner */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-[#0A0A0A] py-8"
      >
        <div className="container-wide flex items-center justify-between px-6">
          <div>
            <p className="text-white/50 text-sm">Welcome back,</p>
            <h2
              className="text-2xl md:text-[28px] font-bold text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {user.name || "Shoe Lover"}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
              <span className="text-white text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>
                {initials}
              </span>
            </div>
            {memberSince && (
              <p className="hidden sm:block text-xs text-white/30" style={{ fontFamily: "var(--font-utility)" }}>
                Member since {memberSince}
              </p>
            )}
          </div>
        </div>
      </motion.section>

      {/* Recently Viewed */}
      {(rvLoading || (recentlyViewed && recentlyViewed.length > 0)) && (
        <section className="bg-background-secondary py-12">
          <div className="container-wide">
            <p className="eyebrow">PICKED UP WHERE YOU LEFT OFF</p>
            <h3
              className="text-xl font-bold text-text-primary mt-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Recently Viewed
            </h3>
            <span className="golden-rule" />

            <div className="mt-8 flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: "none" }}>
              {rvLoading ? (
                <>
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                </>
              ) : (
                recentlyViewed?.slice(0, 8).map((item) => {
                  const primaryImage = item.product.images.find((img) => img.type === "PRIMARY") || item.product.images[0];
                  return (
                    <Link
                      key={item.id}
                      href={`/products/${item.product.slug}`}
                      className="flex-shrink-0 w-[180px] group"
                    >
                      <div className="relative aspect-square overflow-hidden rounded-xl bg-white">
                        {primaryImage && (
                          <Image
                            src={primaryImage.url}
                            alt={item.product.name}
                            fill
                            sizes="180px"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                      </div>
                      <p className="mt-2 text-[11px] text-text-muted uppercase tracking-wider" style={{ fontFamily: "var(--font-utility)" }}>
                        {item.product.brand.name}
                      </p>
                      <p className="text-sm font-medium text-text-primary line-clamp-1 mt-0.5">
                        {item.product.name}
                      </p>
                      <p className="price text-sm text-accent mt-0.5">
                        {formatPrice(item.product.price)}
                      </p>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </section>
      )}

      {/* Recommendations */}
      {(recLoading || (recommendations && recommendations.length > 0)) && (
        <section className="bg-white py-12">
          <div className="container-wide">
            <p className="eyebrow">JUST FOR YOU</p>
            <h3
              className="text-xl font-bold text-text-primary mt-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Recommended
            </h3>
            <span className="golden-rule" />

            <div className="mt-8">
              {recLoading ? (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                  {Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className="overflow-hidden rounded-xl bg-white">
                      <div className="aspect-square animate-pulse bg-border/40" />
                      <div className="space-y-2 p-4">
                        <div className="h-3 w-16 animate-pulse rounded bg-border/40" />
                        <div className="h-4 w-full animate-pulse rounded bg-border/40" />
                        <div className="h-5 w-20 animate-pulse rounded bg-border/40" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recommendations && recommendations.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                  {recommendations.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                      isWishlisted={wishlistedIds.includes(product.id)}
                      onWishlistToggle={onWishlistToggle}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-text-muted py-8">
                  Browse products to get personalized recommendations
                </p>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
