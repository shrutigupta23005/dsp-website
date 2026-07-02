"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

interface MagneticButtonProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

export default function MagneticButton({
  children,
  strength = 0.4,
  className = "",
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouchState] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const innerX = useMotionValue(0);
  const innerY = useMotionValue(0);
  const springInnerX = useSpring(innerX, { stiffness: 150, damping: 15 });
  const springInnerY = useSpring(innerY, { stiffness: 150, damping: 15 });

  // Check on first render
  if (typeof window !== "undefined" && !isTouch) {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse && !isTouch) setIsTouchState(true);
  }

  if (isTouch) {
    return <div className={className}>{children}</div>;
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    x.set(dx * strength);
    y.set(dy * strength);
    innerX.set(dx * strength * 0.5);
    innerY.set(dy * strength * 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    innerX.set(0);
    innerY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor="magnetic"
    >
      <motion.div style={{ x: springInnerX, y: springInnerY }}>
        {children}
      </motion.div>
    </motion.div>
  );
}
