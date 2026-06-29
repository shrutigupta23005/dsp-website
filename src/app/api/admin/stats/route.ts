import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalProducts,
      totalUsers,
      totalWishlists,
      totalViewsAggregate,
      mostViewed,
      mostWishlisted,
      recentUsers,
      productsByCategory,
      newProductsThisWeek,
      newUsersThisWeek,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.user.count({ where: { role: "USER" } }),
      prisma.wishlist.count(),
      prisma.product.aggregate({
        _sum: {
          viewCount: true,
        },
      }),
      prisma.product.findMany({
        orderBy: { viewCount: "desc" },
        take: 5,
        include: {
          images: {
            where: { type: "PRIMARY" },
            take: 1,
          },
          brand: true,
        },
      }),
      prisma.product.findMany({
        orderBy: { wishlistCount: "desc" },
        take: 5,
        include: {
          images: {
            where: { type: "PRIMARY" },
            take: 1,
          },
          brand: true,
        },
      }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      }),
      prisma.category.findMany({
        include: {
          _count: {
            select: { products: true },
          },
        },
      }),
      prisma.product.count({
        where: {
          createdAt: { gte: oneWeekAgo },
        },
      }),
      prisma.user.count({
        where: {
          role: "USER",
          createdAt: { gte: oneWeekAgo },
        },
      }),
    ]);

    const totalViews = totalViewsAggregate._sum?.viewCount ?? 0;

    return NextResponse.json({
      totalProducts,
      totalUsers,
      totalWishlists,
      totalViews,
      mostViewed,
      mostWishlisted,
      recentUsers,
      productsByCategory: productsByCategory.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        count: cat._count.products,
      })),
      newProductsThisWeek,
      newUsersThisWeek,
    });
  } catch (error) {
    console.error("Failed to fetch admin stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
