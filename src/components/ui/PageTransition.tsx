"use client";

import { useState, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const curtainEase = [0.76, 0, 0.24, 1] as const;

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    if (pathname !== prevPathname) {
      setIsAnimating(true);
      setPrevPathname(pathname);

      // After curtain covers, swap children
      const swapTimeout = setTimeout(() => {
        setDisplayChildren(children);
      }, 600);

      // After full animation, reveal
      const revealTimeout = setTimeout(() => {
        setIsAnimating(false);
      }, 1400);

      return () => {
        clearTimeout(swapTimeout);
        clearTimeout(revealTimeout);
      };
    } else {
      setDisplayChildren(children);
    }
  }, [pathname, children, prevPathname]);

  return (
    <>
      <AnimatePresence>
        {isAnimating && !isMobile && (
          <motion.div
            key="curtain"
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{ backgroundColor: "#0A0A0A" }}
            initial={{ y: "-100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{
              duration: 0.6,
              ease: curtainEase,
            }}
          >
            <motion.span
              className="text-center"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "24px",
                color: "#C9933A",
                letterSpacing: "0.3em",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              DELHI SHOE PALACE
            </motion.span>
          </motion.div>
        )}

        {isAnimating && isMobile && (
          <motion.div
            key="curtain-mobile"
            className="fixed inset-0 z-[9999]"
            style={{ backgroundColor: "#0A0A0A" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: isAnimating ? 0.6 : 0 }}
      >
        {displayChildren}
      </motion.div>
    </>
  );
}
