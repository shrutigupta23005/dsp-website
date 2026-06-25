import { prisma } from "@/lib/prisma";

export async function getAllCategories() {
  return prisma.category.findMany({
    include: {
      subcategories: {
        select: { id: true, name: true, slug: true },
        orderBy: { name: "asc" },
      },
      _count: { select: { products: true } },
    },
    orderBy: { name: "asc" },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      subcategories: {
        select: { id: true, name: true, slug: true },
        orderBy: { name: "asc" },
      },
      _count: { select: { products: true } },
    },
  });
}
