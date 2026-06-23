import { auth } from "@/auth";
import { saveInvoice } from "@/lib/bill/invoices.server";
import { parseBillPayload } from "@/lib/bill/parse-payload";
import { generateBillPdf } from "@/lib/bill-pdf/generate";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = parseBillPayload(body);
    if (!parsed) {
      return new Response("Invalid bill data. Add at least one line item with a description and amount.", {
        status: 400,
      });
    }

    const adminId = session.user.id ? parseInt(String(session.user.id), 10) : undefined;
    const saved = await saveInvoice(parsed.bill, Number.isFinite(adminId) ? adminId : undefined, {
      invoiceId: parsed.invoiceId,
    });
    const payload = { ...parsed.bill, invoiceNumber: saved.invoiceNumber };

    const pdf = await generateBillPdf(payload);
    const safeNum = saved.invoiceNumber.replace(/[^\w-]+/g, "-");
    const filename = `bakers-perk-invoice-${safeNum}.pdf`;

    return new Response(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
        "X-Invoice-Id": String(saved.id),
        "X-Invoice-Number": saved.invoiceNumber,
      },
    });
  } catch (err) {
    console.error("[admin/bill/pdf]", err);
    return new Response("Failed to generate bill PDF.", { status: 500 });
  }
}
