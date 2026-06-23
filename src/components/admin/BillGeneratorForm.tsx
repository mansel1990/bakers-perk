"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { computeLineAmount } from "@/lib/bill/calc";
import { DEFAULT_BILL_BANK, EMPTY_LINE_ITEM } from "@/lib/bill/defaults";
import { billRs } from "@/lib/bill/format";
import type { BillLineItem, BillPayload } from "@/lib/bill/types";
import { billSubtotal, billTotal } from "@/lib/bill/types";
import InvoiceHistory, { type InvoiceSummary } from "./InvoiceHistory";

const INPUT =
  "mt-1.5 w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent";

const INPUT_READONLY =
  "mt-1.5 w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm text-ink outline-none";

function todayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  className,
  readOnly,
}: {
  label: string;
  value: string | number;
  onChange?: (v: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
}) {
  return (
    <label className={className ?? "block"}>
      <span className="text-xs text-muted">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        placeholder={placeholder}
        readOnly={readOnly}
        className={readOnly ? INPUT_READONLY : INPUT}
      />
    </label>
  );
}

async function fetchNextInvoiceNumber(): Promise<string> {
  const res = await fetch("/api/admin/bill/next-number");
  if (!res.ok) throw new Error("Could not fetch invoice number.");
  const data = (await res.json()) as { invoiceNumber: string };
  return data.invoiceNumber;
}

export default function BillGeneratorForm() {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [date, setDate] = useState(todayIso());
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerCity, setCustomerCity] = useState("");
  const [customerZip, setCustomerZip] = useState("");
  const [discount, setDiscount] = useState("0");
  const [lineItems, setLineItems] = useState<BillLineItem[]>([
    { ...EMPTY_LINE_ITEM },
    { ...EMPTY_LINE_ITEM },
  ]);
  const [bank, setBank] = useState({ ...DEFAULT_BILL_BANK });
  const [loading, setLoading] = useState(false);
  const [loadingNumber, setLoadingNumber] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<InvoiceSummary[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [loadedInvoiceId, setLoadedInvoiceId] = useState<number | null>(null);

  const discountNum = Math.max(0, Number(discount) || 0);
  const subtotal = useMemo(() => billSubtotal(lineItems), [lineItems]);
  const total = useMemo(() => billTotal(lineItems, discountNum), [lineItems, discountNum]);

  const refreshHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch("/api/admin/bill/history");
      if (!res.ok) throw new Error("Failed to load history.");
      const data = (await res.json()) as { invoices: InvoiceSummary[] };
      setHistory(data.invoices);
    } catch {
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  const refreshNextNumber = useCallback(async () => {
    setLoadingNumber(true);
    try {
      const num = await fetchNextInvoiceNumber();
      setInvoiceNumber(num);
    } catch {
      setError("Could not load the next invoice number.");
    } finally {
      setLoadingNumber(false);
    }
  }, []);

  useEffect(() => {
    void refreshNextNumber();
    void refreshHistory();
  }, [refreshNextNumber, refreshHistory]);

  function updateLine(index: number, patch: Partial<BillLineItem>) {
    setLineItems((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function updateLineWithCalc(index: number, patch: Partial<BillLineItem>) {
    setLineItems((rows) =>
      rows.map((row, i) => {
        if (i !== index) return row;
        const next = { ...row, ...patch };
        if ("quantity" in patch || "rate" in patch) {
          const computed = computeLineAmount(next.quantity, next.rate);
          if (computed > 0) next.amount = computed;
        }
        return next;
      })
    );
  }

  function addLine() {
    setLineItems((rows) => [...rows, { ...EMPTY_LINE_ITEM }]);
  }

  function removeLine(index: number) {
    setLineItems((rows) => (rows.length <= 1 ? rows : rows.filter((_, i) => i !== index)));
  }

  function loadBill(bill: BillPayload, invoiceId?: number) {
    setLoadedInvoiceId(invoiceId ?? null);
    setInvoiceNumber(bill.invoiceNumber);
    setDate(bill.date || todayIso());
    setCustomerName(bill.customer.name);
    setCustomerAddress(bill.customer.address);
    setCustomerCity(bill.customer.city);
    setCustomerZip(bill.customer.zipCode);
    setDiscount(String(bill.discount));
    setLineItems(bill.lineItems.length > 0 ? bill.lineItems : [{ ...EMPTY_LINE_ITEM }]);
    setBank({ ...bill.bank });
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleLoadFromHistory(id: number) {
    try {
      const res = await fetch(`/api/admin/bill/${id}`);
      if (!res.ok) throw new Error("Could not load invoice.");
      const data = (await res.json()) as { bill: BillPayload };
      loadBill(data.bill, id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load invoice.");
    }
  }

  async function handleDownloadFromHistory(id: number) {
    try {
      const res = await fetch(`/api/admin/bill/${id}/pdf`);
      if (!res.ok) throw new Error("PDF download failed.");
      const blob = await res.blob();
      const disposition = res.headers.get("Content-Disposition") ?? "";
      const match = disposition.match(/filename="([^"]+)"/);
      const filename = match?.[1] ?? `bakers-perk-invoice.pdf`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not download PDF.");
    }
  }

  function buildPayload(): BillPayload | null {
    const items = lineItems
      .map((row) => ({
        ...row,
        description: row.description.trim(),
        quantity: row.quantity.trim(),
        rate: row.rate.trim(),
        amount: Number(row.amount) || 0,
      }))
      .filter((row) => row.description && row.amount > 0);

    if (items.length === 0) {
      setError("Add at least one line item with a description and amount.");
      return null;
    }

    if (!invoiceNumber.trim()) {
      setError("Invoice number is not ready yet. Wait a moment and try again.");
      return null;
    }

    setError(null);
    return {
      invoiceNumber: invoiceNumber.trim(),
      date,
      customer: {
        name: customerName.trim(),
        address: customerAddress.trim(),
        city: customerCity.trim(),
        zipCode: customerZip.trim(),
      },
      lineItems: items,
      discount: discountNum,
      bank: {
        accountHolder: bank.accountHolder.trim(),
        accountType: bank.accountType.trim(),
        accountNumber: bank.accountNumber.trim(),
        ifsc: bank.ifsc.trim(),
        branch: bank.branch.trim(),
      },
    };
  }

  async function handleGenerate() {
    const payload = buildPayload();
    if (!payload) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/bill/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          ...(loadedInvoiceId != null ? { invoiceId: loadedInvoiceId } : {}),
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "PDF generation failed");
      }

      const savedNumber = res.headers.get("X-Invoice-Number") ?? payload.invoiceNumber;
      const savedId = res.headers.get("X-Invoice-Id");
      if (savedId) setLoadedInvoiceId(parseInt(savedId, 10));
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bakers-perk-invoice-${savedNumber}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      await Promise.all([refreshHistory(), refreshNextNumber()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate PDF.");
    } finally {
      setLoading(false);
    }
  }

  function handleNewInvoice() {
    setDate(todayIso());
    setCustomerName("");
    setCustomerAddress("");
    setCustomerCity("");
    setCustomerZip("");
    setDiscount("0");
    setLineItems([{ ...EMPTY_LINE_ITEM }, { ...EMPTY_LINE_ITEM }]);
    setBank({ ...DEFAULT_BILL_BANK });
    setError(null);
    setLoadedInvoiceId(null);
    void refreshNextNumber();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-line bg-paper p-5 lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-[10px] uppercase tracking-[3px] text-accent">Invoice</div>
          <button
            type="button"
            onClick={handleNewInvoice}
            className="rounded-full border border-line px-4 py-1.5 text-[11px] uppercase tracking-[2px] text-ink transition-colors hover:border-accent"
          >
            New invoice
          </button>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field
            label="Invoice # (auto)"
            value={loadingNumber ? "…" : invoiceNumber}
            readOnly
          />
          <Field label="Date" value={date} onChange={setDate} type="date" />
        </div>
        <p className="mt-3 text-xs text-muted">
          Invoice numbers are assigned automatically and saved to history when you download a PDF.
        </p>
      </div>

      <div className="rounded-2xl border border-line bg-paper p-5 lg:p-6">
        <div className="text-[10px] uppercase tracking-[3px] text-accent">Customer</div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Name" value={customerName} onChange={setCustomerName} className="block sm:col-span-2" />
          <Field label="Address" value={customerAddress} onChange={setCustomerAddress} className="block sm:col-span-2" />
          <Field label="City" value={customerCity} onChange={setCustomerCity} />
          <Field label="Zip code" value={customerZip} onChange={setCustomerZip} />
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-paper p-5 lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-[10px] uppercase tracking-[3px] text-accent">Products (materials)</div>
          <button
            type="button"
            onClick={addLine}
            className="rounded-full border border-line px-4 py-1.5 text-[11px] uppercase tracking-[2px] text-ink transition-colors hover:border-accent"
          >
            + Add row
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {lineItems.map((row, i) => (
            <div key={i} className="grid gap-3 rounded-xl border border-line/70 bg-cream/50 p-3 sm:grid-cols-12">
              <div className="sm:col-span-4">
                <Field
                  label="Description"
                  value={row.description}
                  onChange={(v) => updateLine(i, { description: v })}
                  placeholder="Raspberry Truffle"
                />
              </div>
              <div className="sm:col-span-2">
                <Field
                  label="Quantity (kg)"
                  value={row.quantity}
                  onChange={(v) => updateLineWithCalc(i, { quantity: v })}
                  placeholder="9"
                />
              </div>
              <div className="sm:col-span-2">
                <Field
                  label="Rate per kg (₹)"
                  value={row.rate}
                  onChange={(v) => updateLineWithCalc(i, { rate: v })}
                  placeholder="1200"
                />
              </div>
              <div className="sm:col-span-2">
                <Field
                  label="Amount (₹)"
                  value={row.amount || ""}
                  onChange={(v) => updateLine(i, { amount: Number(v) || 0 })}
                  type="number"
                  placeholder="10800"
                />
              </div>
              <div className="flex items-end sm:col-span-2">
                <button
                  type="button"
                  onClick={() => removeLine(i)}
                  disabled={lineItems.length <= 1}
                  className="w-full rounded-full border border-accent/40 bg-accent/10 px-3 py-2.5 text-[11px] font-medium text-accent transition-colors hover:bg-accent hover:text-white disabled:opacity-40"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-3 text-xs text-muted">
          Amount auto-calculates from quantity × rate per kg. You can override it manually if needed.
        </p>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-4">
          <Field
            label="Discount (₹)"
            value={discount}
            onChange={setDiscount}
            type="number"
            className="w-full max-w-[160px]"
          />
          <div className="text-right text-sm">
            <div className="text-muted">Subtotal: {billRs(subtotal)}</div>
            <div className="mt-1 font-serif text-xl font-semibold text-ink">Total: {billRs(total)}</div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-paper p-5 lg:p-6">
        <div className="text-[10px] uppercase tracking-[3px] text-accent">Account details</div>
        <p className="mt-2 text-sm text-muted">Printed on the bill for bank transfer.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field
            label="Account holder"
            value={bank.accountHolder}
            onChange={(v) => setBank((b) => ({ ...b, accountHolder: v }))}
          />
          <Field
            label="Account type"
            value={bank.accountType}
            onChange={(v) => setBank((b) => ({ ...b, accountType: v }))}
          />
          <Field
            label="Account number"
            value={bank.accountNumber}
            onChange={(v) => setBank((b) => ({ ...b, accountNumber: v }))}
          />
          <Field label="IFSC" value={bank.ifsc} onChange={(v) => setBank((b) => ({ ...b, ifsc: v }))} />
          <Field
            label="Branch"
            value={bank.branch}
            onChange={(v) => setBank((b) => ({ ...b, branch: v }))}
            className="block sm:col-span-2"
          />
        </div>
      </div>

      {error ? <p className="text-sm text-accent">{error}</p> : null}

      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading || loadingNumber}
        className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-on-ink transition-transform hover:scale-[1.01] disabled:opacity-60"
      >
        <svg
          aria-hidden
          className="h-4 w-4"
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
        {loading ? "Generating PDF…" : "Download bill PDF"}
      </button>

      <InvoiceHistory
        invoices={history}
        loading={historyLoading}
        onLoad={handleLoadFromHistory}
        onDownload={handleDownloadFromHistory}
        onRefresh={refreshHistory}
      />
    </div>
  );
}
