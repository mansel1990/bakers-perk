import { auth } from "@/auth";
import { getInvoicePayload } from "@/lib/bill/invoices.server";

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
    return Response.json({ bill, id });
  } catch (err) {
    console.error("[admin/bill/[id]]", err);
    return new Response("Failed to load invoice.", { status: 500 });
  }
}
