import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriesLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center h-12">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-32 bg-[#1A1A1A] rounded" />
          <Skeleton className="h-5 w-8 bg-[#1A1A1A] rounded-full" />
        </div>
        <Skeleton className="h-9 bg-[#1A1A1A] w-28 rounded" />
      </div>

      {/* Accordions (3 skeletons) */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-[#1A1A1A] border border-[#242424] rounded-2xl p-5 flex items-center justify-between h-[68px]"
          >
            <div className="flex items-center gap-3 flex-1">
              <Skeleton className="h-4 w-4 bg-[#242424]" />
              <Skeleton className="h-5 w-12 bg-[#242424] rounded-full" />
              <Skeleton className="h-4.5 w-32 bg-[#242424]" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-3.5 w-24 bg-[#242424]" />
              <Skeleton className="h-3.5 w-16 bg-[#242424]" />
              <Skeleton className="h-6 w-16 bg-[#242424]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
