"use client";

import { useMemo, useState } from "react";
import { DEFAULT_BILL_BANK, EMPTY_LINE_ITEM } from "@/lib/bill/defaults";
import { billRs } from "@/lib/bill/format";
import type { BillLineItem, BillPayload } from "@/lib/bill/types";
import { billSubtotal, billTotal } from "@/lib/bill/types";

const INPUT =
  "mt-1.5 w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent";

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
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={className ?? "block"}>
      <span className="text-xs text-muted">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={INPUT}
      />
    </label>
  );
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
  const [error, setError] = useState<string | null>(null);

  const discountNum = Math.max(0, Number(discount) || 0);
  const subtotal = useMemo(() => billSubtotal(lineItems), [lineItems]);
  const total = useMemo(() => billTotal(lineItems, discountNum), [lineItems, discountNum]);

  function updateLine(index: number, patch: Partial<BillLineItem>) {
    setLineItems((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function addLine() {
    setLineItems((rows) => [...rows, { ...EMPTY_LINE_ITEM }]);
  }

  function removeLine(index: number) {
    setLineItems((rows) => (rows.length <= 1 ? rows : rows.filter((_, i) => i !== index)));
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

    const num = invoiceNumber.trim();
    if (!num) {
      setError("Invoice number is required.");
      return null;
    }
    if (items.length === 0) {
      setError("Add at least one line item with a description and amount.");
      return null;
    }

    setError(null);
    return {
      invoiceNumber: num,
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
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "PDF generation failed");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bakers-perk-invoice-${payload.invoiceNumber}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate PDF.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-line bg-paper p-5 lg:p-6">
        <div className="text-[10px] uppercase tracking-[3px] text-accent">Invoice</div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Invoice #" value={invoiceNumber} onChange={setInvoiceNumber} placeholder="2556" />
          <Field label="Date" value={date} onChange={setDate} type="date" />
        </div>
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
                  label="Quantity"
                  value={row.quantity}
                  onChange={(v) => updateLine(i, { quantity: v })}
                  placeholder="9 Kg"
                />
              </div>
              <div className="sm:col-span-2">
                <Field
                  label="Rate"
                  value={row.rate}
                  onChange={(v) => updateLine(i, { rate: v })}
                  placeholder="1200 or 25/Unit"
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
                  className="w-full rounded-full border border-line px-3 py-2.5 text-[11px] text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

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
        <p className="mt-2 text-sm text-muted">Printed on the bill for bank transfer. Defaults match your sample invoice.</p>
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
        disabled={loading}
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
    </div>
  );
}
