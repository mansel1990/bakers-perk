import { auth } from "@/auth";
import { getInvoicePayload } from "@/lib/bill/invoices.server";
import { generateBillPdf } from "@/lib/bill-pdf/generate";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id: idParam } = await context.params;
  const id = parseInt(idParam, 10);
  if (!Number.isFinite(id)) {
    return new Response("Invalid invoice id.", { status: 400 });
  }

  try {
    const bill = await getInvoicePayload(id);
    if (!bill) {
      return new Response("Invoice not found.", { status: 404 });
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
    console.error("[admin/bill/[id]/pdf]", err);
    return new Response("Failed to generate bill PDF.", { status: 500 });
  }
}
