import { prisma } from "@/lib/prisma";
import { ok, requireAdmin } from "@/lib/api";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;
  const products = await prisma.product.findMany({
    orderBy: { viewCount: "desc" },
    take: 20,
    select: { id: true, name: true, slug: true, viewCount: true, wishlistCount: true },
  });
  return ok(products);
}
