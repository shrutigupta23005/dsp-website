import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import CompareClient from "@/components/compare/CompareClient";

export default async function ComparePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login?callbackUrl=/compare");

  const comparison = await prisma.comparison.findFirst({
    where: { userId: session.user.id },
    include: {
      products: {
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
      },
    },
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background-secondary pt-28">
        <section className="container-wide pb-16">
          <p className="eyebrow">Side By Side</p>
          <h1 className="section-title mt-3">Compare Products</h1>
          <span className="golden-rule" />
          <div className="mt-10 rounded-lg border border-border bg-white p-4">
            <CompareClient products={JSON.parse(JSON.stringify(comparison?.products.map((item) => item.product) || []))} />
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
