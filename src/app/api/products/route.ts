import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { productQuerySchema } from "@/lib/validators";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const session = await auth();

    const params = productQuerySchema.parse({
      page: searchParams.get("page") || 1,
      limit: searchParams.get("limit") || 12,
      category: searchParams.get("category") || undefined,
      subcategory: searchParams.get("subcategory") || undefined,
      brand: searchParams.get("brand") || undefined,
      gender: searchParams.get("gender") || undefined,
      minPrice: searchParams.get("minPrice") || undefined,
      maxPrice: searchParams.get("maxPrice") || undefined,
      color: searchParams.get("color") || undefined,
      size: searchParams.get("size") || undefined,
      sort: searchParams.get("sort") || "newest",
      search: searchParams.get("search") || undefined,
      status: searchParams.get("status") || undefined,
    });

    // Guest users limited to 15 products
    const isGuest = !session;
    const limit = isGuest ? Math.min(params.limit, 15) : params.limit;

    // Build where clause
    const where: Prisma.ProductWhereInput = {};

    if (params.category) {
      where.category = { slug: params.category };
    }
    if (params.subcategory) {
      where.subcategory = { slug: params.subcategory };
    }
    if (params.brand) {
      where.brand = { slug: params.brand };
    }
    if (params.gender) {
      where.gender = params.gender;
    }
    if (params.status) {
      where.status = params.status;
    }
    if (params.minPrice || params.maxPrice) {
      where.price = {};
      if (params.minPrice) where.price.gte = params.minPrice;
      if (params.maxPrice) where.price.lte = params.maxPrice;
    }
    if (params.color) {
      where.colors = { some: { name: { contains: params.color, mode: "insensitive" } } };
    }
    if (params.size) {
      where.sizes = { some: { size: params.size, isAvailable: true } };
    }
    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { description: { contains: params.search, mode: "insensitive" } },
        { brand: { name: { contains: params.search, mode: "insensitive" } } },
      ];
    }

    // Build orderBy
    let orderBy: Prisma.ProductOrderByWithRelationInput = {};
    switch (params.sort) {
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "popular":
        orderBy = { viewCount: "desc" };
        break;
      case "price-asc":
        orderBy = { price: "asc" };
        break;
      case "price-desc":
        orderBy = { price: "desc" };
        break;
      default:
        orderBy = { createdAt: "desc" };
    }

    const skip = (params.page - 1) * limit;

    const [products, total] = await Promise.all([
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
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        total: isGuest ? Math.min(total, 15) : total,
        page: params.page,
        limit,
        totalPages: Math.ceil((isGuest ? Math.min(total, 15) : total) / limit),
      },
      isLimited: isGuest && total > 15,
    });
  } catch (error) {
    console.error("Products API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
