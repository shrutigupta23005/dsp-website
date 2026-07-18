const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999";

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const whatsAppMessages = {
  general: () =>
    "Hi, I'd like to know more about Delhi Shoe Palace.",
  product: (name: string, size?: string, color?: string) =>
    `Hi, I'm interested in the ${name}${size ? ` (Size: UK ${size})` : ""}${color ? ` in ${color}` : ""}. Is it available in store?`,
  wishlist: (productName: string) =>
    `Hi, I've been eyeing the ${productName} on your website. Is it currently available?`,
  quiz: () =>
    "Hi, I just completed the style quiz on your website and got some recommendations. Can you help me find the right pair?",
  directions: () =>
    "Hi, I'd like to visit your store. Can you share your exact address and timings?",
  bulk: () =>
    "Hi, I'm interested in placing a bulk order. Can we discuss pricing and availability?",
};
