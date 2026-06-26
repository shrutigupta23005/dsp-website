import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import HomePageClient from "./HomePageClient";

export default async function HomePage() {
  const session = await auth();

  const featuredProducts = await prisma.product.findMany({
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

  let wishlistedIds: string[] = [];
  if (session?.user?.id) {
    const wishlisted = await prisma.wishlist.findMany({
      where: { userId: session.user.id },
      select: { productId: true },
    });
    wishlistedIds = wishlisted.map((w) => w.productId);
  }

  return (
    <HomePageClient
      featuredProducts={JSON.parse(JSON.stringify(featuredProducts))}
      isAuthenticated={!!session}
      wishlistedIds={wishlistedIds}
      user={
        session?.user
          ? {
              name: session.user.name || null,
              email: session.user.email || null,
              createdAt: ((session.user as unknown) as Record<string, unknown>).createdAt as string | undefined,
            }
          : null
      }
    />
  );
}
