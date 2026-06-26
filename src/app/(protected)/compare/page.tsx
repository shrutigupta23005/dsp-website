"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Scale, MessageCircle, Trash2 } from "lucide-react";
import { useCompareStore } from "@/store/compareStore";
import { cn, formatPrice, getStatusLabel, getWhatsAppUrl } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ComparePage() {
  const { items, remove, clear } = useCompareStore();

  // Find the lowest price for highlighting
  const lowestPrice = items.length > 0 ? Math.min(...items.map((p) => p.price)) : 0;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background-secondary pt-28">
        <section className="container-wide pb-16">
          <p className="eyebrow" style={{ fontFamily: "var(--font-utility)" }}>
            PRODUCT COMPARISON
          </p>
          <h1
            className="text-4xl font-bold text-text-primary mt-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Compare Products
          </h1>
          <span className="golden-rule" />

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-dashed border-border bg-white p-16 text-center mt-10"
            >
              <Scale className="w-16 h-16 text-border mx-auto mb-6" strokeWidth={1} />
              <h2 className="text-xl font-semibold text-text-primary">
                No products to compare
              </h2>
              <p className="text-sm text-text-muted mt-2 max-w-sm mx-auto">
                Add 2-3 products from any product page to start comparing
              </p>
              <Link
                href="/products"
                className="inline-block mt-6 px-6 py-3 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Browse Products
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-10"
            >
              {/* Clear All Button */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={clear}
                  className="flex items-center gap-1.5 text-sm text-text-muted hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear All
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-border bg-white">
                <table className="w-full">
                  {/* Product Header */}
                  <thead>
                    <tr className="border-b border-border">
                      <th className="p-5 text-left text-sm font-semibold text-text-primary w-40 bg-background-secondary">
                        Product
                      </th>
                      {items.map((product) => {
                        const primaryImage = product.images?.find((img) => img.type === "PRIMARY") || product.images?.[0];
                        return (
                          <th key={product.id} className="p-5 min-w-56 align-top">
                            <div className="space-y-3">
                              <div className="relative h-40 overflow-hidden rounded-lg bg-background-secondary mx-auto max-w-[200px]">
                                {primaryImage && (
                                  <Image
                                    src={primaryImage.url}
                                    alt={product.name}
                                    fill
                                    sizes="200px"
                                    className="object-cover"
                                  />
                                )}
                              </div>
                              <Link
                                href={`/products/${product.slug}`}
                                className="block text-sm font-semibold text-text-primary hover:text-accent transition-colors"
                              >
                                {product.name}
                              </Link>
                              <button
                                onClick={() => remove(product.id)}
                                className="text-xs text-red-500 hover:text-red-600 transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Price */}
                    <tr className="border-b border-border">
                      <td className="p-5 text-sm font-semibold text-text-primary bg-background-secondary">
                        Price
                      </td>
                      {items.map((product) => (
                        <td
                          key={product.id}
                          className={cn(
                            "p-5 text-center",
                            product.price === lowestPrice && items.length > 1
                              ? "bg-green-50"
                              : ""
                          )}
                        >
                          <span
                            className={cn(
                              "price text-lg",
                              product.price === lowestPrice && items.length > 1
                                ? "text-green-600 font-bold"
                                : "text-text-primary"
                            )}
                          >
                            {formatPrice(product.price)}
                          </span>
                          {product.price === lowestPrice && items.length > 1 && (
                            <span className="block text-[10px] text-green-600 mt-1 uppercase tracking-wider font-semibold">
                              Best Price
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* Brand */}
                    <tr className="border-b border-border">
                      <td className="p-5 text-sm font-semibold text-text-primary bg-background-secondary">
                        Brand
                      </td>
                      {items.map((product) => (
                        <td key={product.id} className="p-5 text-sm text-text-primary text-center">
                          {product.brand?.name || "—"}
                        </td>
                      ))}
                    </tr>

                    {/* Status */}
                    <tr className="border-b border-border">
                      <td className="p-5 text-sm font-semibold text-text-primary bg-background-secondary">
                        Status
                      </td>
                      {items.map((product) => (
                        <td key={product.id} className="p-5 text-center">
                          <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                            {getStatusLabel(product.status)}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Material */}
                    <tr className="border-b border-border">
                      <td className="p-5 text-sm font-semibold text-text-primary bg-background-secondary">
                        Material
                      </td>
                      {items.map((product) => (
                        <td key={product.id} className="p-5 text-sm text-text-primary text-center">
                          {product.material || "Premium mixed materials"}
                        </td>
                      ))}
                    </tr>

                    {/* Available Sizes */}
                    <tr className="border-b border-border">
                      <td className="p-5 text-sm font-semibold text-text-primary bg-background-secondary">
                        Sizes
                      </td>
                      {items.map((product) => (
                        <td key={product.id} className="p-5 text-sm text-text-primary text-center">
                          <div className="flex flex-wrap gap-1 justify-center">
                            {product.sizes
                              ?.filter((s) => s.isAvailable)
                              .map((s) => (
                                <span
                                  key={s.id}
                                  className="inline-block px-2 py-0.5 border border-border rounded text-xs"
                                >
                                  UK {s.size}
                                </span>
                              ))}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Colors */}
                    <tr className="border-b border-border">
                      <td className="p-5 text-sm font-semibold text-text-primary bg-background-secondary">
                        Colors
                      </td>
                      {items.map((product) => (
                        <td key={product.id} className="p-5 text-center">
                          <div className="flex flex-wrap gap-2 justify-center">
                            {product.colors?.map((color) => (
                              <span
                                key={color.id}
                                className="inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-0.5 text-xs"
                              >
                                <span
                                  className="w-3 h-3 rounded-full border border-border"
                                  style={{ backgroundColor: color.hexCode || "#ccc" }}
                                />
                                {color.name}
                              </span>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* WhatsApp */}
                    <tr>
                      <td className="p-5 text-sm font-semibold text-text-primary bg-background-secondary">
                        Enquire
                      </td>
                      {items.map((product) => (
                        <td key={product.id} className="p-5 text-center">
                          <a
                            href={getWhatsAppUrl(product.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            WhatsApp
                          </a>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
