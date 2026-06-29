import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <div className="space-y-6">
      {/* Top Bar Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-32 bg-[#242424]" />
          <Skeleton className="h-5 w-10 bg-[#242424] rounded-full" />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <Skeleton className="h-9 w-full md:w-60 bg-[#242424]" />
          <Skeleton className="h-9 w-32 bg-[#242424]" />
          <Skeleton className="h-9 w-32 bg-[#242424]" />
          <Skeleton className="h-9 w-32 bg-[#242424]" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-[#1A1A1A] border border-[#242424] rounded-2xl overflow-hidden">
        {/* Table Header */}
        <div className="bg-[#141414] h-10 border-b border-[#242424] flex items-center px-4 justify-between">
          <Skeleton className="h-3 w-4 bg-[#242424]" />
          <Skeleton className="h-3 w-10 bg-[#242424]" />
          <Skeleton className="h-3 w-36 bg-[#242424]" />
          <Skeleton className="h-3 w-16 bg-[#242424]" />
          <Skeleton className="h-3 w-16 bg-[#242424]" />
          <Skeleton className="h-3 w-14 bg-[#242424]" />
          <Skeleton className="h-3 w-14 bg-[#242424]" />
          <Skeleton className="h-3 w-10 bg-[#242424]" />
        </div>

        {/* Table Rows (10 rows) */}
        <div className="divide-y divide-[#242424]">
          {Array.from({ length: 10 }).map((_, idx) => (
            <div
              key={idx}
              className="h-16 flex items-center px-4 justify-between bg-[#141414] even:bg-[#161616]"
            >
              <Skeleton className="h-3 w-4 bg-[#242424]" />
              <Skeleton className="h-11 w-11 bg-[#242424] rounded-lg" />
              <div className="flex-1 max-w-md mx-6 space-y-2">
                <Skeleton className="h-3.5 w-3/4 bg-[#242424]" />
                <Skeleton className="h-2.5 w-1/2 bg-[#242424]" />
              </div>
              <Skeleton className="h-3 w-16 bg-[#242424]" />
              <Skeleton className="h-3 w-16 bg-[#242424]" />
              <Skeleton className="h-3.5 w-12 bg-[#242424]" />
              <Skeleton className="h-5 w-20 bg-[#242424] rounded-full" />
              <Skeleton className="h-3.5 w-8 bg-[#242424]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
