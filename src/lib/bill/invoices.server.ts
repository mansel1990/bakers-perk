import "server-only";

import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { invoices, settings } from "@/db/schema";
import type { BillBankDetails, BillCustomer, BillLineItem, BillPayload } from "@/lib/bill/types";
import { billSubtotal, billTotal } from "@/lib/bill/types";

export type InvoiceSummary = {
  id: number;
  invoiceNumber: string;
  date: string;
  customerName: string;
  totalInr: number;
  createdAt: string;
};

const INVOICE_SEED_KEY = "invoice_number_seed";
const MIN_INVOICE_NUMBER = 10000;
const MAX_INVOICE_NUMBER = 99999;

function randomFiveDigitNumber(): number {
  return (
    Math.floor(Math.random() * (MAX_INVOICE_NUMBER - MIN_INVOICE_NUMBER + 1)) + MIN_INVOICE_NUMBER
  );
}

/** First invoice number — random 5 digits, persisted so the preview stays stable. */
async function getOrCreateInvoiceSeed(): Promise<number> {
  const rows = await db
    .select({ value: settings.value })
    .from(settings)
    .where(eq(settings.key, INVOICE_SEED_KEY))
    .limit(1);

  const existing = rows[0]?.value;
  if (existing) {
    const n = parseInt(existing, 10);
    if (Number.isFinite(n) && n >= MIN_INVOICE_NUMBER && n <= MAX_INVOICE_NUMBER) return n;
  }

  const seed = randomFiveDigitNumber();
  await db
    .insert(settings)
    .values({ key: INVOICE_SEED_KEY, value: String(seed) })
    .onConflictDoUpdate({ target: settings.key, set: { value: String(seed) } });

  return seed;
}

function maxNumericInvoiceNumber(rows: { invoiceNumber: string }[]): number {
  return rows.reduce((max, row) => {
    const n = parseInt(row.invoiceNumber, 10);
    return Number.isFinite(n) && n > max ? n : max;
  }, 0);
}

/** Preview the next sequential invoice number (not reserved until saved). */
export async function peekNextInvoiceNumber(): Promise<string> {
  const rows = await db.select({ invoiceNumber: invoices.invoiceNumber }).from(invoices);
  const max = maxNumericInvoiceNumber(rows);

  if (max >= MIN_INVOICE_NUMBER) {
    return String(max + 1);
  }

  const seed = await getOrCreateInvoiceSeed();
  return String(seed);
}

function billToRecord(bill: BillPayload, adminId?: number) {
  const subtotal = billSubtotal(bill.lineItems);
  const total = billTotal(bill.lineItems, bill.discount);

  return {
    invoiceNumber: bill.invoiceNumber,
    invoiceDate: bill.date || new Date().toISOString().slice(0, 10),
    customer: bill.customer,
    lineItems: bill.lineItems,
    discountInr: bill.discount,
    bank: bill.bank,
    subtotalInr: subtotal,
    totalInr: total,
    adminId: adminId ?? null,
  };
}

/** Persist a generated invoice. Pass invoiceId to update a row loaded from history. */
export async function saveInvoice(
  bill: BillPayload,
  adminId?: number,
  opts?: { invoiceId?: number }
): Promise<{ id: number; invoiceNumber: string }> {
  let payload = { ...bill };

  if (opts?.invoiceId) {
    const existing = await db
      .select({ id: invoices.id })
      .from(invoices)
      .where(eq(invoices.id, opts.invoiceId))
      .limit(1);

    if (!existing[0]) {
      throw new Error("Invoice not found.");
    }

    await db
      .update(invoices)
      .set(billToRecord(payload, adminId))
      .where(eq(invoices.id, opts.invoiceId));

    return { id: opts.invoiceId, invoiceNumber: payload.invoiceNumber };
  }

  if (!payload.invoiceNumber) {
    payload.invoiceNumber = await peekNextInvoiceNumber();
  }

  for (let attempt = 0; attempt < 5; attempt++) {
    const taken = await db
      .select({ id: invoices.id })
      .from(invoices)
      .where(eq(invoices.invoiceNumber, payload.invoiceNumber))
      .limit(1);

    if (taken.length > 0) {
      payload.invoiceNumber = await peekNextInvoiceNumber();
      continue;
    }

    const [row] = await db
      .insert(invoices)
      .values(billToRecord(payload, adminId))
      .returning({ id: invoices.id, invoiceNumber: invoices.invoiceNumber });

    return { id: row.id, invoiceNumber: row.invoiceNumber };
  }

  throw new Error("Could not allocate a unique invoice number.");
}

export async function listInvoiceHistory(limit = 50): Promise<InvoiceSummary[]> {
  const rows = await db
    .select()
    .from(invoices)
    .orderBy(desc(invoices.createdAt))
    .limit(limit);

  return rows.map((row) => {
    const customer = row.customer as BillCustomer;
    return {
      id: row.id,
      invoiceNumber: row.invoiceNumber,
      date: row.invoiceDate,
      customerName: customer.name || "—",
      totalInr: row.totalInr,
      createdAt: row.createdAt.toISOString(),
    };
  });
}

export async function getInvoicePayload(id: number): Promise<BillPayload | null> {
  const rows = await db.select().from(invoices).where(eq(invoices.id, id)).limit(1);
  const row = rows[0];
  if (!row) return null;

  return {
    invoiceNumber: row.invoiceNumber,
    date: row.invoiceDate,
    customer: row.customer as BillCustomer,
    lineItems: row.lineItems as BillLineItem[],
    discount: row.discountInr,
    bank: row.bank as BillBankDetails,
  };
}
