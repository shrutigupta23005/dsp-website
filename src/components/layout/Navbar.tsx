"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Heart,
  User,
  Menu,
  X,
  LogIn,
  ChevronDown,
  ShoppingBag,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  {
    label: "Men",
    href: "/products?gender=MEN",
    submenu: [
      { label: "Sports", href: "/products?gender=MEN&subcategory=men-sports" },
      { label: "Casual", href: "/products?gender=MEN&subcategory=men-casual" },
      { label: "Formal", href: "/products?gender=MEN&subcategory=men-formal" },
      { label: "Boots", href: "/products?gender=MEN&subcategory=men-boots" },
      { label: "Sandals", href: "/products?gender=MEN&subcategory=men-sandals" },
      { label: "Slippers", href: "/products?gender=MEN&subcategory=men-slippers" },
    ],
  },
  {
    label: "Women",
    href: "/products?gender=WOMEN",
    submenu: [
      { label: "Sports", href: "/products?gender=WOMEN&subcategory=women-sports" },
      { label: "Casual", href: "/products?gender=WOMEN&subcategory=women-casual" },
      { label: "Fancy", href: "/products?gender=WOMEN&subcategory=women-fancy" },
      { label: "Heels", href: "/products?gender=WOMEN&subcategory=women-heels" },
      { label: "Boots", href: "/products?gender=WOMEN&subcategory=women-boots" },
      { label: "Sandals", href: "/products?gender=WOMEN&subcategory=women-sandals" },
    ],
  },
  {
    label: "Kids",
    href: "/products?gender=KIDS",
    submenu: [
      { label: "School Shoes", href: "/products?gender=KIDS&subcategory=kids-school" },
      { label: "Sports", href: "/products?gender=KIDS&subcategory=kids-sports" },
      { label: "Casual", href: "/products?gender=KIDS&subcategory=kids-casual" },
      { label: "Sandals", href: "/products?gender=KIDS&subcategory=kids-sandals" },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const { data: session } = useSession();

  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-[200] transition-all duration-500",
          isHomePage && !isScrolled && !isMobileOpen
            ? "bg-transparent"
            : "bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/5",
          isScrolled && "shadow-lg"
        )}
      >
        <div className="container-wide">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group" id="navbar-logo">
              <div className="relative">
                <ShoppingBag
                  className="w-8 h-8 text-accent transition-transform duration-300 group-hover:scale-110"
                  strokeWidth={1.5}
                />
              </div>
              <div className="flex flex-col">
                <span
                  className="text-lg font-bold tracking-tight text-white leading-none"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Delhi Shoe Palace
                </span>
                <span className="text-[10px] font-medium tracking-[0.2em] text-accent/80 uppercase">
                  Est. 2001
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.submenu && setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors duration-200",
                      pathname === link.href
                        ? "text-accent"
                        : "text-white/70 hover:text-white"
                    )}
                    id={`nav-link-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                    {link.submenu && (
                      <ChevronDown
                        className={cn(
                          "w-3.5 h-3.5 transition-transform duration-200",
                          activeDropdown === link.label && "rotate-180"
                        )}
                      />
                    )}
                  </Link>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {link.submenu && activeDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-0 mt-1 w-52 bg-[#111111] border border-white/10 rounded-lg shadow-xl overflow-hidden"
                      >
                        <div className="py-2">
                          {link.submenu.map((sub) => (
                            <Link
                              key={sub.label}
                              href={sub.href}
                              className="block px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors duration-150"
                              id={`nav-sub-${sub.label.toLowerCase().replace(/\s+/g, "-")}`}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-2">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/5"
                aria-label="Search products"
                id="navbar-search-btn"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              {session ? (
                <Link
                  href="/wishlist"
                  className="p-2.5 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/5 hidden sm:flex"
                  aria-label="Wishlist"
                  id="navbar-wishlist-btn"
                >
                  <Heart className="w-5 h-5" />
                </Link>
              ) : null}

              {/* Profile / Login */}
              {session ? (
                <div className="relative group">
                  <button
                    className="flex items-center gap-2 p-2 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/5"
                    id="navbar-profile-btn"
                  >
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "Profile"}
                        className="w-7 h-7 rounded-full object-cover border border-accent/30"
                      />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-48 bg-[#111111] border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-white/5">
                        <p className="text-sm font-medium text-white truncate">
                          {session.user?.name}
                        </p>
                        <p className="text-xs text-white/40 truncate">
                          {session.user?.email}
                        </p>
                      </div>
                      <Link
                        href="/profile"
                        className="block px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/wishlist"
                        className="block px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5"
                      >
                        Wishlist
                      </Link>
                      <Link
                        href="/recently-viewed"
                        className="block px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5"
                      >
                        Recently Viewed
                      </Link>
                      {session.user?.role === "ADMIN" && (
                        <Link
                          href="/admin/dashboard"
                          className="block px-4 py-2.5 text-sm text-accent hover:bg-white/5"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 border-t border-white/5"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#0A0A0A] bg-accent hover:bg-accent-hover transition-all duration-200 rounded-md"
                  id="navbar-login-btn"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
              )}

              {/* Mobile Hamburger */}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden p-2.5 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/5"
                aria-label="Toggle menu"
                id="navbar-menu-btn"
              >
                {isMobileOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Guest Badge */}
        {!session && isHomePage && !isScrolled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden lg:block bg-accent/10 border-t border-accent/20"
          >
            <div className="container-wide">
              <div className="flex items-center justify-center gap-2 py-2 text-xs text-accent">
                <LogIn className="w-3.5 h-3.5" />
                <span>Login to unlock the full catalog, wishlist, and personalized recommendations</span>
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] bg-[#0A0A0A]/95 backdrop-blur-md flex items-start justify-center pt-[20vh]"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full max-w-xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-white/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for shoes, brands, categories..."
                    className="w-full h-16 pl-14 pr-14 bg-white/5 border border-white/10 rounded-2xl text-white text-lg placeholder:text-white/30 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all"
                    autoFocus
                    id="search-input"
                  />
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </form>
              <p className="text-center text-white/30 text-sm mt-4">
                Press Enter to search or Esc to close
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[190] bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-[195] w-[300px] bg-[#0A0A0A] border-l border-white/5 overflow-y-auto lg:hidden"
            >
              <div className="p-6 pt-20">
                {/* Mobile Nav Links */}
                <div className="space-y-1">
                  {NAV_LINKS.map((link) => (
                    <div key={link.label}>
                      <Link
                        href={link.href}
                        className={cn(
                          "block px-4 py-3 text-base font-medium rounded-lg transition-colors",
                          pathname === link.href
                            ? "text-accent bg-accent/10"
                            : "text-white/70 hover:text-white hover:bg-white/5"
                        )}
                      >
                        {link.label}
                      </Link>
                      {link.submenu && (
                        <div className="ml-4 mt-1 space-y-1">
                          {link.submenu.map((sub) => (
                            <Link
                              key={sub.label}
                              href={sub.href}
                              className="block px-4 py-2 text-sm text-white/40 hover:text-white/70 transition-colors"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Mobile Auth Section */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  {session ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 px-4 py-2">
                        {session.user?.image ? (
                          <img
                            src={session.user.image}
                            alt={session.user.name || "Profile"}
                            className="w-10 h-10 rounded-full border border-accent/30"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                            <User className="w-5 h-5 text-accent" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-white">
                            {session.user?.name}
                          </p>
                          <p className="text-xs text-white/40">
                            {session.user?.email}
                          </p>
                        </div>
                      </div>
                      <Link
                        href="/wishlist"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/60 hover:text-white transition-colors"
                      >
                        <Heart className="w-4 h-4" />
                        Wishlist
                      </Link>
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 transition-colors"
                      >
                        <LogIn className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/auth/login"
                      className="flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold text-[#0A0A0A] bg-accent hover:bg-accent-hover rounded-lg transition-colors"
                    >
                      <LogIn className="w-4 h-4" />
                      Login / Sign Up
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
