"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ProductWithRelations } from "@/types";
import { formatPrice, getStatusLabel } from "@/lib/utils";

export default function CompareClient({ products: initialProducts }: { products: ProductWithRelations[] }) {
  const [products, setProducts] = useState(initialProducts);

  const remove = async (productId: string) => {
    const previous = products;
    setProducts((current) => current.filter((product) => product.id !== productId));
    const res = await fetch(`/api/compare/${productId}`, { method: "DELETE" });
    if (!res.ok) {
      setProducts(previous);
      toast.error("Could not remove product");
    }
  };

  if (!products.length) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-white p-12 text-center">
        <h2 className="text-2xl font-semibold text-text-primary">No products selected</h2>
        <p className="mt-2 text-text-muted">Open a product detail page and add up to 3 products to compare.</p>
        <Button asChild className="mt-6">
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Feature</TableHead>
          {products.map((product) => (
            <TableHead key={product.id} className="min-w-56">
              <div className="space-y-3">
                <div className="relative h-32 overflow-hidden rounded-md bg-white">
                  {product.images[0] ? <Image src={product.images[0].url} alt={product.name} fill sizes="220px" className="object-cover" /> : null}
                </div>
                <Link href={`/products/${product.slug}`} className="block text-text-primary hover:text-accent">{product.name}</Link>
                <button onClick={() => remove(product.id)} className="text-xs text-red-600">Remove</button>
              </div>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {[
          ["Price", (p: ProductWithRelations) => formatPrice(p.price)],
          ["Brand", (p: ProductWithRelations) => p.brand.name],
          ["Status", (p: ProductWithRelations) => getStatusLabel(p.status)],
          ["Material", (p: ProductWithRelations) => p.material || "Premium mixed materials"],
          ["Sizes", (p: ProductWithRelations) => p.sizes.filter((size) => size.isAvailable).map((size) => `UK ${size.size}`).join(", ")],
          ["Colors", (p: ProductWithRelations) => p.colors.map((color) => color.name).join(", ")],
        ].map(([label, getter]) => (
          <TableRow key={label as string}>
            <TableCell className="font-semibold text-text-primary">{label as string}</TableCell>
            {products.map((product) => (
              <TableCell key={product.id}>{(getter as (product: ProductWithRelations) => string)(product)}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
