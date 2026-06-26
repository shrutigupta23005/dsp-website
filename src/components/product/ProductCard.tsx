"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { cn, formatPrice, getStatusLabel, getStatusColor } from "@/lib/utils";
import AddToCompareButton from "@/components/product/AddToCompareButton";
import type { ProductWithRelations } from "@/types";

interface ProductCardProps {
  product: ProductWithRelations;
  index?: number;
  isWishlisted?: boolean;
  onWishlistToggle?: (productId: string) => void;
  showWishlist?: boolean;
}

export default function ProductCard({
  product,
  index = 0,
  isWishlisted = false,
  onWishlistToggle,
  showWishlist = true,
}: ProductCardProps) {
  const primaryImage = product.images.find((img) => img.type === "PRIMARY") || product.images[0];
  const lifestyleImage = product.images.find((img) => img.type === "LIFESTYLE");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        ease: "easeOut",
      }}
    >
      <Link
        href={`/products/${product.slug}`}
        className="group block bg-white rounded-xl overflow-hidden transition-all duration-500 hover:shadow-[var(--shadow-card-hover)]"
        id={`product-card-${product.slug}`}
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-[#F8F6F3]">
          {/* Default Image */}
          {primaryImage && (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={cn(
                "object-cover transition-all duration-700 ease-out",
                lifestyleImage ? "group-hover:opacity-0" : "group-hover:scale-105"
              )}
            />
          )}

          {/* Lifestyle Image (crossfade on hover) */}
          {lifestyleImage && (
            <Image
              src={lifestyleImage.url}
              alt={`${product.name} - Lifestyle`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-all duration-700 ease-out [clip-path:inset(0_100%_0_0)] group-hover:scale-105 group-hover:[clip-path:inset(0_0_0_0)]"
            />
          )}

          {/* Status Badge */}
          {product.status !== "AVAILABLE" && (
            <div className="absolute top-3 left-3 z-10">
              <span
                className={cn(
                  "inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full",
                  getStatusColor(product.status)
                )}
              >
                {getStatusLabel(product.status)}
              </span>
            </div>
          )}

          {/* Wishlist Button */}
          {showWishlist && onWishlistToggle && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onWishlistToggle(product.id);
              }}
              className={cn(
                "absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300",
                "opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0",
                isWishlisted
                  ? "bg-red-50 text-red-500 opacity-100 translate-y-0"
                  : "bg-white/90 text-text-muted hover:text-red-500"
              )}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                className={cn(
                  "w-4 h-4 transition-transform duration-300",
                  isWishlisted && "fill-current scale-110"
                )}
              />
            </button>
          )}

          {/* Compare Button */}
          <div className="absolute bottom-3 right-3 z-10 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <AddToCompareButton product={product} />
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <p className="text-[11px] font-medium text-text-muted uppercase tracking-wider mb-1">
            {product.brand.name}
          </p>
          <h3
            className="text-sm font-semibold text-text-primary leading-snug line-clamp-2 mb-2 group-hover:text-accent transition-colors duration-200"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {product.name}
          </h3>
          <p className="price text-base text-text-primary">
            {formatPrice(product.price)}
          </p>

          {/* Color Swatches */}
          {product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 mt-3">
              {product.colors.slice(0, 4).map((color) => (
                <div
                  key={color.id}
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: color.hexCode || "#ccc" }}
                  title={color.name}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[10px] text-text-muted ml-1">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
