"use client";

import { useRef, useState, useCallback, type ReactNode } from "react";

interface WebGLImageDistortionProps {
  children: ReactNode;
  className?: string;
}

/**
 * Product image container with CSS-based hover distortion effect.
 * Uses CSS transforms as a performant alternative to WebGL shaders.
 * Falls back gracefully — the children (next/image) render normally.
 */
export default function WebGLImageDistortion({
  children,
  className = "",
}: WebGLImageDistortionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      setTransform(
        `perspective(800px) rotateY(${x * 3}deg) rotateX(${-y * 3}deg) scale(1.02)`
      );
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setTransform("");
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-xl ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div
        style={{
          transform: transform || "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)",
          transition: transform ? "transform 0.1s ease-out" : "transform 0.4s ease-out",
          transformOrigin: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
}
