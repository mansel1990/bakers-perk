"use client";

import { billDisplayDate, billRs } from "@/lib/bill/format";

export type InvoiceSummary = {
  id: number;
  invoiceNumber: string;
  date: string;
  customerName: string;
  totalInr: number;
  createdAt: string;
};

function formatWhen(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function InvoiceHistory({
  invoices,
  loading,
  onLoad,
  onDownload,
  onRefresh,
}: {
  invoices: InvoiceSummary[];
  loading: boolean;
  onLoad: (id: number) => void;
  onDownload: (id: number) => void;
  onRefresh: () => void;
}) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-5 lg:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[3px] text-accent">Invoice history</div>
          <p className="mt-2 text-sm text-muted">
            Past invoices are saved here — reload one to edit, or download the PDF again to share.
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className="rounded-full border border-line px-4 py-1.5 text-[11px] uppercase tracking-[2px] text-ink transition-colors hover:border-accent"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-muted">Loading history…</p>
      ) : invoices.length === 0 ? (
        <p className="mt-6 text-sm text-muted">No invoices yet. Download a PDF to save the first one.</p>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-[10px] uppercase tracking-[2px] text-muted">
                <th className="pb-3 pr-4 font-normal">Invoice #</th>
                <th className="pb-3 pr-4 font-normal">Date</th>
                <th className="pb-3 pr-4 font-normal">Customer</th>
                <th className="pb-3 pr-4 font-normal">Total</th>
                <th className="pb-3 pr-4 font-normal">Saved</th>
                <th className="pb-3 font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-line/60 last:border-0">
                  <td className="py-3 pr-4 font-medium text-ink">{inv.invoiceNumber}</td>
                  <td className="py-3 pr-4 text-muted">{billDisplayDate(inv.date)}</td>
                  <td className="py-3 pr-4">{inv.customerName}</td>
                  <td className="py-3 pr-4 font-medium">{billRs(inv.totalInr)}</td>
                  <td className="py-3 pr-4 text-xs text-muted">{formatWhen(inv.createdAt)}</td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => onLoad(inv.id)}
                        className="rounded-full border border-line px-3 py-1 text-[11px] text-ink transition-colors hover:border-accent"
                      >
                        Load
                      </button>
                      <button
                        type="button"
                        onClick={() => onDownload(inv.id)}
                        className="rounded-full bg-ink px-3 py-1 text-[11px] text-on-ink transition-transform hover:scale-[1.02]"
                      >
                        PDF
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
