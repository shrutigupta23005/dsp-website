import Link from "next/link";
import {
  ShoppingBag,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
} from "lucide-react";

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

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-white/60 border-t border-white/5">
      {/* Main Footer */}
      <div className="container-wide py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <ShoppingBag
                className="w-8 h-8 text-accent"
                strokeWidth={1.5}
              />
              <div>
                <span
                  className="text-lg font-bold text-white block leading-none"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Delhi Shoe Palace
                </span>
                <span className="text-[10px] tracking-[0.2em] text-accent/80 uppercase">
                  Est. 2001
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              Trusted by thousands of customers for over 24 years. Your
              destination for premium footwear from 200+ brands.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-accent hover:text-accent transition-all duration-200"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-accent hover:text-accent transition-all duration-200"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-4 h-4" />
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
                    className="text-sm hover:text-accent transition-colors duration-200"
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
                    className="text-sm hover:text-accent transition-colors duration-200"
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
                <MapPin className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <span className="text-sm">
                  Delhi Shoe Palace, Karol Bagh,
                  <br />
                  New Delhi, India — 110005
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                <a
                  href="tel:+919999999999"
                  className="text-sm hover:text-accent transition-colors"
                >
                  +91 99999 99999
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <a
                  href="mailto:contact@delhishoepalace.com"
                  className="text-sm hover:text-accent transition-colors"
                >
                  contact@delhishoepalace.com
                </a>
              </li>
            </ul>

            <div className="mt-6">
              <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
                Business Hours
              </p>
              <p className="text-sm">Mon — Sat: 10:00 AM to 9:00 PM</p>
              <p className="text-sm">Sunday: 11:00 AM to 7:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="container-wide py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} Delhi Shoe Palace. All rights
            reserved.
          </p>
          <p className="text-xs text-white/20">
            Crafted with precision. No online orders — visit our store.
          </p>
        </div>
      </div>
    </footer>
  );
}
