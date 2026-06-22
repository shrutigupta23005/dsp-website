"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Clock, MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/utils";

export default function StoreInfo() {
  return (
    <section className="py-24 bg-white" id="store-info">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="eyebrow">Visit Us</span>
          <h2
            className="text-4xl md:text-5xl font-bold text-text-primary mt-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Our Store
          </h2>
          <div className="golden-rule-center" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-xl overflow-hidden aspect-square lg:aspect-auto lg:min-h-[400px] border border-border"
          >
            <iframe
              src={
                process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ||
                "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.5!2d77.19!3d28.65!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM5JzAwLjAiTiA3N8KwMTEnMjQuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
              }
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "400px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Delhi Shoe Palace Store Location"
            />
          </motion.div>

          {/* Store Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col justify-center"
          >
            <div className="space-y-8">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-1">
                    Address
                  </h3>
                  <p className="text-text-muted leading-relaxed">
                    Delhi Shoe Palace
                    <br />
                    Karol Bagh, New Delhi
                    <br />
                    India — 110005
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-1">
                    Phone
                  </h3>
                  <a
                    href="tel:+919999999999"
                    className="text-text-muted hover:text-accent transition-colors"
                  >
                    +91 99999 99999
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-1">
                    Business Hours
                  </h3>
                  <p className="text-text-muted">
                    Mon — Sat: 10:00 AM to 9:00 PM
                    <br />
                    Sunday: 11:00 AM to 7:00 PM
                  </p>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20BD5A] text-white px-6 py-3.5 rounded-lg font-semibold text-sm transition-all duration-200 hover:shadow-lg"
                id="store-whatsapp-btn"
              >
                <MessageCircle className="w-5 h-5" />
                Chat with Us on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
