import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 });
    }

    if (action === "clear-views") {
      // 1. Delete all RecentlyViewed history rows
      await prisma.recentlyViewed.deleteMany({});
      
      // 2. Optional: Reset product views back to zero if needed, or keep views but clear logs.
      // The prompt says "Clear Recently Viewed Data" which maps to clearing the logs.
      return NextResponse.json({ success: true, message: "Recently viewed history cleared" });
    }

    if (action === "reset-wishlists") {
      // Run in transaction to reset product wishlist counts and delete wishlist entries
      await prisma.$transaction([
        // Delete all wishlist relation rows
        prisma.wishlist.deleteMany({}),
        // Reset product counters back to 0
        prisma.product.updateMany({
          data: { wishlistCount: 0 },
        }),
      ]);

      return NextResponse.json({ success: true, message: "Wishlist counts reset successfully" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Failed to run danger action:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
