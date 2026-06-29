import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const [newUsers, newWishlists, highTrafficProducts] = await Promise.all([
      // 1. Last 5 users
      prisma.user.findMany({
        where: { role: "USER" },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
      }),

      // 2. Last 5 wishlist saves
      prisma.wishlist.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          product: {
            select: { name: true },
          },
          user: {
            select: { name: true },
          },
        },
      }),

      // 3. Trending products (views > 50)
      prisma.product.findMany({
        where: {
          viewCount: { gt: 50 },
        },
        orderBy: { viewCount: "desc" },
        take: 3,
        select: {
          id: true,
          name: true,
          viewCount: true,
          updatedAt: true,
        },
      }),
    ]);

    const formatTimeAgo = (dateStr: Date) => {
      const diffMs = Date.now() - new Date(dateStr).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    };

    const notifications: any[] = [];

    // Map new users
    newUsers.forEach((u) => {
      notifications.push({
        type: "new_user",
        message: `${u.name || "A new customer"} just joined the palace`,
        time: formatTimeAgo(u.createdAt),
        timestamp: new Date(u.createdAt).getTime(),
        link: `/admin/users/${u.id}`,
      });
    });

    // Map wishlist saves
    newWishlists.forEach((w) => {
      if (w.product && w.user) {
        notifications.push({
          type: "wishlist",
          message: `${w.user.name || "A customer"} saved "${w.product.name}"`,
          time: formatTimeAgo(w.createdAt),
          timestamp: new Date(w.createdAt).getTime(),
          link: `/admin/products/${w.productId}/edit`,
        });
      }
    });

    // Map trending products
    highTrafficProducts.forEach((p) => {
      notifications.push({
        type: "trending",
        message: `"${p.name}" is trending — ${p.viewCount} views`,
        time: "Trending now",
        timestamp: new Date(p.updatedAt).getTime() - 1000, // Offset slightly
        link: `/admin/products/${p.id}/edit`,
      });
    });

    // Sort by timestamp desc, take 15
    notifications.sort((a, b) => b.timestamp - a.timestamp);
    const resultList = notifications.slice(0, 15);

    // Simple unread count (e.g. number of items in last 24h)
    const unreadCount = resultList.length;

    return NextResponse.json({
      notifications: resultList,
      unreadCount,
    });
  } catch (error) {
    console.error("Failed to fetch admin activity feed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
