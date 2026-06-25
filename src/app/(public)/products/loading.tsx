import ProductGridSkeleton from "@/components/skeletons/ProductGridSkeleton";

export default function ProductsLoading() {
  return (
    <div className="bg-background-secondary pt-28">
      <section className="container-wide pb-16">
        <div className="mb-10">
          <div className="h-3 w-24 animate-pulse rounded bg-border/40" />
          <div className="mt-3 h-12 w-64 animate-pulse rounded bg-border/40" />
          <div className="mt-4 h-0.5 w-24 animate-pulse bg-border/40" />
        </div>
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-4 rounded-lg border border-border bg-white p-5">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 w-16 animate-pulse rounded bg-border/40" />
                  <div className="h-8 w-full animate-pulse rounded bg-border/40" />
                  <div className="h-8 w-full animate-pulse rounded bg-border/40" />
                </div>
              ))}
            </div>
          </aside>
          <ProductGridSkeleton />
        </div>
      </section>
    </div>
  );
}
