import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Gather all user data
    const [user, wishlist, recentlyViewed] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          name: true,
          email: true,
          createdAt: true,
          image: true,
        },
      }),
      prisma.wishlist.findMany({
        where: { userId },
        include: {
          product: { select: { name: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.recentlyViewed.findMany({
        where: { userId },
        include: {
          product: { select: { name: true, slug: true } },
        },
        orderBy: { viewedAt: "desc" },
      }),
    ]);

    const exportData = {
      exportedAt: new Date().toISOString(),
      profile: {
        name: user?.name || null,
        email: user?.email || null,
        createdAt: user?.createdAt?.toISOString() || null,
      },
      wishlist: wishlist.map((w) => ({
        productName: w.product.name,
        productSlug: w.product.slug,
        addedAt: w.createdAt.toISOString(),
      })),
      recentlyViewed: recentlyViewed.map((rv) => ({
        productName: rv.product.name,
        productSlug: rv.product.slug,
        viewedAt: rv.viewedAt.toISOString(),
      })),
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": 'attachment; filename="my-dsp-data.json"',
      },
    });
  } catch (error) {
    console.error("Data export error:", error);
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}
