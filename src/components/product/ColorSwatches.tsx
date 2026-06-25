"use client";

import { cn } from "@/lib/utils";
import type { ProductColorType } from "@/types";

interface ColorSwatchesProps {
  colors: ProductColorType[];
  selected: string;
  onSelect: (colorName: string) => void;
}

export default function ColorSwatches({
  colors,
  selected,
  onSelect,
}: ColorSwatchesProps) {
  if (!colors.length) return null;

  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-primary">
        Color
        {selected && (
          <span className="ml-2 font-normal normal-case tracking-normal text-text-muted">
            — {selected}
          </span>
        )}
      </h2>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <button
            key={color.id}
            type="button"
            onClick={() => onSelect(color.name)}
            className={cn(
              "relative flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200",
              selected === color.name
                ? "ring-2 ring-accent ring-offset-2"
                : "hover:ring-2 hover:ring-border hover:ring-offset-1"
            )}
            aria-label={`Color: ${color.name}`}
            title={color.name}
          >
            <span
              className="h-7 w-7 rounded-full border border-border/50"
              style={{ backgroundColor: color.hexCode || "#cccccc" }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
