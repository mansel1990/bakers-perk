"use client";

import { useState } from "react";

export default function MenuPdfDownload() {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const res = await fetch("/api/menu/pdf");
      if (!res.ok) throw new Error("PDF generation failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "bakers-perk-menu.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open("/api/menu/pdf", "_blank");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-medium text-on-ink transition-transform hover:scale-[1.02] disabled:opacity-60"
    >
      <svg
        aria-hidden
        className="h-3.5 w-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4v10m0 0l3.5-3.5M12 14l-3.5-3.5M5 18h14"
        />
      </svg>
      {loading ? "Preparing PDF…" : "Download PDF"}
    </button>
  );
}
