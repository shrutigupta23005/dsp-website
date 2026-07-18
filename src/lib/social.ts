import { buildWhatsAppUrl, whatsAppMessages } from "./whatsapp";

export const SOCIAL_LINKS = {
  instagram:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ||
    "https://instagram.com/delhishoepalace",
  facebook:
    process.env.NEXT_PUBLIC_FACEBOOK_URL ||
    "https://facebook.com/delhishoepalace",
  whatsapp: buildWhatsAppUrl(whatsAppMessages.general()),
  googleReviews: process.env.NEXT_PUBLIC_GOOGLE_REVIEWS_URL || "#",
  maps:
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL || "https://maps.google.com",
};

export function buildShareUrl(
  platform: "whatsapp" | "facebook",
  productUrl: string,
  productName: string
): string {
  const text = `Check out ${productName} at Delhi Shoe Palace: ${productUrl}`;
  if (platform === "whatsapp") {
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }
  if (platform === "facebook") {
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
  }
  return productUrl;
}
