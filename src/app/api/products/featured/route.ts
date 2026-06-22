import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isFeatured: true },
      include: {
        brand: { select: { id: true, name: true, slug: true, logo: true } },
        category: { select: { id: true, name: true, slug: true, gender: true } },
        subcategory: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { order: "asc" } },
        sizes: true,
        colors: true,
      },
      orderBy: { createdAt: "desc" },
      take: 12,
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("Featured Products API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch featured products" },
      { status: 500 }
    );
  }
}
