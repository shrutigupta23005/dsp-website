"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { cn } from "@/lib/utils";
import type { BrandType, CategoryWithSubcategories } from "@/types";

interface FilterSidebarProps {
  categories: CategoryWithSubcategories[];
  brands: BrandType[];
}

const PRICE_RANGES = [
  { label: "Under ₹500", min: "0", max: "500" },
  { label: "₹500 – ₹1,500", min: "500", max: "1500" },
  { label: "₹1,500 – ₹3,000", min: "1500", max: "3000" },
  { label: "₹3,000 – ₹5,000", min: "3000", max: "5000" },
  { label: "Above ₹5,000", min: "5000", max: "" },
];

const SIZE_OPTIONS = ["6", "7", "8", "9", "10", "11", "12"];

const COLOR_OPTIONS = [
  { name: "Black", hex: "#1A1A1A" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Brown", hex: "#8B4513" },
  { name: "Blue", hex: "#1E40AF" },
  { name: "Red", hex: "#DC2626" },
  { name: "Grey", hex: "#9CA3AF" },
  { name: "Green", hex: "#16A34A" },
  { name: "Pink", hex: "#EC4899" },
];

export default function FilterSidebar({
  categories,
  brands,
}: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      const query = params.toString();
      router.push(query ? `/products?${query}` : "/products");
    },
    [router, searchParams]
  );

  const currentGender = searchParams.get("gender");
  const currentSubcategory = searchParams.get("subcategory");
  const currentBrand = searchParams.get("brand");
  const currentMinPrice = searchParams.get("minPrice");
  const currentMaxPrice = searchParams.get("maxPrice");
  const currentColor = searchParams.get("color");
  const currentSize = searchParams.get("size");

  const filteredSubcategories = categories
    .filter((c) => !currentGender || c.gender === currentGender)
    .flatMap((c) => c.subcategories);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-text-primary">
          Filters
        </h2>
        {searchParams.toString() && (
          <button
            onClick={() => router.push("/products")}
            className="text-xs font-medium text-accent transition-colors hover:text-accent-hover"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Category / Gender */}
      <FilterSection title="Category">
        <div className="space-y-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() =>
                updateParam(
                  "gender",
                  currentGender === category.gender ? null : category.gender
                )
              }
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors",
                currentGender === category.gender
                  ? "bg-accent text-background-primary font-semibold"
                  : "text-text-muted hover:bg-muted hover:text-text-primary"
              )}
            >
              <span>{category.name}</span>
              {category._count && (
                <span className="font-mono text-[10px] opacity-60">
                  {category._count.products}
                </span>
              )}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Subcategory */}
      {filteredSubcategories.length > 0 && (
        <FilterSection title="Subcategory">
          <div className="max-h-48 space-y-1 overflow-y-auto pr-1">
            {filteredSubcategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() =>
                  updateParam(
                    "subcategory",
                    currentSubcategory === sub.slug ? null : sub.slug
                  )
                }
                className={cn(
                  "flex w-full items-center rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  currentSubcategory === sub.slug
                    ? "bg-accent text-background-primary font-semibold"
                    : "text-text-muted hover:bg-muted hover:text-text-primary"
                )}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </FilterSection>
      )}

      {/* Brand */}
      <FilterSection title="Brand">
        <div className="max-h-48 space-y-1 overflow-y-auto pr-1">
          {brands.map((brand) => (
            <button
              key={brand.id}
              onClick={() =>
                updateParam(
                  "brand",
                  currentBrand === brand.slug ? null : brand.slug
                )
              }
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors",
                currentBrand === brand.slug
                  ? "bg-accent text-background-primary font-semibold"
                  : "text-text-muted hover:bg-muted hover:text-text-primary"
              )}
            >
              <span>{brand.name}</span>
              {brand._count && (
                <span className="font-mono text-[10px] opacity-60">
                  {brand._count.products}
                </span>
              )}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="space-y-1">
          {PRICE_RANGES.map((range) => {
            const isActive =
              currentMinPrice === range.min && currentMaxPrice === range.max;
            return (
              <button
                key={range.label}
                onClick={() => {
                  if (isActive) {
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete("minPrice");
                    params.delete("maxPrice");
                    params.delete("page");
                    const query = params.toString();
                    router.push(query ? `/products?${query}` : "/products");
                  } else {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("minPrice", range.min);
                    if (range.max) {
                      params.set("maxPrice", range.max);
                    } else {
                      params.delete("maxPrice");
                    }
                    params.delete("page");
                    router.push(`/products?${params.toString()}`);
                  }
                }}
                className={cn(
                  "flex w-full items-center rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  isActive
                    ? "bg-accent text-background-primary font-semibold"
                    : "text-text-muted hover:bg-muted hover:text-text-primary"
                )}
              >
                {range.label}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Color Swatches */}
      <FilterSection title="Color">
        <div className="flex flex-wrap gap-2">
          {COLOR_OPTIONS.map((color) => (
            <button
              key={color.name}
              onClick={() =>
                updateParam(
                  "color",
                  currentColor === color.name ? null : color.name
                )
              }
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full transition-all",
                currentColor === color.name
                  ? "ring-2 ring-accent ring-offset-2"
                  : "hover:ring-2 hover:ring-border hover:ring-offset-1"
              )}
              title={color.name}
              aria-label={`Filter by ${color.name}`}
            >
              <span
                className="h-6 w-6 rounded-full border border-border/40"
                style={{ backgroundColor: color.hex }}
              />
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Size Pills */}
      <FilterSection title="Size">
        <div className="flex flex-wrap gap-2">
          {SIZE_OPTIONS.map((size) => (
            <button
              key={size}
              onClick={() =>
                updateParam("size", currentSize === size ? null : size)
              }
              className={cn(
                "flex h-9 w-12 items-center justify-center rounded-lg border font-mono text-xs font-semibold transition-all",
                currentSize === size
                  ? "border-accent bg-accent text-background-primary"
                  : "border-border bg-white text-text-muted hover:border-accent hover:text-text-primary"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-border pt-4">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-text-primary">
        {title}
      </h3>
      {children}
    </div>
  );
}
