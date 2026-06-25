"use client";

import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface WhatsAppInquiryProps {
  productName?: string;
  size?: string;
  color?: string;
  variant?: "full" | "icon" | "floating";
  className?: string;
}

function buildWhatsAppUrl(productName?: string, size?: string, color?: string) {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999";
  const parts: string[] = [];

  if (productName) {
    parts.push(`Hi, I'm interested in "${productName}" from Delhi Shoe Palace.`);
  } else {
    parts.push("Hi, I'd like to know more about your products at Delhi Shoe Palace.");
  }

  if (size) parts.push(`Size: ${size}`);
  if (color) parts.push(`Color: ${color}`);

  if (productName) {
    parts.push("Could you provide more details?");
  }

  return `https://wa.me/${phone}?text=${encodeURIComponent(parts.join(" "))}`;
}

export default function WhatsAppInquiry({
  productName,
  size,
  color,
  variant = "full",
  className,
}: WhatsAppInquiryProps) {
  const url = buildWhatsAppUrl(productName, size, color);

  if (variant === "floating") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "fixed bottom-6 right-6 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-colors duration-200 hover:bg-[#20BD5A] whatsapp-pulse",
          className
        )}
        aria-label="Contact us on WhatsApp"
        id="floating-whatsapp-inquiry"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </a>
    );
  }

  if (variant === "icon") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white transition-colors duration-200 hover:bg-[#20BD5A]",
          className
        )}
        aria-label="Inquire on WhatsApp"
        id="whatsapp-icon-btn"
      >
        <MessageCircle className="h-4 w-4" />
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#20BD5A] hover:shadow-lg",
        className
      )}
      id="whatsapp-inquiry-btn"
    >
      <MessageCircle className="h-4 w-4" />
      Inquire on WhatsApp
    </a>
  );
}
