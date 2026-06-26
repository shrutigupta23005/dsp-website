export default function QuizLoading() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4 py-28">
      <div className="w-full max-w-xl">
        <div className="mb-10">
          <div className="flex items-center justify-between mb-2">
            <div className="h-3 w-20 animate-pulse rounded bg-white/10" />
            <div className="h-3 w-8 animate-pulse rounded bg-white/10" />
          </div>
          <div className="h-1 w-full bg-white/10 rounded-full" />
        </div>
        <div className="mx-auto h-10 w-72 animate-pulse rounded bg-white/10 mb-10" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl border-2 border-white/10 bg-white/5" />
          ))}
        </div>
      </div>
    </div>
  );
}
