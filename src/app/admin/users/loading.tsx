import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function UsersLoading() {
  return (
    <div className="space-y-6">
      {/* 3 mini stat cards skeleton */}
      <div className="grid gap-6 grid-cols-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-[#1A1A1A] border border-[#242424] rounded-2xl p-5 flex items-center justify-between h-20"
          >
            <div className="space-y-2">
              <Skeleton className="h-3 w-28 bg-[#242424]" />
              <Skeleton className="h-6 w-12 bg-[#242424]" />
            </div>
            <Skeleton className="h-6 w-6 bg-[#242424]" />
          </div>
        ))}
      </div>

      {/* Filter Bar Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-28 bg-[#242424]" />
          <Skeleton className="h-5 w-8 bg-[#242424] rounded-full" />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Skeleton className="h-9 w-60 bg-[#242424]" />
          <Skeleton className="h-9 w-40 bg-[#242424]" />
          <Skeleton className="h-9 w-28 bg-[#242424]" />
        </div>
      </div>

      {/* Table Skeleton (8 rows) */}
      <div className="bg-[#1A1A1A] border border-[#242424] rounded-2xl overflow-hidden">
        {/* Table Header */}
        <div className="bg-[#141414] h-10 border-b border-[#242424] flex items-center px-4 justify-between">
          <Skeleton className="h-3 w-28 bg-[#242424]" />
          <Skeleton className="h-3 w-10 bg-[#242424]" />
          <Skeleton className="h-3 w-12 bg-[#242424]" />
          <Skeleton className="h-3 w-16 bg-[#242424]" />
          <Skeleton className="h-3 w-16 bg-[#242424]" />
          <Skeleton className="h-3 w-16 bg-[#242424]" />
          <Skeleton className="h-3 w-8 bg-[#242424]" />
        </div>

        {/* Table Rows (8 rows) */}
        <div className="divide-y divide-[#242424]">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="h-16 flex items-center px-4 justify-between bg-[#141414] even:bg-[#161616]"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 bg-[#242424] rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-24 bg-[#242424]" />
                  <Skeleton className="h-2.5 w-32 bg-[#242424]" />
                </div>
              </div>
              <Skeleton className="h-4.5 w-12 bg-[#242424] rounded" />
              <Skeleton className="h-4 w-14 bg-[#242424]" />
              <Skeleton className="h-3.5 w-6 bg-[#242424]" />
              <Skeleton className="h-3.5 w-6 bg-[#242424]" />
              <Skeleton className="h-3 w-16 bg-[#242424]" />
              <Skeleton className="h-4.5 w-14 bg-[#242424]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
