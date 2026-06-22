import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with clsx for conditional class composition */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Format price in Indian Rupees */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/** Generate a URL-friendly slug from a string */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Truncate text to a specified length with ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

/** Generate WhatsApp URL with pre-filled message */
export function getWhatsAppUrl(productName?: string): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999";
  const message = productName
    ? `Hi, I'm interested in "${productName}" from Delhi Shoe Palace. Could you provide more details?`
    : "Hi, I'd like to know more about your products at Delhi Shoe Palace.";
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/** Delay utility for async operations */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Get initials from a name */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/** Build product status label */
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    AVAILABLE: "Available",
    LIMITED: "Limited Stock",
    TRENDING: "Trending",
    NEW_ARRIVAL: "New Arrival",
  };
  return labels[status] || status;
}

/** Get status badge color classes */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    AVAILABLE: "bg-green-100 text-green-800",
    LIMITED: "bg-orange-100 text-orange-800",
    TRENDING: "bg-purple-100 text-purple-800",
    NEW_ARRIVAL: "bg-blue-100 text-blue-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

/** Calculate number of pages */
export function calculateTotalPages(total: number, perPage: number): number {
  return Math.ceil(total / perPage);
}

/** Absolute URL helper */
export function absoluteUrl(path: string): string {
  return `${process.env.NEXTAUTH_URL || "http://localhost:3000"}${path}`;
}
