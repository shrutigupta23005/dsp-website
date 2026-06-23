import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const [brands, categories] = await Promise.all([
    prisma.brand.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { products: true } } } }),
    prisma.category.findMany({ include: { subcategories: true, _count: { select: { products: true } } }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <p className="eyebrow">Catalog</p>
      <h1 className="mb-8 mt-2 text-3xl font-bold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>Add Product</h1>
      <ProductForm brands={JSON.parse(JSON.stringify(brands))} categories={JSON.parse(JSON.stringify(categories))} />
    </div>
  );
}
