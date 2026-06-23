import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, brands, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        brand: { select: { id: true, name: true, slug: true, logo: true } },
        category: { select: { id: true, name: true, slug: true, gender: true } },
        subcategory: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { order: "asc" } },
        sizes: true,
        colors: true,
      },
    }),
    prisma.brand.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { products: true } } } }),
    prisma.category.findMany({ include: { subcategories: true, _count: { select: { products: true } } }, orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <p className="eyebrow">Catalog</p>
      <h1 className="mb-8 mt-2 text-3xl font-bold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>Edit Product</h1>
      <ProductForm product={JSON.parse(JSON.stringify(product))} brands={JSON.parse(JSON.stringify(brands))} categories={JSON.parse(JSON.stringify(categories))} />
    </div>
  );
}
