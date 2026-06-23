import type { BillPayload } from "./types";

export type ParsedBillRequest = { bill: BillPayload; invoiceId?: number };

export function parseBillPayload(body: unknown): ParsedBillRequest | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;

  const customer = b.customer as Record<string, unknown> | undefined;
  const bank = b.bank as Record<string, unknown> | undefined;
  const lineItems = b.lineItems;

  if (!customer || !bank || !Array.isArray(lineItems)) return null;

  const items = lineItems
    .map((row) => {
      if (!row || typeof row !== "object") return null;
      const r = row as Record<string, unknown>;
      const description = String(r.description ?? "").trim();
      const amount = Number(r.amount);
      if (!description || !Number.isFinite(amount) || amount <= 0) return null;
      return {
        description,
        quantity: String(r.quantity ?? "").trim(),
        rate: String(r.rate ?? "").trim(),
        amount,
      };
    })
    .filter(Boolean) as BillPayload["lineItems"];

  if (items.length === 0) return null;

  const invoiceNumber = String(b.invoiceNumber ?? "").trim();
  const rawInvoiceId = b.invoiceId;
  const invoiceId =
    rawInvoiceId != null ? parseInt(String(rawInvoiceId), 10) : Number.NaN;

  return {
    bill: {
      invoiceNumber,
      date: String(b.date ?? "").trim(),
      customer: {
        name: String(customer.name ?? "").trim(),
        address: String(customer.address ?? "").trim(),
        city: String(customer.city ?? "").trim(),
        zipCode: String(customer.zipCode ?? "").trim(),
      },
      lineItems: items,
      discount: Math.max(0, Number(b.discount) || 0),
      bank: {
        accountHolder: String(bank.accountHolder ?? "").trim(),
        accountType: String(bank.accountType ?? "").trim(),
        accountNumber: String(bank.accountNumber ?? "").trim(),
        ifsc: String(bank.ifsc ?? "").trim(),
        branch: String(bank.branch ?? "").trim(),
      },
    },
    invoiceId: Number.isFinite(invoiceId) ? invoiceId : undefined,
  };
}
