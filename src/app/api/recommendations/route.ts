import { prisma } from "@/lib/prisma";
import { fail, ok, requireUser } from "@/lib/api";

export async function GET() {
  try {
    const { session, response } = await requireUser();
    if (response) return response;

    // Get user's recently viewed categories
    const recentlyViewed = await prisma.recentlyViewed.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          select: { categoryId: true, subcategoryId: true, id: true },
        },
      },
      orderBy: { viewedAt: "desc" },
      take: 10,
    });

    const viewedProductIds = recentlyViewed.map((rv) => rv.product.id);
    const viewedCategoryIds = [
      ...new Set(recentlyViewed.map((rv) => rv.product.categoryId)),
    ];

    // Get wishlisted product IDs to exclude
    const wishlisted = await prisma.wishlist.findMany({
      where: { userId: session.user.id },
      select: { productId: true },
    });
    const wishlistedProductIds = wishlisted.map((w) => w.productId);

    let products;

    if (viewedCategoryIds.length > 0) {
      products = await prisma.product.findMany({
        where: {
          categoryId: { in: viewedCategoryIds },
          id: { notIn: [...viewedProductIds, ...wishlistedProductIds] },
        },
        include: {
          brand: { select: { id: true, name: true, slug: true, logo: true } },
          category: { select: { id: true, name: true, slug: true, gender: true } },
          subcategory: { select: { id: true, name: true, slug: true } },
          images: { orderBy: { order: "asc" } },
          sizes: true,
          colors: true,
        },
        orderBy: { wishlistCount: "desc" },
        take: 12,
      });
    } else {
      // Fallback for new users: featured products
      products = await prisma.product.findMany({
        where: { isFeatured: true },
        include: {
          brand: { select: { id: true, name: true, slug: true, logo: true } },
          category: { select: { id: true, name: true, slug: true, gender: true } },
          subcategory: { select: { id: true, name: true, slug: true } },
          images: { orderBy: { order: "asc" } },
          sizes: true,
          colors: true,
        },
        orderBy: { wishlistCount: "desc" },
        take: 12,
      });
    }

    return ok(products);
  } catch (error) {
    console.error("Recommendations GET error:", error);
    return fail("Failed to fetch recommendations", 500);
  }
}
