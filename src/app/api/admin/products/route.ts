import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma, caseInsensitive } from "@/lib/prisma";
import { productSchema } from "@/lib/validators";
import { slugify } from "@/lib/utils";

export async function GET(request: Request) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);
    const search = url.searchParams.get("search") || "";
    const categoryId = url.searchParams.get("category") || "";
    const brandId = url.searchParams.get("brand") || "";
    const status = url.searchParams.get("status") || "";
    const sort = url.searchParams.get("sort") || "newest";

    const where: any = {};

    if (search) {
      where.name = {
        contains: search,
        ...caseInsensitive(),
      };
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (brandId) {
      where.brandId = brandId;
    }
    if (status) {
      where.status = status;
    }

    let orderBy: any = { createdAt: "desc" };
    if (sort === "price-asc") {
      orderBy = { price: "asc" };
    } else if (sort === "price-desc") {
      orderBy = { price: "desc" };
    } else if (sort === "popular") {
      orderBy = { viewCount: "desc" };
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          images: {
            where: { type: "PRIMARY" },
            take: 1,
          },
          brand: true,
          category: true,
          subcategory: true,
          sizes: true,
          colors: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      products,
      total,
      page,
      totalPages,
    });
  } catch (error) {
    console.error("Failed to query products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validated = productSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const {
      name,
      description,
      price,
      brandId,
      categoryId,
      subcategoryId,
      gender,
      material,
      status,
      isFeatured,
      sizes,
      colors,
    } = validated.data;

    // Generate unique slug
    const baseSlug = slugify(name);
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const existing = await prisma.product.findUnique({
        where: { slug },
      });
      if (!existing) break;
      counter++;
      slug = `${baseSlug}-${counter}`;
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        brandId,
        categoryId,
        subcategoryId,
        gender,
        material,
        status,
        isFeatured,
        sizes: {
          createMany: {
            data: sizes.map((s) => ({
              size: s.size,
              isAvailable: s.isAvailable,
            })),
          },
        },
        colors: {
          createMany: {
            data: colors.map((c) => ({
              name: c.name,
              hexCode: c.hexCode || null,
            })),
          },
        },
      },
      include: {
        images: true,
        sizes: true,
        colors: true,
        brand: true,
        category: true,
        subcategory: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
