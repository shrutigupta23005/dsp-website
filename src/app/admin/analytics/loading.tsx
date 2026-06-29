import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center h-12">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48 bg-[#1A1A1A] rounded" />
          <Skeleton className="h-4 w-32 bg-[#1A1A1A] rounded" />
        </div>
        <Skeleton className="h-9 bg-[#1A1A1A] w-64 rounded" />
      </div>

      {/* 4 KPI cards skeleton */}
      <div className="grid gap-6 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-[#1A1A1A] border border-[#242424] rounded-2xl p-6 h-36 flex flex-col justify-between"
          >
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24 bg-[#242424]" />
              <Skeleton className="h-5 w-5 bg-[#242424] rounded-full" />
            </div>
            <Skeleton className="h-10 w-20 bg-[#242424]" />
            <Skeleton className="h-3 w-36 bg-[#242424]" />
          </div>
        ))}
      </div>

      {/* Row 2: 2 large chart area skeletons */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-96 bg-[#1A1A1A] rounded-2xl p-6 border border-[#242424] lg:col-span-2 flex flex-col justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-40 bg-[#242424]" />
            <Skeleton className="h-3.5 w-60 bg-[#242424]" />
          </div>
          <Skeleton className="h-[280px] w-full bg-[#242424] rounded-xl" />
        </div>

        <div className="h-96 bg-[#1A1A1A] rounded-2xl p-6 border border-[#242424] flex flex-col justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-36 bg-[#242424]" />
            <Skeleton className="h-3.5 w-48 bg-[#242424]" />
          </div>
          <Skeleton className="h-44 w-full bg-[#242424] rounded-full max-w-[176px] mx-auto" />
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-full bg-[#242424]" />
            <Skeleton className="h-3.5 w-5/6 bg-[#242424]" />
          </div>
        </div>
      </div>

      {/* Row 3: 2 table skeletons */}
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, tableIdx) => (
          <div
            key={tableIdx}
            className="bg-[#1A1A1A] border border-[#242424] rounded-2xl p-6 space-y-4"
          >
            <Skeleton className="h-5 w-48 bg-[#242424]" />
            <div className="space-y-2">
              <div className="h-8 bg-[#141414] rounded w-full" />
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="flex justify-between items-center h-10 border-b border-[#242424]/50">
                  <Skeleton className="h-4 w-6 bg-[#242424]" />
                  <Skeleton className="h-4 w-32 bg-[#242424]" />
                  <Skeleton className="h-4 w-12 bg-[#242424]" />
                  <Skeleton className="h-4 w-8 bg-[#242424]" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
