import { auth } from "@/auth";
import type { BillPayload } from "@/lib/bill/types";
import { generateBillPdf } from "@/lib/bill-pdf/generate";

function parseBillPayload(body: unknown): BillPayload | null {
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
      if (!description || !Number.isFinite(amount)) return null;
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
  if (!invoiceNumber) return null;

  return {
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
  };
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();
    const bill = parseBillPayload(body);
    if (!bill) {
      return new Response("Invalid bill data. Add at least one line item and an invoice number.", {
        status: 400,
      });
    }

    const pdf = await generateBillPdf(bill);
    const safeNum = bill.invoiceNumber.replace(/[^\w-]+/g, "-");
    const filename = `bakers-perk-invoice-${safeNum}.pdf`;

    return new Response(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[admin/bill/pdf]", err);
    return new Response("Failed to generate bill PDF.", { status: 500 });
  }
}
