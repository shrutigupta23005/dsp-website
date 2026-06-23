import type { Metadata } from "next";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact",
  description: "Visit Delhi Shoe Palace in Delhi or contact the store on WhatsApp.",
};

export default function ContactPage() {
  const address = process.env.NEXT_PUBLIC_STORE_ADDRESS || "Delhi Shoe Palace, Karol Bagh, New Delhi, India";
  const mapsUrl = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL;

  return (
    <div className="bg-background-secondary pt-28">
      <section className="container-wide section-pad">
        <p className="eyebrow">Visit The Store</p>
        <h1 className="section-title mt-3">Come Try Your Pair</h1>
        <span className="golden-rule" />
        <div className="mt-12 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-white p-6">
              <MapPin className="h-6 w-6 text-accent" />
              <h2 className="mt-4 text-xl font-semibold text-text-primary">Address</h2>
              <p className="mt-2 text-text-muted">{address}</p>
            </div>
            <div className="rounded-lg border border-border bg-white p-6">
              <Phone className="h-6 w-6 text-accent" />
              <h2 className="mt-4 text-xl font-semibold text-text-primary">Phone</h2>
              <a href="tel:+919999999999" className="mt-2 block text-text-muted hover:text-accent">+91 99999 99999</a>
            </div>
            <div className="rounded-lg border border-border bg-white p-6">
              <Clock className="h-6 w-6 text-accent" />
              <h2 className="mt-4 text-xl font-semibold text-text-primary">Business Hours</h2>
              <p className="mt-2 text-text-muted">Mon-Sat: 10:00 AM to 9:00 PM</p>
              <p className="text-text-muted">Sunday: 11:00 AM to 7:00 PM</p>
            </div>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 items-center justify-center gap-2 rounded-lg bg-accent font-semibold text-background-primary hover:bg-accent-hover"
            >
              <MessageCircle className="h-4 w-4" />
              Contact On WhatsApp
            </a>
          </div>
          <div className="min-h-[420px] overflow-hidden rounded-lg border border-border bg-white">
            {mapsUrl ? (
              <iframe
                src={mapsUrl}
                className="h-full min-h-[420px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Delhi Shoe Palace map"
              />
            ) : (
              <div className="flex h-full min-h-[420px] items-center justify-center p-8 text-center text-text-muted">
                Add NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL to show the store map here.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
