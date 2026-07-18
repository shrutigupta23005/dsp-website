export default function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl bg-card">
      {/* Image skeleton */}
      <div className="aspect-square animate-pulse bg-border/40" />
      {/* Info skeleton */}
      <div className="space-y-3 p-4">
        {/* Brand */}
        <div className="h-3 w-16 animate-pulse rounded bg-border/40" />
        {/* Name */}
        <div className="space-y-1.5">
          <div className="h-4 w-full animate-pulse rounded bg-border/40" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-border/40" />
        </div>
        {/* Price */}
        <div className="h-5 w-20 animate-pulse rounded bg-border/40" />
        {/* Color swatches */}
        <div className="flex gap-1.5">
          <div className="h-4 w-4 animate-pulse rounded-full bg-border/40" />
          <div className="h-4 w-4 animate-pulse rounded-full bg-border/40" />
          <div className="h-4 w-4 animate-pulse rounded-full bg-border/40" />
        </div>
      </div>
    </div>
  );
}
