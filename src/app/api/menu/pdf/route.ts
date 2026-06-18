import { generateMenuPdf } from "@/lib/menu-pdf/generate";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const pdf = await generateMenuPdf();
    const filename = "bakers-perk-menu.pdf";

    return new Response(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[menu/pdf]", err);
    return new Response("Failed to generate menu PDF.", { status: 500 });
  }
}
