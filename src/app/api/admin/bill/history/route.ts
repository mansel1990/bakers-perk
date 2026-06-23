import { auth } from "@/auth";
import { listInvoiceHistory } from "@/lib/bill/invoices.server";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const invoices = await listInvoiceHistory();
    return Response.json({ invoices });
  } catch (err) {
    console.error("[admin/bill/history]", err);
    return new Response("Failed to load invoice history.", { status: 500 });
  }
}
