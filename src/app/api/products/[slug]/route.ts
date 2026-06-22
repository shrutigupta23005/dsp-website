import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        brand: { select: { id: true, name: true, slug: true, logo: true, description: true } },
        category: { select: { id: true, name: true, slug: true, gender: true } },
        subcategory: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { order: "asc" } },
        sizes: { orderBy: { size: "asc" } },
        colors: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.product.update({
      where: { id: product.id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("Product Detail API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
