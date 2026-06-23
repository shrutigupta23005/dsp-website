import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [totalProducts, totalUsers, totalWishlistSaves, mostViewedProducts, mostWishlistedProducts] = await Promise.all([
    prisma.product.count(),
    prisma.user.count(),
    prisma.wishlist.count(),
    prisma.product.findMany({ orderBy: { viewCount: "desc" }, take: 5, select: { id: true, name: true, slug: true, viewCount: true } }),
    prisma.product.findMany({ orderBy: { wishlistCount: "desc" }, take: 5, select: { id: true, name: true, slug: true, wishlistCount: true } }),
  ]);

  return (
    <div>
      <p className="eyebrow">Overview</p>
      <h1 className="mt-2 text-3xl font-bold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>Dashboard</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          ["Total Products", totalProducts],
          ["Registered Users", totalUsers],
          ["Wishlist Saves", totalWishlistSaves],
        ].map(([label, value]) => (
          <Card key={label as string}>
            <CardHeader>
              <CardTitle>{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="price text-4xl text-accent">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Most Viewed Products</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Views</TableHead></TableRow></TableHeader>
              <TableBody>
                {mostViewedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell><Link href={`/products/${product.slug}`} className="hover:text-accent">{product.name}</Link></TableCell>
                    <TableCell>{product.viewCount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Most Wishlisted Products</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Saves</TableHead></TableRow></TableHeader>
              <TableBody>
                {mostWishlistedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell><Link href={`/products/${product.slug}`} className="hover:text-accent">{product.name}</Link></TableCell>
                    <TableCell>{product.wishlistCount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
