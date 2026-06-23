import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";

export default async function RecentlyViewedPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login?callbackUrl=/recently-viewed");

  const items = await prisma.recentlyViewed.findMany({
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
    orderBy: { viewedAt: "desc" },
    take: 24,
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background-secondary pt-28">
        <section className="container-wide pb-16">
          <p className="eyebrow">History</p>
          <h1 className="section-title mt-3">Recently Viewed</h1>
          <span className="golden-rule" />
          <div className="mt-10">
            {items.length ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {items.map((item, index) => (
                  <ProductCard key={item.id} product={JSON.parse(JSON.stringify(item.product))} index={index} showWishlist={false} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border bg-white p-12 text-center">
                <h2 className="text-2xl font-semibold text-text-primary">No viewed products yet</h2>
                <p className="mt-2 text-text-muted">Open a product detail page and it will appear here.</p>
                <Button asChild className="mt-6">
                  <Link href="/products">Browse Products</Link>
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
