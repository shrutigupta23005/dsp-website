import { prisma } from "@/lib/prisma";
import ResourceManager from "@/components/admin/ResourceManager";

export const dynamic = "force-dynamic";

export default async function AdminBrandsPage() {
  const brands = await prisma.brand.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <p className="eyebrow">Catalog Taxonomy</p>
      <h1 className="mb-8 mt-2 text-3xl font-bold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>Brands</h1>
      <ResourceManager kind="brands" items={JSON.parse(JSON.stringify(brands))} />
    </div>
  );
}
