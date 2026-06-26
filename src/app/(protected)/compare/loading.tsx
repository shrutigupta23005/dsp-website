export default function CompareLoading() {
  return (
    <div className="min-h-screen bg-background-secondary pt-28">
      <div className="container-wide pb-16">
        <div className="h-3 w-32 animate-pulse rounded bg-border/40" />
        <div className="mt-3 h-10 w-72 animate-pulse rounded bg-border/40" />
        <div className="mt-2 h-px w-16 animate-pulse bg-accent/40" />

        <div className="mt-10 overflow-hidden rounded-xl border border-border bg-white">
          <div className="flex divide-x divide-border">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="flex-1 p-6">
                <div className="mx-auto h-40 w-full max-w-[200px] animate-pulse rounded-lg bg-border/40" />
                <div className="mt-3 mx-auto h-4 w-32 animate-pulse rounded bg-border/40" />
              </div>
            ))}
          </div>
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="flex items-center border-t border-border">
              <div className="w-40 p-5">
                <div className="h-4 w-20 animate-pulse rounded bg-border/40" />
              </div>
              {Array.from({ length: 3 }, (_, j) => (
                <div key={j} className="flex-1 p-5">
                  <div className="mx-auto h-4 w-24 animate-pulse rounded bg-border/40" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
