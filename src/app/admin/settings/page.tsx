"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
  Store,
  Shield,
  AlertTriangle,
  Eye,
  EyeOff,
  Loader2,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"store" | "security" | "danger">("store");

  // Store Settings Form State
  const [storeName, setStoreName] = useState("Delhi Shoe Palace");
  const [whatsapp, setWhatsapp] = useState("9999999999");
  const [address, setAddress] = useState("Karol Bagh, New Delhi, India");
  const [mapsUrl, setMapsUrl] = useState("https://www.google.com/maps/embed?pb=mock");
  const [instagram, setInstagram] = useState("https://instagram.com/delhishoepalace");
  const [facebook, setFacebook] = useState("https://facebook.com/delhishoepalace");
  const [monSatOpen, setMonSatOpen] = useState("10:00");
  const [monSatClose, setMonSatClose] = useState("21:00");
  const [sunOpen, setSunOpen] = useState("11:00");
  const [sunClose, setSunClose] = useState("19:00");
  const [savingStore, setSavingStore] = useState(false);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, text: "None", color: "bg-[#2A2A2A]" };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score, text: "Weak", color: "bg-[#EF4444]" };
    if (score === 2 || score === 3) return { score, text: "Medium", color: "bg-[#F59E0B]" };
    return { score, text: "Strong", color: "bg-[#22C55E]" };
  };

  const strength = getPasswordStrength(newPassword);

  // Save Store Settings
  const handleSaveStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingStore(true);
    // Simulate API saving
    setTimeout(() => {
      setSavingStore(false);
      toast.success("Store configurations updated successfully!");
    }, 1000);
  };

  // Change Password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setUpdatingPassword(true);
    try {
      const res = await fetch("/api/admin/settings/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update password");

      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "Could not update password");
    } finally {
      setUpdatingPassword(false);
    }
  };

  // Danger Zone DB Resets
  const handleClearRecentlyViewed = async () => {
    try {
      const res = await fetch("/api/admin/settings/danger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clear-views" }),
      });
      if (!res.ok) throw new Error("Clear failed");
      toast.success("Recently viewed logs cleared successfully");
    } catch {
      toast.error("Failed to clear recently viewed logs");
    }
  };

  const handleResetWishlists = async () => {
    try {
      const res = await fetch("/api/admin/settings/danger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset-wishlists" }),
      });
      if (!res.ok) throw new Error("Reset failed");
      toast.success("Wishlist counts reset successfully");
    } catch {
      toast.error("Failed to reset wishlist counts");
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-[200px_1fr] items-start">
      {/* LEFT NAVIGATION */}
      <div className="bg-[#1A1A1A] border border-[#242424] rounded-2xl p-3 space-y-1 md:sticky md:top-20">
        {[
          ["store", "Store Settings", Store, "text-[#F5F5F5]"],
          ["security", "Account Security", Shield, "text-[#F5F5F5]"],
          ["danger", "Danger Zone", AlertTriangle, "text-[#EF4444]"],
        ].map(([tab, label, Icon, textClass]: any) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "w-full flex items-center gap-3 h-10 px-3 rounded-lg text-left text-xs font-semibold font-sans transition-all cursor-pointer border-l-2",
                isActive
                  ? "bg-[#1A1205] border-[#C9933A] text-[#C9933A]"
                  : "border-transparent text-[#6B6B6B] hover:bg-[#141414] hover:text-[#F5F5F5]"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0",
                  isActive ? "text-[#C9933A]" : tab === "danger" ? "text-[#EF4444]" : "text-[#3A3A3A]"
                )}
              />
              <span className={cn(!isActive && textClass)}>{label}</span>
            </button>
          );
        })}
      </div>

      {/* RIGHT CONTENT */}
      <div className="space-y-4">
        {/* 1. STORE SETTINGS */}
        {activeTab === "store" && (
          <div className="bg-[#1A1A1A] border border-[#242424] rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-base font-semibold text-[#F5F5F5] font-sans">
                Store Settings
              </h3>
              <span className="text-xs font-mono text-[#6B6B6B]">
                Update store coordinates and business hours
              </span>
            </div>

            <form onSubmit={handleSaveStore} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Store Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#6B6B6B]">Store Name</label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="h-10 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-3 text-sm text-[#F5F5F5] focus:border-[#C9933A] outline-none"
                    required
                  />
                </div>

                {/* WhatsApp */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#6B6B6B]">WhatsApp Inquiry Number</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-mono text-[#6B6B6B]">+91</span>
                    <input
                      type="text"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="h-10 w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg pl-12 pr-3 text-sm text-[#F5F5F5] font-mono focus:border-[#C9933A] outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#6B6B6B]">Store Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  className="bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg p-3 text-sm text-[#F5F5F5] focus:border-[#C9933A] outline-none resize-none"
                  required
                />
              </div>

              {/* Maps Embed */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#6B6B6B]">Google Maps Embed URL</label>
                <input
                  type="text"
                  value={mapsUrl}
                  onChange={(e) => setMapsUrl(e.target.value)}
                  className="h-10 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-3 text-sm text-[#F5F5F5] focus:border-[#C9933A] outline-none"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Instagram */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#6B6B6B]">Instagram Link</label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="h-10 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-3 text-sm text-[#F5F5F5] focus:border-[#C9933A] outline-none"
                  />
                </div>

                {/* Facebook */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#6B6B6B]">Facebook Link</label>
                  <input
                    type="text"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    className="h-10 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-3 text-sm text-[#F5F5F5] focus:border-[#C9933A] outline-none"
                  />
                </div>
              </div>

              {/* Business Hours */}
              <div className="border-t border-[#242424] pt-4 space-y-3">
                <h4 className="text-xs font-mono text-[#6B6B6B] uppercase tracking-wider">
                  Store Hours
                </h4>

                <div className="grid gap-4 md:grid-cols-2">
                  {/* Mon-Sat */}
                  <div className="bg-[#141414] border border-[#242424] p-3 rounded-xl flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#F5F5F5]">Mon &ndash; Sat</span>
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <input
                        type="time"
                        value={monSatOpen}
                        onChange={(e) => setMonSatOpen(e.target.value)}
                        className="bg-[#0F0F0F] border border-[#2A2A2A] rounded p-1 text-[#F5F5F5]"
                      />
                      <span className="text-[#3A3A3A]">&ndash;</span>
                      <input
                        type="time"
                        value={monSatClose}
                        onChange={(e) => setMonSatClose(e.target.value)}
                        className="bg-[#0F0F0F] border border-[#2A2A2A] rounded p-1 text-[#F5F5F5]"
                      />
                    </div>
                  </div>

                  {/* Sun */}
                  <div className="bg-[#141414] border border-[#242424] p-3 rounded-xl flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#F5F5F5]">Sunday</span>
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <input
                        type="time"
                        value={sunOpen}
                        onChange={(e) => setSunOpen(e.target.value)}
                        className="bg-[#0F0F0F] border border-[#2A2A2A] rounded p-1 text-[#F5F5F5]"
                      />
                      <span className="text-[#3A3A3A]">&ndash;</span>
                      <input
                        type="time"
                        value={sunClose}
                        onChange={(e) => setSunClose(e.target.value)}
                        className="bg-[#0F0F0F] border border-[#2A2A2A] rounded p-1 text-[#F5F5F5]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={savingStore}
                  className="bg-[#C9933A] text-[#0F0F0F] hover:bg-[#E5AC52] transition-colors h-10 px-5 rounded-lg text-xs font-semibold font-sans flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {savingStore && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 2. ACCOUNT SECURITY */}
        {activeTab === "security" && (
          <div className="bg-[#1A1A1A] border border-[#242424] rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-base font-semibold text-[#F5F5F5] font-sans">
                Change Password
              </h3>
              <span className="text-xs font-mono text-[#6B6B6B]">
                Regularly update credentials for safety
              </span>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
              {/* Current Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#6B6B6B]">Current Password</label>
                <div className="relative flex items-center">
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="h-10 w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-3 pr-10 text-sm text-[#F5F5F5] focus:border-[#C9933A] outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 text-[#6B6B6B] hover:text-[#F5F5F5] cursor-pointer"
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#6B6B6B]">New Password</label>
                <div className="relative flex items-center">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-10 w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-3 pr-10 text-sm text-[#F5F5F5] focus:border-[#C9933A] outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 text-[#6B6B6B] hover:text-[#F5F5F5] cursor-pointer"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Strength Meter */}
                {newPassword && (
                  <div className="mt-1 space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-[#6B6B6B]">
                      <span>Password Strength</span>
                      <span className="font-bold">{strength.text}</span>
                    </div>
                    <div className="h-1 w-full bg-[#0F0F0F] rounded-full overflow-hidden flex gap-0.5">
                      <div className={cn("h-full flex-1", strength.score >= 1 ? strength.color : "bg-transparent")} />
                      <div className={cn("h-full flex-1", strength.score >= 2 ? strength.color : "bg-transparent")} />
                      <div className={cn("h-full flex-1", strength.score >= 3 ? strength.color : "bg-transparent")} />
                      <div className={cn("h-full flex-1", strength.score >= 4 ? strength.color : "bg-transparent")} />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#6B6B6B]">Confirm New Password</label>
                <div className="relative flex items-center">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-10 w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-3 pr-10 text-sm text-[#F5F5F5] focus:border-[#C9933A] outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 text-[#6B6B6B] hover:text-[#F5F5F5] cursor-pointer"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={updatingPassword}
                  className="bg-[#C9933A] text-[#0F0F0F] hover:bg-[#E5AC52] transition-colors h-10 px-5 rounded-lg text-xs font-semibold font-sans flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {updatingPassword && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Update Password
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 3. DANGER ZONE */}
        {activeTab === "danger" && (
          <div className="bg-[#1A1A1A] border border-[#EF4444]/30 rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-base font-semibold text-[#EF4444] font-sans">
                Danger Zone
              </h3>
              <span className="text-xs font-mono text-[#6B6B6B]">
                Destructive catalog reset options
              </span>
            </div>

            <div className="divide-y divide-[#242424] space-y-4">
              {/* Row 1: Clear Viewed History */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-[#F5F5F5] font-sans">
                    Clear Recently Viewed Data
                  </h4>
                  <p className="text-xs text-[#6B6B6B] max-w-md leading-normal">
                    This resets all users recently viewed browsing history lists across the store. Product details and core catalogs are untouched.
                  </p>
                </div>

                <ConfirmDialog
                  trigger={
                    <button className="border border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors h-9 px-4 rounded-lg text-xs font-mono uppercase font-bold flex items-center gap-1.5 cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                      Clear
                    </button>
                  }
                  title="Clear Recently Viewed Logs?"
                  description="This action is irreversible. All customers browsing histories will be reset to empty. Continue?"
                  confirmLabel="Clear Logs"
                  variant="danger"
                  onConfirm={handleClearRecentlyViewed}
                />
              </div>

              {/* Row 2: Reset Wishlist Counts */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-[#F5F5F5] font-sans">
                    Reset All Wishlist Counts
                  </h4>
                  <p className="text-xs text-[#6B6B6B] max-w-md leading-normal">
                    This will delete all customer wishlists and reset the `wishlistCount` counters back to zero for all products in the database.
                  </p>
                </div>

                <ConfirmDialog
                  trigger={
                    <button className="border border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors h-9 px-4 rounded-lg text-xs font-mono uppercase font-bold flex items-center gap-1.5 cursor-pointer">
                      <RefreshCw className="w-3.5 h-3.5" />
                      Reset
                    </button>
                  }
                  title="Reset All Wishlists?"
                  description="Are you absolutely sure? All saved product wishlists for all customers will be wiped, and counters reset to 0."
                  confirmLabel="Reset All"
                  variant="danger"
                  onConfirm={handleResetWishlists}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
