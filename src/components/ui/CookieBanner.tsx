"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, ChevronUp } from "lucide-react";
import Link from "next/link";

interface CookieConsent {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("dsp_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (consent: CookieConsent) => {
    localStorage.setItem("dsp_cookie_consent", JSON.stringify(consent));
    setIsVisible(false);

    // Handle analytics consent
    if (consent.analytics && typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
      });
    }
  };

  const acceptAll = () => {
    saveConsent({ essential: true, analytics: true, marketing: true });
  };

  const rejectNonEssential = () => {
    saveConsent({ essential: true, analytics: false, marketing: false });
  };

  const savePreferences = () => {
    saveConsent({ essential: true, analytics, marketing });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-[9998]"
        >
          {/* Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div
                  className="rounded-t-xl p-6 mx-4 md:mx-16"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    borderBottom: "none",
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3
                      className="text-sm font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Cookie Settings
                    </h3>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="p-1 rounded-md transition-colors hover:opacity-70"
                      aria-label="Close settings"
                    >
                      <ChevronUp
                        className="h-4 w-4"
                        style={{ color: "var(--text-muted)" }}
                      />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Essential — always on */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className="text-sm font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          Essential Cookies
                        </p>
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: "var(--text-muted)" }}
                        >
                          Required for the website to function
                        </p>
                      </div>
                      <div
                        className="h-6 w-11 rounded-full relative opacity-50 cursor-not-allowed"
                        style={{ background: "var(--accent-color)" }}
                      >
                        <span
                          className="absolute top-0.5 right-0.5 h-5 w-5 rounded-full bg-white"
                        />
                      </div>
                    </div>

                    {/* Analytics */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className="text-sm font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          Analytics Cookies
                        </p>
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: "var(--text-muted)" }}
                        >
                          Help us improve our website
                        </p>
                      </div>
                      <button
                        onClick={() => setAnalytics(!analytics)}
                        className="h-6 w-11 rounded-full relative transition-colors"
                        style={{
                          background: analytics
                            ? "var(--accent-color)"
                            : "var(--border-color)",
                        }}
                        role="switch"
                        aria-checked={analytics}
                      >
                        <span
                          className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all"
                          style={{
                            left: analytics ? "calc(100% - 22px)" : "2px",
                          }}
                        />
                      </button>
                    </div>

                    {/* Marketing */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className="text-sm font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          Marketing Cookies
                        </p>
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: "var(--text-muted)" }}
                        >
                          Used for targeted advertising
                        </p>
                      </div>
                      <button
                        onClick={() => setMarketing(!marketing)}
                        className="h-6 w-11 rounded-full relative transition-colors"
                        style={{
                          background: marketing
                            ? "var(--accent-color)"
                            : "var(--border-color)",
                        }}
                        role="switch"
                        aria-checked={marketing}
                      >
                        <span
                          className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all"
                          style={{
                            left: marketing ? "calc(100% - 22px)" : "2px",
                          }}
                        />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={savePreferences}
                    className="mt-4 w-full rounded-lg py-2.5 text-sm font-semibold transition-colors"
                    style={{
                      background: "var(--accent-color)",
                      color: "var(--text-on-accent)",
                    }}
                  >
                    Save Preferences
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Banner */}
          <div
            className="py-4 px-6 md:py-5 md:px-16"
            style={{
              background: "var(--bg-card)",
              borderTop: "1px solid var(--border-color)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Text */}
              <div className="flex items-start gap-3 flex-1">
                <Cookie
                  className="h-5 w-5 mt-0.5 shrink-0"
                  style={{ color: "var(--text-muted)" }}
                />
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  We use cookies to improve your experience and analyze site
                  traffic.{" "}
                  <Link
                    href="/privacy"
                    className="underline transition-colors"
                    style={{ color: "var(--accent-color)" }}
                  >
                    Privacy Policy
                  </Link>
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="rounded-lg px-4 py-2 text-[13px] font-medium transition-colors"
                  style={{
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                    background: "transparent",
                  }}
                >
                  Cookie Settings
                </button>
                <button
                  onClick={rejectNonEssential}
                  className="rounded-lg px-4 py-2 text-[13px] font-medium transition-colors"
                  style={{
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                    background: "transparent",
                  }}
                >
                  Reject Non-Essential
                </button>
                <button
                  onClick={acceptAll}
                  className="rounded-lg px-4 py-2 text-[13px] font-medium transition-colors"
                  style={{
                    background: "var(--accent-color)",
                    color: "var(--text-on-accent)",
                  }}
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Extend Window for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}
