"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import type { ProductWithRelations } from "@/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json()).then((d) => d.data || []);

interface RecentlyViewedItem {
  id: string;
  productId: string;
  viewedAt: string;
  product: ProductWithRelations;
}

interface RecentlyViewedProps {
  currentProductId?: string;
}

export default function RecentlyViewed({ currentProductId }: RecentlyViewedProps) {
  const { data: session } = useSession();

  // Track the current product view
  useEffect(() => {
    if (!session || !currentProductId) return;
    fetch("/api/recently-viewed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: currentProductId }),
    }).catch(() => undefined);
  }, [session, currentProductId]);

  const { data } = useSWR<RecentlyViewedItem[]>(
    session ? "/api/recently-viewed" : null,
    fetcher
  );

  if (!session || !data || data.length === 0) return null;

  // Exclude current product from display
  const items = data
    .filter((item) => item.productId !== currentProductId)
    .slice(0, 8);

  if (items.length === 0) return null;

  return (
    <section className="py-12 bg-background-secondary">
      <div className="container-wide">
        <p className="eyebrow">YOUR HISTORY</p>
        <h2
          className="text-2xl font-bold text-text-primary mt-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Recently Viewed
        </h2>
        <span className="golden-rule" />

        <div className="mt-8 flex gap-4 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
          {items.map((item) => {
            const primaryImage = item.product.images.find((img) => img.type === "PRIMARY") || item.product.images[0];
            return (
              <Link
                key={item.id}
                href={`/products/${item.product.slug}`}
                className="flex-shrink-0 w-[160px] group"
              >
                <div className="relative aspect-square overflow-hidden rounded-xl bg-card">
                  {primaryImage && (
                    <Image
                      src={primaryImage.url}
                      alt={primaryImage.alt || item.product.name}
                      fill
                      sizes="160px"
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
          })}
        </div>
      </div>
    </section>
  );
}
