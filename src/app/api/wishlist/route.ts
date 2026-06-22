import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const wishlist = await prisma.wishlist.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          include: {
            brand: { select: { id: true, name: true, slug: true, logo: true } },
            category: { select: { id: true, name: true, slug: true, gender: true } },
            subcategory: { select: { id: true, name: true, slug: true } },
            images: { orderBy: { order: "asc" } },
            sizes: true,
            colors: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: wishlist });
  } catch (error) {
    console.error("Wishlist GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Check if already wishlisted
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Product already in wishlist" },
        { status: 409 }
      );
    }

    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId: session.user.id,
        productId,
      },
    });

    // Increment wishlist count on product
    await prisma.product.update({
      where: { id: productId },
      data: { wishlistCount: { increment: 1 } },
    });

    return NextResponse.json({ success: true, data: wishlistItem }, { status: 201 });
  } catch (error) {
    console.error("Wishlist POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add to wishlist" },
      { status: 500 }
    );
  }
}
