"use client";

import { useState, useEffect } from "react";
import { Download, Loader2, Mail, Trash2, Users } from "lucide-react";
import { toast } from "sonner";

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  subscribed: boolean;
  createdAt: string;
}

interface NewsletterData {
  subscribers: Subscriber[];
  totalCount: number;
  subscribedCount: number;
  unsubscribedCount: number;
}

export default function AdminNewsletterPage() {
  const [data, setData] = useState<NewsletterData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/newsletter");
      if (!res.ok) throw new Error();
      const json = await res.json();
      setData(json);
    } catch {
      toast.error("Failed to load subscribers");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExport = () => {
    window.open("/api/admin/newsletter/export", "_blank");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-[#C9933A]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1
          className="text-2xl font-bold text-[#F5F5F5]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Newsletter
        </h1>
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium border border-[#C9933A] text-[#C9933A] hover:bg-[#C9933A]/10 transition-colors"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 flex-wrap">
        <StatPill
          icon={<Users className="h-3.5 w-3.5" />}
          label="Total"
          value={data?.totalCount || 0}
        />
        <StatPill
          icon={<Mail className="h-3.5 w-3.5" />}
          label="Active"
          value={data?.subscribedCount || 0}
        />
        <StatPill
          icon={<Trash2 className="h-3.5 w-3.5" />}
          label="Unsubscribed"
          value={data?.unsubscribedCount || 0}
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[#242424] bg-[#1A1A1A] overflow-hidden">
        {data?.subscribers.length === 0 ? (
          <div className="p-12 text-center">
            <Mail className="h-10 w-10 text-[#3A3A3A] mx-auto mb-3" />
            <p className="text-sm text-[#6B6B6B]">
              No subscribers yet. Add a newsletter form to your website.
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#242424]">
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#6B6B6B]">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#6B6B6B]">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#6B6B6B]">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#6B6B6B]">
                  Subscribed Since
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.subscribers.map((sub) => (
                <tr
                  key={sub.id}
                  className="border-b border-[#242424] last:border-0 hover:bg-[#242424]/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-[#F5F5F5]">
                    {sub.name || "—"}
                  </td>
                  <td
                    className="px-4 py-3 text-xs text-[#6B6B6B]"
                    style={{ fontFamily: "var(--font-utility)" }}
                  >
                    {sub.email}
                  </td>
                  <td className="px-4 py-3">
                    {sub.subscribed ? (
                      <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-[11px] font-medium text-green-400">
                        Subscribed
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-red-500/10 px-2.5 py-0.5 text-[11px] font-medium text-red-400">
                        Unsubscribed
                      </span>
                    )}
                  </td>
                  <td
                    className="px-4 py-3 text-xs text-[#6B6B6B]"
                    style={{ fontFamily: "var(--font-utility)" }}
                  >
                    {new Date(sub.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-[#1A1A1A] border border-[#242424] px-3 py-1.5">
      <span className="text-[#6B6B6B]">{icon}</span>
      <span
        className="text-[11px] text-[#6B6B6B] uppercase tracking-wider"
        style={{ fontFamily: "var(--font-utility)" }}
      >
        {label}
      </span>
      <span
        className="text-sm font-bold text-[#C9933A]"
        style={{ fontFamily: "var(--font-utility)" }}
      >
        {value}
      </span>
    </div>
  );
}
