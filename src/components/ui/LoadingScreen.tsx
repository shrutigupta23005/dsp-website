"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const loaded = sessionStorage.getItem("dsp_loaded");
    if (!loaded) {
      setShow(true);
      const timeout = setTimeout(() => {
        setShow(false);
        sessionStorage.setItem("dsp_loaded", "1");
      }, 2500);
      return () => clearTimeout(timeout);
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loading-screen"
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center"
          style={{ backgroundColor: "#0A0A0A" }}
          exit={{
            opacity: 0,
            y: -20,
            transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          {/* Lines growing from center */}
          <div className="flex items-center gap-2 mb-6">
            <motion.div
              className="h-px"
              style={{ backgroundColor: "#C9933A" }}
              initial={{ width: 0 }}
              animate={{ width: 60 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
            <motion.div
              className="h-px"
              style={{ backgroundColor: "#C9933A" }}
              initial={{ width: 0 }}
              animate={{ width: 60 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>

          {/* DSP letters */}
          <div className="flex mb-4">
            {"DSP".split("").map((letter, i) => (
              <motion.span
                key={i}
                className="inline-block overflow-hidden"
                style={{
                  fontFamily: "var(--font-dm-mono, var(--font-utility))",
                  fontSize: "14px",
                  color: "#C9933A",
                  letterSpacing: "0.5em",
                }}
              >
                <motion.span
                  className="inline-block"
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  transition={{
                    duration: 0.4,
                    delay: 0.4 + i * 0.1,
                    ease: [0.76, 0, 0.24, 1],
                  }}
                >
                  {letter}
                </motion.span>
              </motion.span>
            ))}
          </div>

          {/* Full name */}
          <div className="overflow-hidden mb-3">
            <motion.p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                color: "#F5F5F5",
              }}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.8,
                ease: [0.76, 0, 0.24, 1],
              }}
            >
              Delhi Shoe Palace
            </motion.p>
          </div>

          {/* EST. 2001 */}
          <motion.p
            style={{
              fontFamily: "var(--font-dm-mono, var(--font-utility))",
              fontSize: "11px",
              color: "#3A3A3A",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.3 }}
          >
            EST. 2001
          </motion.p>

          {/* Progress bar */}
          <motion.div
            className="mt-6 h-px max-w-[128px]"
            style={{ backgroundColor: "#C9933A" }}
            initial={{ width: 0 }}
            animate={{ width: 128 }}
            transition={{ delay: 1.8, duration: 0.4, ease: "easeOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
