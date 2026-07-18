"use client";

import { useState } from "react";
import { Download, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function DataExportSection() {
  const [isExporting, setIsExporting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await fetch("/api/user/export");
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "my-dsp-data.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Download started");
    } catch {
      toast.error("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDelete = async () => {
    if (deleteInput !== "DELETE") return;
    setIsDeleting(true);
    try {
      const res = await fetch("/api/user/delete", { method: "POST" });
      if (!res.ok) throw new Error("Delete failed");
      window.location.href = "/";
    } catch {
      toast.error("Failed to delete account");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="rounded-xl p-6"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-color)",
      }}
    >
      <h3
        className="text-base font-semibold mb-5"
        style={{ color: "var(--text-primary)" }}
      >
        Your Data & Privacy
      </h3>

      {/* Download Data */}
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 mb-5"
        style={{ borderBottom: "1px solid var(--border-color)" }}
      >
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            Download Your Data
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            Get a copy of all data we hold about you.
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors shrink-0"
          style={{
            border: "1px solid var(--accent-color)",
            color: "var(--accent-color)",
            background: "transparent",
            opacity: isExporting ? 0.6 : 1,
          }}
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Download My Data
        </button>
      </div>

      {/* Delete Account */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p
            className="text-sm font-medium"
            style={{ color: "var(--danger-color)" }}
          >
            Delete Account
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            Permanently delete your account and all data.
          </p>
        </div>
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors shrink-0"
            style={{
              border: "1px solid var(--danger-color)",
              color: "var(--danger-color)",
              background: "transparent",
            }}
          >
            <Trash2 className="h-4 w-4" />
            Delete Account
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder='Type "DELETE"'
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              className="h-9 w-32 rounded-lg px-3 text-sm"
              style={{
                border: "1px solid var(--danger-color)",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
              }}
            />
            <button
              onClick={handleDelete}
              disabled={deleteInput !== "DELETE" || isDeleting}
              className="rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-40"
              style={{
                background: "var(--danger-color)",
                color: "#fff",
              }}
            >
              {isDeleting ? "..." : "Confirm"}
            </button>
            <button
              onClick={() => {
                setShowDeleteConfirm(false);
                setDeleteInput("");
              }}
              className="text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
