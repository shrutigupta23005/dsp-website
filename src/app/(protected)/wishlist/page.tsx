import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import WishlistClient from "@/components/wishlist/WishlistClient";

export default async function WishlistPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login?callbackUrl=/wishlist");

  const items = await prisma.wishlist.findMany({
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

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background-secondary pt-28">
        <section className="container-wide pb-16">
          <p className="eyebrow">Saved Products</p>
          <h1 className="section-title mt-3">Your Wishlist</h1>
          <span className="golden-rule" />
          <div className="mt-10">
            <WishlistClient items={JSON.parse(JSON.stringify(items))} />
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
