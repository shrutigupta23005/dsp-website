import Link from "next/link";
import {
  ShoppingBag,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
} from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/social";
import NewsletterForm from "@/components/newsletter/NewsletterForm";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "All Products", href: "/products" },
];

const CATEGORY_LINKS = [
  { label: "Men's Footwear", href: "/products?gender=MEN" },
  { label: "Women's Footwear", href: "/products?gender=WOMEN" },
  { label: "Kids' Footwear", href: "/products?gender=KIDS" },
  { label: "Sports Shoes", href: "/products?subcategory=men-sports" },
  { label: "Formal Shoes", href: "/products?subcategory=men-formal" },
  { label: "Casual Shoes", href: "/products?subcategory=men-casual" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="force-dark border-t border-white/5">
      {/* Newsletter Section */}
      <div className="container-wide py-12 border-b border-white/5">
        <div className="max-w-lg">
          <NewsletterForm variant="footer" />
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-wide py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <ShoppingBag
                className="w-8 h-8 text-[#C9933A]"
                strokeWidth={1.5}
              />
              <div>
                <span
                  className="text-lg font-bold text-white block leading-none"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Delhi Shoe Palace
                </span>
                <span className="text-[10px] tracking-[0.2em] text-[#C9933A]/80 uppercase">
                  Est. 2001
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-6 text-white/60">
              Trusted by thousands of customers for over 24 years. Your
              destination for premium footwear from 200+ brands.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-[#C9933A] hover:text-[#C9933A] transition-all duration-200 text-white/60"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-[#C9933A] hover:text-[#C9933A] transition-all duration-200 text-white/60"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-[#25D366] hover:text-[#25D366] transition-all duration-200 text-white/60"
                aria-label="Chat on WhatsApp"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-[#C9933A] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">
              Categories
            </h3>
            <ul className="space-y-3">
              {CATEGORY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-[#C9933A] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">
              Visit Our Store
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C9933A] mt-0.5 shrink-0" />
                <a
                  href={SOCIAL_LINKS.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/60 hover:text-[#C9933A] transition-colors"
                >
                  Delhi Shoe Palace, Karol Bagh,
                  <br />
                  New Delhi, India — 110005
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#C9933A] shrink-0" />
                <a
                  href="tel:+919999999999"
                  className="text-sm text-white/60 hover:text-[#C9933A] transition-colors"
                >
                  +91 99999 99999
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C9933A] shrink-0" />
                <a
                  href="mailto:contact@delhishoepalace.com"
                  className="text-sm text-white/60 hover:text-[#C9933A] transition-colors"
                >
                  contact@delhishoepalace.com
                </a>
              </li>
            </ul>

            <div className="mt-6">
              <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
                Business Hours
              </p>
              <p className="text-sm text-white/60">Mon — Sat: 10:00 AM to 9:00 PM</p>
              <p className="text-sm text-white/60">Sunday: 11:00 AM to 7:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="container-wide py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <p className="text-xs text-white/30">
              &copy; {new Date().getFullYear()} Delhi Shoe Palace. All rights
              reserved.
            </p>
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-white/30 hover:text-white/60 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-xs text-white/20">
            Made with care for Delhi Shoe Palace
          </p>
        </div>
      </div>
    </footer>
  );
}
