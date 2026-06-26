"use client";

import { Scale } from "lucide-react";
import { useCompareStore } from "@/store/compareStore";
import { cn } from "@/lib/utils";
import type { ProductWithRelations } from "@/types";

interface AddToCompareButtonProps {
  product: ProductWithRelations;
}

export default function AddToCompareButton({ product }: AddToCompareButtonProps) {
  const { isAdded, add, remove, items } = useCompareStore();
  const isThisAdded = isAdded(product.id);
  const isFull = items.length >= 3;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isThisAdded) {
      remove(product.id);
    } else {
      add(product);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={!isThisAdded && isFull}
      title={!isThisAdded && isFull ? "Remove a product first" : undefined}
      className={cn(
        "flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium border transition-all duration-200",
        isThisAdded
          ? "border-accent text-accent bg-accent/5"
          : isFull
          ? "border-border text-text-muted cursor-not-allowed opacity-50"
          : "border-border text-text-muted hover:border-accent hover:text-accent"
      )}
      style={{ fontFamily: "var(--font-body)" }}
    >
      <Scale className="w-3 h-3" />
      {isThisAdded ? "Added ✓" : "Compare"}
    </button>
  );
}
