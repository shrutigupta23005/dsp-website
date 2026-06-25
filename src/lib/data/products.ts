import { Prisma } from "@prisma/client";
import { prisma, caseInsensitive } from "@/lib/prisma";
import type { ProductFilters } from "@/types";

const productIncludes = {
  brand: { select: { id: true, name: true, slug: true, logo: true } },
  category: { select: { id: true, name: true, slug: true, gender: true } },
  subcategory: { select: { id: true, name: true, slug: true } },
  images: { orderBy: { order: "asc" as const } },
  sizes: { orderBy: { size: "asc" as const } },
  colors: true,
} satisfies Prisma.ProductInclude;

function buildWhereClause(filters: ProductFilters): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {};

  if (filters.category) where.category = { slug: filters.category };
  if (filters.subcategory) where.subcategory = { slug: filters.subcategory };
  if (filters.brand) where.brand = { slug: filters.brand };
  if (filters.gender) where.gender = filters.gender;
  if (filters.status) where.status = filters.status;

  if (filters.minPrice || filters.maxPrice) {
    where.price = {};
    if (filters.minPrice) where.price.gte = filters.minPrice;
    if (filters.maxPrice) where.price.lte = filters.maxPrice;
  }

  if (filters.color) {
    where.colors = {
      some: { name: { contains: filters.color, ...caseInsensitive() } },
    };
  }

  if (filters.size) {
    where.sizes = {
      some: { size: filters.size, isAvailable: true },
    };
  }

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, ...caseInsensitive() } },
      { description: { contains: filters.search, ...caseInsensitive() } },
      { brand: { name: { contains: filters.search, ...caseInsensitive() } } },
    ];
  }

  return where;
}

function buildOrderBy(
  sort?: string
): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case "popular":
      return { viewCount: "desc" };
    case "price-asc":
      return { price: "asc" };
    case "price-desc":
      return { price: "desc" };
    default:
      return { createdAt: "desc" };
  }
}

export async function getProducts(
  filters: ProductFilters,
  isGuest: boolean
) {
  const where = buildWhereClause(filters);
  const orderBy = buildOrderBy(filters.sort);
  const limit = isGuest ? 15 : (filters.limit ?? 24);
  const page = filters.page ?? 1;
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productIncludes,
      orderBy,
      take: limit,
      skip,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      ...productIncludes,
      brand: {
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
          description: true,
        },
      },
    },
  });
}

export async function getFeaturedProducts(limit = 12) {
  return prisma.product.findMany({
    where: { isFeatured: true },
    include: productIncludes,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getRelatedProducts(
  productId: string,
  subcategoryId: string,
  brandId: string,
  limit = 4
) {
  return prisma.product.findMany({
    where: {
      id: { not: productId },
      OR: [{ subcategoryId }, { brandId }],
    },
    include: productIncludes,
    take: limit,
  });
}
