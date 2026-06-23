import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "https://delhishoepalace.com";
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ select: { slug: true, updatedAt: true } }),
  ]);

  return [
    "",
    "/about",
    "/contact",
    "/categories",
    "/products",
    ...categories.map((category) => `/products?category=${category.slug}`),
    ...products.map((product) => `/products/${product.slug}`),
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified:
      products.find((product) => path === `/products/${product.slug}`)?.updatedAt ||
      categories.find((category) => path === `/products?category=${category.slug}`)?.updatedAt ||
      new Date(),
  }));
}
