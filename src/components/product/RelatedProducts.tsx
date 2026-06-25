"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import SectionHeader from "@/components/ui/SectionHeader";
import type { ProductWithRelations } from "@/types";

interface RelatedProductsProps {
  products: ProductWithRelations[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!products.length) return null;

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 320;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-white py-16" id="related-products">
      <div className="container-wide">
        <div className="flex items-end justify-between">
          <SectionHeader
            eyebrow="More Options"
            title="You May Also Like"
            centered={false}
          />
          <div className="mb-16 hidden gap-2 lg:flex">
            <button
              onClick={() => scroll("left")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:border-accent hover:text-accent"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:border-accent hover:text-accent"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="-mx-2 flex gap-4 overflow-x-auto px-2 pb-4 scrollbar-hide md:gap-6"
          style={{ scrollbarWidth: "none" }}
        >
          {products.map((product, index) => (
            <div key={product.id} className="w-[260px] shrink-0 md:w-[280px]">
              <ProductCard
                product={product}
                index={index}
                showWishlist={false}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
