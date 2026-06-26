"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, Scale } from "lucide-react";
import { toast } from "sonner";
import ProductCard from "@/components/product/ProductCard";
import RecentlyViewed from "@/components/product/RecentlyViewed";
import { Button } from "@/components/ui/button";
import { useCompareStore } from "@/store/compareStore";
import type { ProductWithRelations } from "@/types";
import { cn, formatPrice, getStatusLabel, getWhatsAppUrl } from "@/lib/utils";

interface Props {
  product: ProductWithRelations;
  relatedProducts: ProductWithRelations[];
  isAuthenticated: boolean;
  isWishlisted: boolean;
}

export default function ProductDetailClient({
  product,
  relatedProducts,
  isAuthenticated,
  isWishlisted: initialIsWishlisted,
}: Props) {
  const [selectedImageId, setSelectedImageId] = useState(product.images[0]?.id);
  const [selectedSize, setSelectedSize] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);
  const selectedImage = useMemo(
    () => product.images.find((image) => image.id === selectedImageId) || product.images[0],
    [product.images, selectedImageId]
  );

  useEffect(() => {
    if (!isAuthenticated) return;
    fetch("/api/recently-viewed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id }),
    }).catch(() => undefined);
  }, [isAuthenticated, product.id]);

  // Zustand compare store
  const { add: addToCompare, isAdded: isCompareAdded } = useCompareStore();

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to use wishlist");
      return;
    }
    const next = !isWishlisted;
    setIsWishlisted(next);
    try {
      const res = await fetch(next ? "/api/wishlist" : `/api/wishlist/${product.id}`, {
        method: next ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: next ? JSON.stringify({ productId: product.id }) : undefined,
      });
      if (!res.ok) throw new Error();
    } catch {
      setIsWishlisted(!next);
      toast.error("Wishlist update failed");
    }
  };

  const handleCompare = () => {
    addToCompare(product);
  };

  return (
    <div className="bg-background-secondary pt-28">
      <section className="container-wide pb-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="relative aspect-square overflow-hidden rounded-lg bg-white">
              {selectedImage ? (
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.alt || product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                />
              ) : null}
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.images.map((image) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImageId(image.id)}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-md border bg-white",
                    selectedImageId === image.id ? "border-accent" : "border-border"
                  )}
                >
                  <Image src={image.url} alt={image.alt || product.name} fill sizes="25vw" className="object-cover" />
                </button>
              ))}
            </div>
          </div>
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Link href={`/products?brand=${product.brand.slug}`} className="eyebrow">
              {product.brand.name}
            </Link>
            <h1 className="mt-3 text-4xl font-bold leading-tight text-text-primary md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
              {product.name}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <p className="price text-2xl text-text-primary">{formatPrice(product.price)}</p>
              <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
                {getStatusLabel(product.status)}
              </span>
            </div>
            <p className="mt-6 leading-7 text-text-muted">{product.description}</p>
            <div className="mt-8">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-primary">Available Sizes</h2>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size.id}
                    disabled={!size.isAvailable}
                    onClick={() => setSelectedSize(size.size)}
                    className={cn(
                      "h-11 min-w-12 rounded-md border px-4 text-sm font-semibold transition-colors",
                      selectedSize === size.size ? "border-accent bg-accent text-background-primary" : "border-border bg-white hover:border-accent",
                      !size.isAvailable && "cursor-not-allowed opacity-40"
                    )}
                  >
                    UK {size.size}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-8">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-primary">Colors</h2>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <span key={color.id} className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-sm">
                    <span className="h-4 w-4 rounded-full border border-border" style={{ backgroundColor: color.hexCode || "#ccc" }} />
                    {color.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-8 rounded-lg border border-border bg-white p-5">
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-text-muted">Material</dt>
                  <dd className="font-semibold text-text-primary">{product.material || "Premium mixed materials"}</dd>
                </div>
                <div>
                  <dt className="text-text-muted">Category</dt>
                  <dd className="font-semibold text-text-primary">{product.category.name} / {product.subcategory.name}</dd>
                </div>
              </dl>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <Button asChild size="lg" className="sm:col-span-1">
                <a href={getWhatsAppUrl(product.name)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </Button>
              <Button type="button" variant="outline" size="lg" onClick={toggleWishlist}>
                <Heart className={cn("h-4 w-4", isWishlisted && "fill-current text-red-500")} />
                {isWishlisted ? "Saved" : "Wishlist"}
              </Button>
              <Button type="button" variant="outline" size="lg" onClick={handleCompare}>
                <Scale className={cn("h-4 w-4", isCompareAdded(product.id) && "text-accent")} />
                {isCompareAdded(product.id) ? "In Compare" : "Compare"}
              </Button>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white py-16">
        <div className="container-wide">
          <p className="eyebrow">More Options</p>
          <h2 className="section-title mt-3">Related Products</h2>
          <span className="golden-rule" />
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {relatedProducts.map((related, index) => (
              <ProductCard key={related.id} product={related} index={index} showWishlist={false} />
            ))}
          </div>
        </div>
      </section>
      <RecentlyViewed currentProductId={product.id} />
    </div>
  );
}
