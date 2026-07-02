/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

function gtag(...args: any[]) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag(...args);
}

export function trackPageView(url: string) {
  gtag("config", GA_ID, { page_path: url });
}

export function trackProductView(product: {
  id: string;
  name: string;
  brand: string;
  price: number;
}) {
  gtag("event", "view_item", {
    currency: "INR",
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_brand: product.brand,
        price: product.price,
      },
    ],
  });
}

export function trackWishlistAdd(product: {
  id: string;
  name: string;
  price: number;
}) {
  gtag("event", "add_to_wishlist", {
    currency: "INR",
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
      },
    ],
  });
}

export function trackWhatsAppClick(productName: string) {
  gtag("event", "whatsapp_inquiry", { product: productName });
}

export function trackQuizComplete(answers: Record<string, unknown>) {
  gtag("event", "quiz_completed", answers);
}

export function trackSearch(query: string, resultCount: number) {
  gtag("event", "search", {
    search_term: query,
    result_count: resultCount,
  });
}

export function trackCompareStart(productCount: number) {
  gtag("event", "compare_start", { product_count: productCount });
}
