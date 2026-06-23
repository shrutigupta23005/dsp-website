import { prisma } from "@/lib/prisma";
import { ok, requireAdmin } from "@/lib/api";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;
  const [totalProducts, totalUsers, totalWishlistSaves] = await Promise.all([
    prisma.product.count(),
    prisma.user.count(),
    prisma.wishlist.count(),
  ]);
  return ok({ totalProducts, totalUsers, totalWishlistSaves });
}
