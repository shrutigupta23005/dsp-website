export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-background-secondary pt-28">
      <div className="container-wide pb-16 max-w-3xl mx-auto">
        {/* Hero Card skeleton */}
        <div className="rounded-2xl bg-[#0A0A0A] p-12 text-center">
          <div className="w-20 h-20 rounded-full animate-pulse bg-white/10 mx-auto" />
          <div className="mt-4 mx-auto h-8 w-48 animate-pulse rounded bg-white/10" />
          <div className="mt-2 mx-auto h-4 w-36 animate-pulse rounded bg-white/10" />
          <div className="mt-4 flex justify-center gap-6">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="text-center">
                <div className="h-6 w-8 mx-auto animate-pulse rounded bg-white/10" />
                <div className="mt-1 h-3 w-12 mx-auto animate-pulse rounded bg-white/10" />
              </div>
            ))}
          </div>
        </div>

        {/* Form skeleton */}
        <div className="mt-8 rounded-xl border border-border bg-white p-8">
          <div className="h-5 w-28 animate-pulse rounded bg-border/40 mb-4" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="h-11 animate-pulse rounded-lg bg-border/40" />
            <div className="h-11 animate-pulse rounded-lg bg-border/40" />
          </div>
        </div>

        {/* Quick links skeleton */}
        <div className="mt-8 rounded-xl border border-border bg-white">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-border last:border-0">
              <div className="w-5 h-5 animate-pulse rounded bg-border/40" />
              <div className="flex-1 h-4 animate-pulse rounded bg-border/40" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
