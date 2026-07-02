import {
  trackProductView,
  trackWishlistAdd,
  trackWhatsAppClick,
  trackQuizComplete,
  trackSearch,
  trackCompareStart,
} from "@/lib/analytics";

export function useAnalytics() {
  return {
    trackProductView,
    trackWishlist: trackWishlistAdd,
    trackWhatsApp: trackWhatsAppClick,
    trackQuiz: trackQuizComplete,
    trackSearch,
    trackCompare: trackCompareStart,
  };
}
