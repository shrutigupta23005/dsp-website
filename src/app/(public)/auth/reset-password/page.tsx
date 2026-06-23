"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Lock, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Unable to reset password");
        return;
      }

      toast.success("Password updated. Please sign in.");
      router.push("/auth/login");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-text-primary">
          New Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
            className="h-12 w-full rounded-lg border border-border bg-white pl-11 pr-4 text-sm text-text-primary focus:border-accent focus:outline-none"
          />
        </div>
      </div>
      <div>
        <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-text-primary">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
          minLength={8}
          className="h-12 w-full rounded-lg border border-border bg-white px-4 text-sm text-text-primary focus:border-accent focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !token}
        className="flex h-12 w-full items-center justify-center rounded-lg bg-accent text-sm font-semibold text-background-primary transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? "Updating..." : "Update Password"}
      </button>
      {!token ? (
        <p className="text-sm text-red-600">This reset link is missing a token. Please request a new link.</p>
      ) : null}
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background-secondary px-6">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-10 flex items-center gap-3">
          <ShoppingBag className="h-8 w-8 text-accent" strokeWidth={1.5} />
          <div>
            <span className="block text-lg font-bold leading-none text-text-primary" style={{ fontFamily: "var(--font-display)" }}>
              Delhi Shoe Palace
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-accent">Est. 2001</span>
          </div>
        </Link>
        <h1 className="mb-2 text-3xl font-bold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>
          Reset Password
        </h1>
        <p className="mb-8 text-text-muted">Choose a new password for your Delhi Shoe Palace account.</p>
        <Suspense fallback={<p className="text-sm text-text-muted">Loading reset form...</p>}>
          <ResetPasswordForm />
        </Suspense>
        <Link href="/auth/login" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover">
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>
      </div>
    </div>
  );
}
