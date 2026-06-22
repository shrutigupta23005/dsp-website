"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

interface CategoryData {
  name: string;
  slug: string;
  image: string;
  count?: number;
  description: string;
}

const CATEGORIES: CategoryData[] = [
  {
    name: "Men",
    slug: "MEN",
    image: "https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=800&q=80",
    description: "Sports, Casual, Formal, Boots & More",
  },
  {
    name: "Women",
    slug: "WOMEN",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80",
    description: "Heels, Casual, Fancy, Sports & More",
  },
  {
    name: "Kids",
    slug: "KIDS",
    image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&q=80",
    description: "School, Sports, Casual & More",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function CategoryGrid() {
  return (
    <section className="py-24 bg-background-secondary" id="category-grid">
      <div className="container-wide">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="eyebrow">Shop by Category</span>
          <h2
            className="text-4xl md:text-5xl font-bold text-text-primary mt-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Find Your Perfect Fit
          </h2>
          <div className="golden-rule-center" />
        </motion.div>

        {/* Category Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {CATEGORIES.map((category) => (
            <motion.div key={category.slug} variants={cardVariants}>
              <Link
                href={`/products?gender=${category.slug}`}
                className="group relative block aspect-[3/4] md:aspect-[4/5] rounded-xl overflow-hidden"
                id={`category-card-${category.slug.toLowerCase()}`}
              >
                {/* Image */}
                <Image
                  src={category.image}
                  alt={`${category.name}'s Footwear Collection`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-[#0A0A0A]/30 to-transparent transition-all duration-500 group-hover:from-[#0A0A0A]/70 group-hover:via-[#0A0A0A]/20" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3
                        className="text-3xl md:text-4xl font-bold text-white mb-2"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {category.name}
                      </h3>
                      <p className="text-sm text-white/50 transition-colors duration-300 group-hover:text-white/70">
                        {category.description}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center transition-all duration-300 group-hover:bg-accent group-hover:border-accent group-hover:scale-110">
                      <ArrowUpRight className="w-5 h-5 text-white transition-transform duration-300 group-hover:rotate-45" />
                    </div>
                  </div>
                </div>

                {/* Top-right accent line */}
                <div className="absolute top-6 right-6 flex items-center gap-2 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                  <span className="text-xs font-medium text-accent tracking-widest uppercase">
                    Explore
                  </span>
                  <span className="w-6 h-px bg-accent" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
