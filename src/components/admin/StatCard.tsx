"use client";

import React, { useEffect, useState } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: number;
    direction: "up" | "down";
    label: string;
  };
  description?: string;
  isLoading?: boolean;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
  isLoading = false,
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState<string | number>(
    typeof value === "number" ? 0 : value
  );

  useEffect(() => {
    if (isLoading) return;

    if (typeof value !== "number") {
      setDisplayValue(value);
      return;
    }

    let startTimestamp: number | null = null;
    const duration = 1500; // 1.5s

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutCubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeProgress * value);

      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    const animId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animId);
  }, [value, isLoading]);

  if (isLoading) {
    return (
      <div className="bg-[#1A1A1A] border border-[#242424] rounded-2xl p-6 h-36 flex flex-col justify-between animate-pulse">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24 bg-[#242424]" />
          <Skeleton className="h-5 w-5 rounded-full bg-[#242424]" />
        </div>
        <Skeleton className="h-10 w-20 bg-[#242424]" />
        <Skeleton className="h-3 w-32 bg-[#242424]" />
      </div>
    );
  }

  // Formatting helper for numbers
  const formattedDisplay =
    typeof displayValue === "number"
      ? displayValue.toLocaleString("en-IN")
      : displayValue;

  return (
    <div className="relative bg-[#1A1A1A] border border-[#242424] hover:border-[#C9933A]/30 rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:shadow-[0_0_15px_rgba(201,147,58,0.05)] group">
      {/* Big Decorative Background Icon */}
      <Icon className="absolute -right-4 -top-4 w-24 h-24 text-[#C9933A] opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-500" />

      <div className="flex flex-col h-full justify-between">
        {/* Title + Small Icon */}
        <div className="flex items-center justify-between z-10">
          <span className="text-[11px] font-mono text-[#6B6B6B] uppercase tracking-widest">
            {title}
          </span>
          <Icon className="w-[18px] h-[18px] text-[#C9933A]" />
        </div>

        {/* Value */}
        <div className="mt-4 z-10">
          <h2 className="text-4xl font-bold font-mono text-[#F5F5F5] tracking-tight">
            {formattedDisplay}
          </h2>
        </div>

        {/* Footer: Trend or Description */}
        <div className="mt-3 text-xs z-10 flex items-center gap-2">
          {trend ? (
            <span
              className={cn(
                "flex items-center gap-1 font-mono font-semibold",
                trend.direction === "up" ? "text-[#22C55E]" : "text-[#EF4444]"
              )}
            >
              {trend.direction === "up" ? "↑" : "↓"} {trend.value}%
              <span className="text-[#6B6B6B] font-sans font-normal ml-0.5">
                {trend.label}
              </span>
            </span>
          ) : (
            description && <span className="text-[#6B6B6B] font-sans">{description}</span>
          )}
        </div>
      </div>
    </div>
  );
}
