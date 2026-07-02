import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import { absoluteUrl } from "@/lib/utils";
import { generateProductSchema, generateBreadcrumbSchema } from "@/lib/structured-data";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      brand: { select: { id: true, name: true, slug: true, logo: true, description: true } },
      category: { select: { id: true, name: true, slug: true, gender: true } },
      subcategory: { select: { id: true, name: true, slug: true } },
      images: { orderBy: { order: "asc" } },
      sizes: { orderBy: { size: "asc" } },
      colors: true,
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product Not Found" };
  const image = product.images.find((item) => item.type === "PRIMARY") || product.images[0];

  return {
    title: `${product.name} — ${product.brand.name}`,
    description: product.description || `Shop ${product.name} by ${product.brand.name} at Delhi Shoe Palace. Premium footwear since 2001.`,
    alternates: { canonical: absoluteUrl(`/products/${product.slug}`) },
    openGraph: {
      title: `${product.name} — ${product.brand.name}`,
      description: product.description || `Shop ${product.name} by ${product.brand.name} at Delhi Shoe Palace.`,
      images: image ? [{ url: image.url, alt: image.alt || product.name }] : undefined,
      type: "website",
      siteName: "Delhi Shoe Palace",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — Delhi Shoe Palace`,
      description: product.description || `Shop ${product.name} at Delhi Shoe Palace.`,
      images: image ? [image.url] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const session = await auth();
  const product = await getProduct(slug);
  if (!product) notFound();

  await prisma.product.update({
    where: { id: product.id },
    data: { viewCount: { increment: 1 } },
  });

  const [relatedProducts, wishlisted] = await Promise.all([
    prisma.product.findMany({
      where: {
        id: { not: product.id },
        OR: [{ subcategoryId: product.subcategoryId }, { brandId: product.brandId }],
      },
      include: {
        brand: { select: { id: true, name: true, slug: true, logo: true } },
        category: { select: { id: true, name: true, slug: true, gender: true } },
        subcategory: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { order: "asc" } },
        sizes: true,
        colors: true,
      },
      take: 4,
    }),
    session?.user?.id
      ? prisma.wishlist.findUnique({
          where: { userId_productId: { userId: session.user.id, productId: product.id } },
          select: { id: true },
        })
      : Promise.resolve(null),
  ]);

  const productData = JSON.parse(JSON.stringify(product));
  const relatedData = JSON.parse(JSON.stringify(relatedProducts));

  const productSchema = generateProductSchema(product);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: absoluteUrl("/") },
    { name: "Products", url: absoluteUrl("/products") },
    { name: product.name, url: absoluteUrl(`/products/${product.slug}`) },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductDetailClient
        product={productData}
        relatedProducts={relatedData}
        isAuthenticated={!!session}
        isWishlisted={!!wishlisted}
      />
    </>
  );
}
