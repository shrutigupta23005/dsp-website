import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const url = new URL(request.url);
    const range = url.searchParams.get("range") || "30d";

    let days = 30;
    if (range === "7d") days = 7;
    else if (range === "90d") days = 90;

    // Start date (e.g. today minus X days, set to start of day)
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // 1. User Signups Aggregation (DB agnostic)
    const users = await prisma.user.findMany({
      where: {
        role: "USER",
        createdAt: { gte: startDate },
      },
      select: { createdAt: true },
    });

    const signupsByDate: Record<string, number> = {};
    for (let i = 0; i <= days; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      signupsByDate[dateStr] = 0;
    }

    users.forEach((u) => {
      const dateStr = new Date(u.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (signupsByDate[dateStr] !== undefined) {
        signupsByDate[dateStr]++;
      }
    });

    const userSignups = Object.entries(signupsByDate).map(([date, count]) => ({
      date,
      count,
    }));

    // 2. Wishlist Activity Aggregation (DB agnostic)
    const wishlists = await prisma.wishlist.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      select: { createdAt: true },
    });

    const wishlistByDate: Record<string, number> = {};
    for (let i = 0; i <= days; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      wishlistByDate[dateStr] = 0;
    }

    wishlists.forEach((w) => {
      const dateStr = new Date(w.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (wishlistByDate[dateStr] !== undefined) {
        wishlistByDate[dateStr]++;
      }
    });

    const wishlistActivity = Object.entries(wishlistByDate).map(([date, count]) => ({
      date,
      count,
    }));

    // 3. Top Products by Views
    const topProducts = await prisma.product.findMany({
      orderBy: { viewCount: "desc" },
      take: 10,
      include: {
        images: {
          where: { type: "PRIMARY" },
          take: 1,
        },
        brand: true,
      },
    });

    // 4. Top Categories Performance
    const categoriesWithProducts = await prisma.category.findMany({
      include: {
        products: {
          select: { viewCount: true },
        },
      },
    });

    const topCategories = categoriesWithProducts
      .map((cat) => {
        const totalViews = cat.products.reduce((sum, p) => sum + p.viewCount, 0);
        return {
          id: cat.id,
          name: cat.name,
          gender: cat.gender,
          productCount: cat.products.length,
          totalViews,
        };
      })
      .sort((a, b) => b.totalViews - a.totalViews);

    // 5. Top Brands Performance
    const brandsWithProducts = await prisma.brand.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    const topBrands = brandsWithProducts
      .map((b) => ({
        id: b.id,
        name: b.name,
        slug: b.slug,
        logo: b.logo,
        productCount: b._count.products,
      }))
      .sort((a, b) => b.productCount - a.productCount);

    // 6. Summary Stats
    const [totalProducts, totalUsers, totalWishlistsCount, avgPriceAgg, featuredCount] =
      await Promise.all([
        prisma.product.count(),
        prisma.user.count({ where: { role: "USER" } }),
        prisma.wishlist.count(),
        prisma.product.aggregate({
          _avg: { price: true },
        }),
        prisma.product.count({ where: { isFeatured: true } }),
      ]);

    const avgPrice = avgPriceAgg._avg.price ?? 0;

    // 7. Status Breakdown
    const statusGroups = await prisma.product.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
    });

    const statusBreakdown = statusGroups.map((g) => ({
      status: g.status,
      count: g._count.id,
    }));

    return NextResponse.json({
      userSignups,
      wishlistActivity,
      topProducts,
      topCategories,
      topBrands,
      featuredCount,
      statusBreakdown,
      totalStats: {
        products: totalProducts,
        users: totalUsers,
        wishlists: totalWishlistsCount,
        avgPrice,
      },
    });
  } catch (error) {
    console.error("Failed to query analytics:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
