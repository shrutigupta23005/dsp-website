"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Filter, Lock, X } from "lucide-react";
import { toast } from "sonner";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { BrandType, CategoryWithSubcategories, ProductWithRelations } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  products: ProductWithRelations[];
  categories: CategoryWithSubcategories[];
  brands: BrandType[];
  isAuthenticated: boolean;
  wishlistedIds: string[];
  initialFilters: Record<string, string>;
  isLimited: boolean;
}

function FilterPanel({
  categories,
  brands,
  initialFilters,
}: {
  categories: CategoryWithSubcategories[];
  brands: BrandType[];
  initialFilters: Record<string, string>;
}) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-primary">Gender</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={buildHref(initialFilters, { gender: category.gender, category: category.slug })}
              className={cn("block rounded-md px-3 py-2 text-sm", initialFilters.gender === category.gender ? "bg-accent text-background-primary" : "hover:bg-muted")}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-primary">Subcategory</h3>
        <div className="max-h-64 space-y-2 overflow-auto pr-1">
          {categories.flatMap((category) => category.subcategories).map((subcategory) => (
            <Link
              key={subcategory.id}
              href={buildHref(initialFilters, { subcategory: subcategory.slug })}
              className={cn("block rounded-md px-3 py-2 text-sm", initialFilters.subcategory === subcategory.slug ? "bg-accent text-background-primary" : "hover:bg-muted")}
            >
              {subcategory.name}
            </Link>
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-primary">Brand</h3>
        <div className="max-h-64 space-y-2 overflow-auto pr-1">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={buildHref(initialFilters, { brand: brand.slug })}
              className={cn("block rounded-md px-3 py-2 text-sm", initialFilters.brand === brand.slug ? "bg-accent text-background-primary" : "hover:bg-muted")}
            >
              {brand.name}
            </Link>
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-primary">Price</h3>
        <div className="space-y-2">
          {PRICE_RANGES.map((range) => (
            <Link
              key={range.label}
              href={buildHref(initialFilters, { minPrice: range.minPrice, maxPrice: range.maxPrice || null })}
              className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
            >
              {range.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Popular" },
  { value: "price-asc", label: "Price Low-High" },
  { value: "price-desc", label: "Price High-Low" },
];

const PRICE_RANGES = [
  { label: "Under Rs. 500", minPrice: "1", maxPrice: "500" },
  { label: "Rs. 500-1500", minPrice: "500", maxPrice: "1500" },
  { label: "Rs. 1500-3000", minPrice: "1500", maxPrice: "3000" },
  { label: "Rs. 3000+", minPrice: "3000", maxPrice: "" },
];

function buildHref(filters: Record<string, string>, updates: Record<string, string | null>) {
  const params = new URLSearchParams(filters);
  Object.entries(updates).forEach(([key, value]) => {
    if (value) params.set(key, value);
    else params.delete(key);
  });
  params.delete("page");
  const query = params.toString();
  return query ? `/products?${query}` : "/products";
}

export default function ProductListingClient({
  products,
  categories,
  brands,
  isAuthenticated,
  wishlistedIds: initialWishlistedIds,
  initialFilters,
  isLimited,
}: Props) {
  const [wishlistedIds, setWishlistedIds] = useState(initialWishlistedIds);

  const activeChips = useMemo(
    () =>
      Object.entries(initialFilters).filter(
        ([key, value]) => value && !["page", "limit"].includes(key)
      ),
    [initialFilters]
  );

  const toggleWishlist = async (productId: string) => {
    if (!isAuthenticated) {
      toast.error("Please login to use wishlist");
      return;
    }
    const isWishlisted = wishlistedIds.includes(productId);
    setWishlistedIds((prev) =>
      isWishlisted ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
    try {
      const res = await fetch(isWishlisted ? `/api/wishlist/${productId}` : "/api/wishlist", {
        method: isWishlisted ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: isWishlisted ? undefined : JSON.stringify({ productId }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setWishlistedIds((prev) =>
        isWishlisted ? [...prev, productId] : prev.filter((id) => id !== productId)
      );
      toast.error("Wishlist update failed");
    }
  };

  return (
    <div className="bg-background-secondary pt-28">
      <section className="container-wide pb-16">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Digital Catalog</p>
            <h1 className="section-title mt-3">Browse Footwear</h1>
            <span className="golden-rule" />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-2xl">
                <SheetHeader>
                  <SheetTitle>Filter Products</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterPanel categories={categories} brands={brands} initialFilters={initialFilters} />
                </div>
              </SheetContent>
            </Sheet>
            <select
              value={initialFilters.sort || "newest"}
              onChange={(event) => {
                window.location.href = buildHref(initialFilters, { sort: event.target.value });
              }}
              className="h-10 rounded-md border border-border bg-background px-3 text-sm text-text-primary"
              aria-label="Sort products"
            >
              {SORTS.map((sort) => (
                <option key={sort.value} value={sort.value}>
                  {sort.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {activeChips.length ? (
          <div className="mb-8 flex flex-wrap gap-2">
            {activeChips.map(([key, value]) => (
              <Link
                key={key}
                href={buildHref(initialFilters, { [key]: null })}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-text-muted"
              >
                {key}: {value}
                <X className="h-3 w-3" />
              </Link>
            ))}
            <Link href="/products" className="inline-flex items-center rounded-full bg-background-primary px-3 py-1 text-xs text-white">
              Clear all
            </Link>
          </div>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-lg border border-border bg-card p-5">
              <FilterPanel categories={categories} brands={brands} initialFilters={initialFilters} />
            </div>
          </aside>
          <div>
            {products.length ? (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
                {products.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    isWishlisted={wishlistedIds.includes(product.id)}
                    onWishlistToggle={toggleWishlist}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border bg-card p-12 text-center">
                <p className="eyebrow">No Matches</p>
                <h2 className="mt-3 text-2xl font-semibold text-text-primary">Try a different filter set</h2>
                <p className="mt-3 text-text-muted">The catalog has plenty more pairs waiting in other categories.</p>
                <Button asChild className="mt-6">
                  <Link href="/products">Reset Filters</Link>
                </Button>
              </div>
            )}
            {isLimited ? (
              <div className="relative mt-8 overflow-hidden rounded-lg border border-border bg-card p-10 text-center">
                <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background-secondary to-transparent" />
                <Lock className="mx-auto h-8 w-8 text-accent" />
                <h2 className="mt-4 text-2xl font-semibold text-text-primary">Login to unlock the full catalog</h2>
                <p className="mx-auto mt-2 max-w-xl text-sm text-text-muted">
                  Guests can preview the first 15 products. Sign in to see every pair, save favorites, compare products, and get recommendations.
                </p>
                <Button asChild className="mt-6">
                  <Link href="/auth/login?callbackUrl=/products">Unlock Catalog</Link>
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
