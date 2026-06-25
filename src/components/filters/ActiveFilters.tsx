"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const FILTER_LABELS: Record<string, string> = {
  gender: "Category",
  subcategory: "Subcategory",
  brand: "Brand",
  minPrice: "Min Price",
  maxPrice: "Max Price",
  color: "Color",
  size: "Size",
  search: "Search",
  sort: "Sort",
  status: "Status",
};

const EXCLUDED_KEYS = new Set(["page", "limit"]);

export default function ActiveFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeFilters = useMemo(() => {
    const filters: { key: string; value: string; label: string }[] = [];
    searchParams.forEach((value, key) => {
      if (!EXCLUDED_KEYS.has(key) && value) {
        filters.push({
          key,
          value,
          label: FILTER_LABELS[key] || key,
        });
      }
    });
    return filters;
  }, [searchParams]);

  const removeFilter = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(key);
      params.delete("page");
      const query = params.toString();
      router.push(query ? `/products?${query}` : "/products");
    },
    [router, searchParams]
  );

  const clearAll = useCallback(() => {
    router.push("/products");
  }, [router]);

  if (!activeFilters.length) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      <AnimatePresence mode="popLayout">
        {activeFilters.map(({ key, value, label }) => (
          <motion.button
            key={key}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={() => removeFilter(key)}
            className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs text-text-muted transition-colors hover:border-accent hover:text-accent"
          >
            <span className="font-medium text-text-primary">{label}:</span>
            <span>{value}</span>
            <X className="h-3 w-3 opacity-50 transition-opacity group-hover:opacity-100" />
          </motion.button>
        ))}

        <motion.button
          layout
          key="clear-all"
          onClick={clearAll}
          className="rounded-full bg-background-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-background-primary/80"
        >
          Clear All
        </motion.button>
      </AnimatePresence>
    </div>
  );
}
