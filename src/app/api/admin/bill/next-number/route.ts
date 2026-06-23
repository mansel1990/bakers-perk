import { auth } from "@/auth";
import { peekNextInvoiceNumber } from "@/lib/bill/invoices.server";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const invoiceNumber = await peekNextInvoiceNumber();
    return Response.json({ invoiceNumber });
  } catch (err) {
    console.error("[admin/bill/next-number]", err);
    return new Response("Failed to fetch next invoice number.", { status: 500 });
  }
}
