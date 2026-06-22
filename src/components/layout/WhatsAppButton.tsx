"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { getWhatsAppUrl } from "@/lib/utils";

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.a
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="fixed bottom-6 right-6 z-[100] w-14 h-14 bg-[#25D366] hover:bg-[#20BD5A] rounded-full flex items-center justify-center shadow-lg transition-colors duration-200 whatsapp-pulse"
          aria-label="Contact us on WhatsApp"
          id="floating-whatsapp-btn"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
