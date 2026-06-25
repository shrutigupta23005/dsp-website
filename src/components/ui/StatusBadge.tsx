import { cn } from "@/lib/utils";

type ProductStatus = "NEW_ARRIVAL" | "TRENDING" | "LIMITED" | "AVAILABLE";

interface StatusBadgeProps {
  status: ProductStatus;
  className?: string;
}

const STATUS_CONFIG: Record<
  ProductStatus,
  { label: string; color: string } | null
> = {
  NEW_ARRIVAL: {
    label: "New Arrival",
    color: "bg-blue-600/90 text-white",
  },
  TRENDING: {
    label: "Trending",
    color: "bg-amber-600/90 text-white",
  },
  LIMITED: {
    label: "Limited Stock",
    color: "bg-red-600/90 text-white",
  },
  AVAILABLE: null,
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  if (!config) return null;

  return (
    <span
      className={cn(
        "inline-block rounded px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider",
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
}
