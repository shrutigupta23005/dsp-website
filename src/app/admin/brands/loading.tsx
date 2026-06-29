import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function BrandsLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center h-12">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-24 bg-[#1A1A1A] rounded" />
          <Skeleton className="h-5 w-8 bg-[#1A1A1A] rounded-full" />
        </div>
        <Skeleton className="h-9 bg-[#1A1A1A] w-28 rounded" />
      </div>

      {/* Grid of 8 cards */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-[#1A1A1A] border border-[#242424] rounded-2xl p-5 h-[180px] flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <Skeleton className="w-12 h-12 rounded-full bg-[#242424]" />
            </div>
            <div className="space-y-2 flex-1 mt-3">
              <Skeleton className="h-4 w-1/2 bg-[#242424]" />
              <Skeleton className="h-3 w-5/6 bg-[#242424]" />
              <Skeleton className="h-3 w-4/6 bg-[#242424]" />
            </div>
            <div className="border-t border-[#242424] pt-3 flex items-center justify-between">
              <Skeleton className="h-3.5 w-16 bg-[#242424]" />
              <Skeleton className="h-3 w-16 bg-[#242424]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
