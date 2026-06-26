"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useCompareStore } from "@/store/compareStore";

export default function CompareBar() {
  const router = useRouter();
  const { items, remove, clear } = useCompareStore();

  if (items.length < 2) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        exit={{ y: 80 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#1A1A1A] border-t border-white/10"
      >
        <div className="container-wide flex items-center justify-between h-20 px-6">
          {/* Left: Label */}
          <p
            className="text-white text-sm"
            style={{ fontFamily: "var(--font-utility)" }}
          >
            Comparing {items.length} products
          </p>

          {/* Center: Product slots */}
          <div className="hidden sm:flex items-center gap-3">
            {[0, 1, 2].map((index) => {
              const item = items[index];
              if (item) {
                const primaryImage = item.images?.find((img) => img.type === "PRIMARY") || item.images?.[0];
                return (
                  <div key={item.id} className="relative flex items-center gap-2">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white/10">
                      {primaryImage && (
                        <Image
                          src={primaryImage.url}
                          alt={item.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <span className="text-white text-xs max-w-[120px] truncate">
                      {item.name}
                    </span>
                    <button
                      onClick={() => remove(item.id)}
                      className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    >
                      <X className="w-3 h-3 text-white/70" />
                    </button>
                  </div>
                );
              }
              return (
                <div
                  key={`empty-${index}`}
                  className="w-12 h-12 rounded-lg border-2 border-dashed border-white/20"
                />
              );
            })}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/compare")}
              className="px-5 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Compare Now
            </button>
            <button
              onClick={clear}
              className="text-sm text-white/50 hover:text-white/80 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
