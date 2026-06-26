export default function WishlistLoading() {
  return (
    <div className="min-h-screen bg-background-secondary pt-28">
      <div className="container-wide pb-16">
        <div className="h-3 w-20 animate-pulse rounded bg-border/40" />
        <div className="mt-3 h-10 w-64 animate-pulse rounded bg-border/40" />
        <div className="mt-2 h-4 w-16 animate-pulse rounded bg-border/40" />
        <div className="mt-2 h-px w-16 animate-pulse bg-accent/40" />

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="overflow-hidden rounded-xl bg-white">
              <div className="aspect-square animate-pulse bg-border/40" />
              <div className="space-y-2 p-4">
                <div className="h-3 w-16 animate-pulse rounded bg-border/40" />
                <div className="h-4 w-full animate-pulse rounded bg-border/40" />
                <div className="h-5 w-20 animate-pulse rounded bg-border/40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
