import { prisma } from "@/lib/prisma";

export async function getAllBrands() {
  return prisma.brand.findMany({
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { name: "asc" },
  });
}

export async function getBrandBySlug(slug: string) {
  return prisma.brand.findUnique({
    where: { slug },
    include: {
      _count: { select: { products: true } },
    },
  });
}
