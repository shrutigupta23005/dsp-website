"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import type { ProductWithRelations } from "@/types";

interface FeaturedProductsProps {
  products: ProductWithRelations[];
  isAuthenticated: boolean;
  wishlistedIds?: string[];
  onWishlistToggle?: (productId: string) => void;
}

export default function FeaturedProducts({
  products,
  isAuthenticated,
  wishlistedIds = [],
  onWishlistToggle,
}: FeaturedProductsProps) {
  const visibleProducts = isAuthenticated ? products : products.slice(0, 8);
  const hasHiddenProducts = !isAuthenticated && products.length > 8;

  return (
    <section className="py-24 bg-white" id="featured-products">
      <div className="container-wide">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="eyebrow">Curated Selection</span>
          <h2
            className="text-4xl md:text-5xl font-bold text-text-primary mt-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Featured Collection
          </h2>
          <div className="golden-rule-center" />
          <p className="text-text-muted mt-4 max-w-lg mx-auto">
            Handpicked footwear from our most popular and trending styles
          </p>
        </motion.div>

        {/* Product Grid */}
        <div className="relative">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {visibleProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.05,
                  ease: "easeOut",
                }}
              >
                <ProductCard
                  product={product}
                  index={index}
                  isWishlisted={wishlistedIds.includes(product.id)}
                  onWishlistToggle={onWishlistToggle}
                  showWishlist={isAuthenticated}
                />
              </motion.div>
            ))}
          </div>

          {/* Blur Wall for Guests */}
          {hasHiddenProducts && (
            <div className="relative mt-0">
              {/* Blurred last row */}
              <div className="blur-wall">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 pointer-events-none select-none">
                  {products.slice(8, 12).map((product) => (
                    <div key={product.id} className="opacity-40">
                      <ProductCard
                        product={product}
                        showWishlist={false}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Login CTA */}
              <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-center pb-8">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="inline-flex items-center gap-2 bg-[#0A0A0A] text-white px-8 py-4 rounded-xl shadow-elevated">
                    <Lock className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium">
                      Login to explore the full collection
                    </span>
                    <Link
                      href="/auth/login"
                      className="ml-2 text-sm font-bold text-accent hover:text-accent-hover transition-colors"
                    >
                      Sign In
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary hover:text-accent transition-colors duration-200 group"
            id="featured-view-all"
          >
            View All Products
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
