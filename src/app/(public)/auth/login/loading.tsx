export default function LoginLoading() {
  return (
    <div className="space-y-4">
      <div className="mx-auto h-8 w-48 animate-pulse rounded bg-border/40" />
      <div className="mx-auto h-4 w-56 animate-pulse rounded bg-border/40" />
      <div className="mt-8 space-y-4">
        <div className="h-11 animate-pulse rounded-lg bg-border/40" />
        <div className="h-11 animate-pulse rounded-lg bg-border/40" />
        <div className="h-11 animate-pulse rounded-lg bg-border/40" />
      </div>
    </div>
  );
}
