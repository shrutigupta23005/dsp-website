import type { Metadata } from "next";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma, caseInsensitive } from "@/lib/prisma";
import ProductListingClient from "@/components/product/ProductListingClient";
import { productQuerySchema } from "@/lib/validators";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse the Delhi Shoe Palace digital footwear catalog for men, women, and kids.",
};

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ProductsPage({ searchParams }: Props) {
  const rawParams = await searchParams;
  const session = await auth();
  const parsed = productQuerySchema.parse({
    page: first(rawParams.page) || 1,
    limit: first(rawParams.limit) || 24,
    category: first(rawParams.category),
    subcategory: first(rawParams.subcategory),
    brand: first(rawParams.brand),
    gender: first(rawParams.gender),
    minPrice: first(rawParams.minPrice),
    maxPrice: first(rawParams.maxPrice),
    color: first(rawParams.color),
    size: first(rawParams.size),
    sort: first(rawParams.sort) || "newest",
    search: first(rawParams.search),
    status: first(rawParams.status),
  });

  const where: Prisma.ProductWhereInput = {};
  if (parsed.category) where.category = { slug: parsed.category };
  if (parsed.subcategory) where.subcategory = { slug: parsed.subcategory };
  if (parsed.brand) where.brand = { slug: parsed.brand };
  if (parsed.gender) where.gender = parsed.gender;
  if (parsed.status) where.status = parsed.status;
  if (parsed.minPrice || parsed.maxPrice) {
    where.price = {};
    if (parsed.minPrice) where.price.gte = parsed.minPrice;
    if (parsed.maxPrice) where.price.lte = parsed.maxPrice;
  }
  if (parsed.color) where.colors = { some: { name: { contains: parsed.color, ...caseInsensitive() } } };
  if (parsed.size) where.sizes = { some: { size: parsed.size, isAvailable: true } };
  if (parsed.search) {
    where.OR = [
      { name: { contains: parsed.search, ...caseInsensitive() } },
      { description: { contains: parsed.search, ...caseInsensitive() } },
      { brand: { name: { contains: parsed.search, ...caseInsensitive() } } },
    ];
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    parsed.sort === "popular"
      ? { viewCount: "desc" }
      : parsed.sort === "price-asc"
        ? { price: "asc" }
        : parsed.sort === "price-desc"
          ? { price: "desc" }
          : { createdAt: "desc" };

  const isGuest = !session;
  const take = isGuest ? 15 : parsed.limit;

  const [products, total, categories, brands, wishlisted] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        brand: { select: { id: true, name: true, slug: true, logo: true } },
        category: { select: { id: true, name: true, slug: true, gender: true } },
        subcategory: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { order: "asc" } },
        sizes: true,
        colors: true,
      },
      orderBy,
      take,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({
      include: { subcategories: true, _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.brand.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    }),
    session?.user?.id
      ? prisma.wishlist.findMany({ where: { userId: session.user.id }, select: { productId: true } })
      : Promise.resolve([]),
  ]);

  const initialFilters = Object.fromEntries(
    Object.entries(rawParams).map(([key, value]) => [key, first(value) || ""])
  );

  return (
    <ProductListingClient
      products={JSON.parse(JSON.stringify(products))}
      categories={JSON.parse(JSON.stringify(categories))}
      brands={JSON.parse(JSON.stringify(brands))}
      isAuthenticated={!!session}
      wishlistedIds={wishlisted.map((item) => item.productId)}
      initialFilters={initialFilters}
      isLimited={isGuest && total > 15}
    />
  );
}
