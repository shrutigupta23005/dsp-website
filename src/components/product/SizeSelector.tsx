"use client";

import { cn } from "@/lib/utils";
import type { ProductSizeType } from "@/types";

interface SizeSelectorProps {
  sizes: ProductSizeType[];
  selected: string;
  onSelect: (size: string) => void;
}

export default function SizeSelector({
  sizes,
  selected,
  onSelect,
}: SizeSelectorProps) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-text-primary">
          Select Size
        </h2>
        <button
          type="button"
          className="text-xs font-medium text-accent transition-colors hover:text-accent-hover"
        >
          Size Guide
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((sizeItem) => (
          <button
            key={sizeItem.id}
            type="button"
            disabled={!sizeItem.isAvailable}
            onClick={() => onSelect(sizeItem.size)}
            className={cn(
              "flex h-11 min-w-[48px] items-center justify-center rounded-lg border px-4 font-mono text-sm font-semibold transition-all duration-200",
              selected === sizeItem.size
                ? "border-accent bg-accent text-background-primary"
                : sizeItem.isAvailable
                  ? "border-border bg-white text-text-primary hover:border-accent"
                  : "cursor-not-allowed border-border bg-muted text-text-muted line-through opacity-50"
            )}
            aria-label={`Size UK ${sizeItem.size}${!sizeItem.isAvailable ? " - unavailable" : ""}`}
          >
            UK {sizeItem.size}
          </button>
        ))}
      </div>
    </div>
  );
}
