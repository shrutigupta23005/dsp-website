export default function ProductDetailSkeleton() {
  return (
    <div className="bg-background-secondary pt-28">
      <section className="container-wide pb-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left: Image gallery */}
          <div className="space-y-3">
            <div className="aspect-square animate-pulse rounded-xl bg-border/40" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }, (_, i) => (
                <div
                  key={i}
                  className="aspect-square w-20 animate-pulse rounded-lg bg-border/40"
                />
              ))}
            </div>
          </div>

          {/* Right: Product info */}
          <div className="space-y-6">
            {/* Brand */}
            <div className="h-3 w-24 animate-pulse rounded bg-border/40" />
            {/* Name */}
            <div className="space-y-2">
              <div className="h-10 w-3/4 animate-pulse rounded bg-border/40" />
              <div className="h-10 w-1/2 animate-pulse rounded bg-border/40" />
            </div>
            {/* Price + badge */}
            <div className="flex items-center gap-3">
              <div className="h-7 w-28 animate-pulse rounded bg-border/40" />
              <div className="h-6 w-20 animate-pulse rounded-full bg-border/40" />
            </div>
            {/* Description */}
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-border/40" />
              <div className="h-4 w-full animate-pulse rounded bg-border/40" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-border/40" />
            </div>
            {/* Sizes */}
            <div>
              <div className="mb-3 h-4 w-24 animate-pulse rounded bg-border/40" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 6 }, (_, i) => (
                  <div
                    key={i}
                    className="h-11 w-14 animate-pulse rounded-lg bg-border/40"
                  />
                ))}
              </div>
            </div>
            {/* Colors */}
            <div>
              <div className="mb-3 h-4 w-16 animate-pulse rounded bg-border/40" />
              <div className="flex gap-3">
                {Array.from({ length: 4 }, (_, i) => (
                  <div
                    key={i}
                    className="h-8 w-8 animate-pulse rounded-full bg-border/40"
                  />
                ))}
              </div>
            </div>
            {/* Buttons */}
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="h-12 animate-pulse rounded-lg bg-border/40" />
              <div className="h-12 animate-pulse rounded-lg bg-border/40" />
              <div className="h-12 animate-pulse rounded-lg bg-border/40" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
