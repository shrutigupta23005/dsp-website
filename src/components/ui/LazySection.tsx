"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";

interface LazySectionProps {
  children: ReactNode;
  threshold?: number;
  rootMargin?: string;
  estimatedHeight?: number;
  className?: string;
}

export default function LazySection({
  children,
  threshold = 0.1,
  rootMargin = "100px",
  estimatedHeight = 400,
  className = "",
}: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <div ref={ref} className={className}>
      {isVisible ? (
        children
      ) : (
        <div style={{ minHeight: estimatedHeight }} aria-hidden="true" />
      )}
    </div>
  );
}
