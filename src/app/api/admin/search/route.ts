import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma, caseInsensitive } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const url = new URL(request.url);
    const q = url.searchParams.get("q") || "";

    if (q.trim().length < 2) {
      return NextResponse.json({
        products: [],
        users: [],
        brands: [],
        categories: [],
        totalResults: 0,
      });
    }

    const [products, users, brands, categories] = await Promise.all([
      // 1. Search Products
      prisma.product.findMany({
        where: {
          name: {
            contains: q,
            ...caseInsensitive(),
          },
        },
        take: 5,
        include: {
          images: {
            where: { type: "PRIMARY" },
            take: 1,
          },
          brand: true,
        },
      }),

      // 2. Search Users
      prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: q, ...caseInsensitive() } },
            { email: { contains: q, ...caseInsensitive() } },
          ],
        },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isBlocked: true,
        },
      }),

      // 3. Search Brands
      prisma.brand.findMany({
        where: {
          name: {
            contains: q,
            ...caseInsensitive(),
          },
        },
        take: 3,
        select: {
          id: true,
          name: true,
          slug: true,
        },
      }),

      // 4. Search Categories
      prisma.category.findMany({
        where: {
          name: {
            contains: q,
            ...caseInsensitive(),
          },
        },
        take: 3,
        select: {
          id: true,
          name: true,
          gender: true,
        },
      }),
    ]);

    const totalResults =
      products.length + users.length + brands.length + categories.length;

    return NextResponse.json({
      products,
      users,
      brands,
      categories,
      totalResults,
    });
  } catch (error) {
    console.error("Global search failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
