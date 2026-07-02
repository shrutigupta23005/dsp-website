"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import KineticText from "@/components/ui/KineticText";
import MagneticButton from "@/components/ui/MagneticButton";
import NoiseOverlay from "@/components/ui/NoiseOverlay";

const ParticleField = dynamic(
  () => import("@/components/three/ParticleField"),
  { ssr: false }
);

export default function NotFoundClient() {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#0A0A0A" }}
    >
      {/* Particle background */}
      <ParticleField />
      <NoiseOverlay />

      {/* Decorative 404 */}
      <span
        className="absolute select-none pointer-events-none"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(120px, 30vw, 240px)",
          color: "#F5F5F5",
          opacity: 0.03,
          lineHeight: 1,
        }}
      >
        404
      </span>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-lg">
        {/* Gold rule */}
        <motion.div
          className="w-12 h-px mx-auto mb-6"
          style={{ backgroundColor: "#C9933A" }}
          initial={{ width: 0 }}
          animate={{ width: 48 }}
          transition={{ duration: 0.6 }}
        />

        <p
          className="text-[12px] uppercase tracking-[0.3em] mb-6"
          style={{
            color: "#C9933A",
            fontFamily: "var(--font-dm-mono, var(--font-utility))",
          }}
        >
          Page Not Found
        </p>

        <KineticText
          text="Looks like this shoe walked away."
          tag="h1"
          className="text-3xl md:text-[40px] font-bold text-white leading-tight mb-6"
        />

        <motion.p
          className="text-base leading-relaxed mb-10"
          style={{ color: "#6B6B6B", fontFamily: "var(--font-body)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been
          moved.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <MagneticButton>
            <Link
              href="/"
              className="inline-flex items-center h-12 px-8 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: "#C9933A",
                color: "#0A0A0A",
              }}
            >
              Back to Home
            </Link>
          </MagneticButton>
          <MagneticButton>
            <Link
              href="/products"
              className="inline-flex items-center h-12 px-8 rounded-lg text-sm font-medium border transition-colors hover:border-white/40"
              style={{
                borderColor: "rgba(255,255,255,0.2)",
                color: "#F5F5F5",
              }}
            >
              Browse Products
            </Link>
          </MagneticButton>
        </motion.div>
      </div>

      {/* Bottom marquee */}
      <div
        className="absolute bottom-0 left-0 right-0 h-10 flex items-center overflow-hidden"
        style={{ borderTop: "1px solid #1E1E1E" }}
      >
        <div className="marquee-track whitespace-nowrap">
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className="inline-block text-[11px] uppercase tracking-[0.15em] mx-4"
              style={{
                color: "#3A3A3A",
                fontFamily: "var(--font-dm-mono, var(--font-utility))",
              }}
            >
              DELHI SHOE PALACE • 24 YEARS OF TRUST • 200+ BRANDS •
              5000+ HAPPY CUSTOMERS •{" "}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
