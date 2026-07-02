"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import KineticText from "@/components/ui/KineticText";

interface CategoryData {
  name: string;
  slug: string;
  image: string;
  number: string;
  count: string;
}

const CATEGORIES: CategoryData[] = [
  {
    name: "Men",
    slug: "MEN",
    image:
      "https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=800&q=80",
    number: "No. 01",
    count: "120+ styles",
  },
  {
    name: "Women",
    slug: "WOMEN",
    image:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80",
    number: "No. 02",
    count: "80+ styles",
  },
  {
    name: "Kids",
    slug: "KIDS",
    image:
      "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&q=80",
    number: "No. 03",
    count: "50+ styles",
  },
];

const BRANDS = [
  "Nike",
  "Adidas",
  "Puma",
  "Bata",
  "Woodland",
  "Skechers",
  "Red Tape",
];

export default function CategoryGrid() {
  return (
    <section
      className="bg-[#0A0A0A]"
      id="category-grid"
    >
      {/* Section Header */}
      <div className="container-wide py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          <span
            className="text-[11px] uppercase tracking-[0.25em] mb-4 block"
            style={{
              color: "#C9933A",
              fontFamily: "var(--font-dm-mono, var(--font-utility))",
            }}
          >
            Explore
          </span>
          <KineticText
            text="Find Your Perfect Fit"
            tag="h2"
            className="text-4xl md:text-5xl font-bold text-white"
          />
        </motion.div>
      </div>

      {/* Full-width Category Cards */}
      <div className="flex flex-col md:flex-row w-full">
        {CATEGORIES.map((category, index) => (
          <Link
            key={category.slug}
            href={`/products?gender=${category.slug}`}
            className="group relative w-full md:w-1/3 h-[50vh] md:h-[80vh] overflow-hidden"
            data-cursor="view"
            id={`category-card-${category.slug.toLowerCase()}`}
          >
            {/* Image */}
            <Image
              src={category.image}
              alt={`${category.name}'s Footwear Collection`}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-[1.08]"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/70 via-[#0A0A0A]/30 to-[#0A0A0A]/10 transition-all duration-500 group-hover:from-[#0A0A0A]/30" />

            {/* Gold border on hover */}
            <div className="absolute inset-0 transition-shadow duration-500 group-hover:shadow-[inset_0_0_0_2px_#C9933A]" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <p
                className="text-[11px] uppercase tracking-wider mb-2"
                style={{
                  color: "#C9933A",
                  fontFamily:
                    "var(--font-dm-mono, var(--font-utility))",
                }}
              >
                {category.number}
              </p>
              <h3
                className="text-4xl md:text-[48px] font-bold text-white mb-1 transition-transform duration-500 group-hover:-translate-y-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {category.name}
              </h3>
              <p
                className="text-[13px] mb-4"
                style={{
                  color: "#6B6B6B",
                  fontFamily:
                    "var(--font-dm-mono, var(--font-utility))",
                }}
              >
                {category.count}
              </p>
              <ArrowRight
                className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-3"
                style={{ color: "#C9933A" }}
              />
            </div>

            {/* Inter-card divider */}
            {index < CATEGORIES.length - 1 && (
              <div
                className="absolute top-0 right-0 w-px h-full hidden md:block"
                style={{ backgroundColor: "#1E1E1E" }}
              />
            )}
          </Link>
        ))}
      </div>

      {/* Brand Marquee Strip */}
      <div
        className="relative w-full py-6 overflow-hidden"
        style={{
          borderTop: "1px solid #1E1E1E",
          borderBottom: "1px solid #1E1E1E",
        }}
      >
        {/* Rotated label */}
        <div
          className="absolute left-4 top-1/2 -translate-y-1/2 -rotate-90 origin-center hidden lg:block"
          style={{
            fontFamily: "var(--font-dm-mono, var(--font-utility))",
            fontSize: "10px",
            color: "#3A3A3A",
            letterSpacing: "0.15em",
          }}
        >
          OUR BRANDS
        </div>

        <div className="marquee-track whitespace-nowrap">
          {Array.from({ length: 4 }).map((_, repeat) =>
            BRANDS.map((brand, i) => (
              <span
                key={`${repeat}-${i}`}
                className="inline-block mx-8 text-[13px] uppercase tracking-[0.2em] transition-colors duration-300 hover:text-[#C9933A] cursor-default"
                style={{
                  color: "#3A3A3A",
                  fontFamily:
                    "var(--font-dm-mono, var(--font-utility))",
                }}
              >
                {brand}
              </span>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
