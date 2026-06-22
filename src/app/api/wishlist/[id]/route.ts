import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id: productId } = await params;

    const wishlistItem = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    if (!wishlistItem) {
      return NextResponse.json(
        { success: false, error: "Item not found in wishlist" },
        { status: 404 }
      );
    }

    await prisma.wishlist.delete({
      where: { id: wishlistItem.id },
    });

    // Decrement wishlist count on product
    await prisma.product.update({
      where: { id: productId },
      data: { wishlistCount: { decrement: 1 } },
    });

    return NextResponse.json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    console.error("Wishlist DELETE Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove from wishlist" },
      { status: 500 }
    );
  }
}
