import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse Delhi Shoe Palace footwear categories for men, women, and kids.",
};

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { subcategories: true, _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="bg-background-secondary pt-28">
      <section className="container-wide section-pad">
        <p className="eyebrow">Shop By Category</p>
        <h1 className="section-title mt-3">Find The Right Pair</h1>
        <span className="golden-rule" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.id} href={`/products?category=${category.slug}&gender=${category.gender}`} className="group overflow-hidden rounded-lg bg-white">
              <div className="relative aspect-[4/5] overflow-hidden">
                {category.image ? (
                  <Image src={category.image} alt={category.name} fill sizes="33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{category.name}</h2>
                    <ArrowUpRight className="h-6 w-6 text-accent opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <p className="mt-2 text-sm text-white/70">{category._count.products} products</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 p-5">
                {category.subcategories.map((subcategory) => (
                  <span key={subcategory.id} className="rounded-full bg-muted px-3 py-1 text-xs text-text-muted">
                    {subcategory.name}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
