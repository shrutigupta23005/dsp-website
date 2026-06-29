import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* 4 KPI cards skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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

      {/* 2 chart cards skeleton */}
      <div className="grid gap-6 lg:grid-cols-10">
        <div className="lg:col-span-6 bg-[#1A1A1A] border border-[#242424] rounded-2xl p-6 h-[380px] flex flex-col justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-40 bg-[#242424]" />
            <Skeleton className="h-3.5 w-60 bg-[#242424]" />
          </div>
          <Skeleton className="h-[260px] w-full bg-[#242424] rounded-xl" />
        </div>
        <div className="lg:col-span-4 bg-[#1A1A1A] border border-[#242424] rounded-2xl p-6 h-[380px] flex flex-col justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-36 bg-[#242424]" />
            <Skeleton className="h-3.5 w-48 bg-[#242424]" />
          </div>
          <div className="space-y-3 mt-4">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 bg-[#242424] rounded" />
                <Skeleton className="h-10 w-10 bg-[#242424] rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-3/4 bg-[#242424]" />
                  <Skeleton className="h-2.5 w-1/2 bg-[#242424]" />
                </div>
                <Skeleton className="h-6 w-8 bg-[#242424]" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3 Skeletons */}
      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, colIdx) => (
          <div
            key={colIdx}
            className="bg-[#1A1A1A] border border-[#242424] rounded-2xl p-6 h-80 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <Skeleton className="h-5 w-36 bg-[#242424]" />
              <Skeleton className="h-3.5 w-48 bg-[#242424]" />
            </div>
            <div className="space-y-3 mt-4 flex-1">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 bg-[#242424] rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-1/2 bg-[#242424]" />
                    <Skeleton className="h-2.5 w-3/4 bg-[#242424]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
