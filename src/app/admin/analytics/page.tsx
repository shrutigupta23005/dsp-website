import { prisma } from "@/lib/prisma";
import AnalyticsCharts from "@/components/admin/AnalyticsCharts";

export const dynamic = "force-dynamic";

function byDate<T extends { createdAt?: Date; viewedAt?: Date }>(items: T[], dateKey: "createdAt" | "viewedAt", valueKey: string) {
  const counts = new Map<string, number>();
  items.forEach((item) => {
    const date = item[dateKey];
    if (!date) return;
    const key = date.toISOString().slice(0, 10);
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  return Array.from(counts.entries()).map(([date, count]) => ({ date, [valueKey]: count }));
}

export default async function AdminAnalyticsPage() {
  const [products, categories, wishlist, users] = await Promise.all([
    prisma.product.findMany({ orderBy: { viewCount: "desc" }, take: 10, select: { name: true, viewCount: true } }),
    prisma.category.findMany({ include: { _count: { select: { products: true } } } }),
    prisma.wishlist.findMany({ select: { createdAt: true } }),
    prisma.user.findMany({ select: { createdAt: true } }),
  ]);

  return (
    <div>
      <p className="eyebrow">Signals</p>
      <h1 className="mb-8 mt-2 text-3xl font-bold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>Analytics</h1>
      <AnalyticsCharts
        productViews={products.map((product) => ({ name: product.name, views: product.viewCount }))}
        categoryCounts={categories.map((category) => ({ name: category.name, products: category._count.products }))}
        wishlistAdds={byDate(wishlist, "createdAt", "saves") as Array<{ date: string; saves: number }>}
        signups={byDate(users, "createdAt", "users") as Array<{ date: string; users: number }>}
      />
    </div>
  );
}
