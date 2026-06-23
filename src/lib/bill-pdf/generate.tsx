import "server-only";

import { renderToBuffer } from "@react-pdf/renderer";
import { getBrandLogoDataUri } from "@/lib/brand.server";
import type { BillPayload } from "@/lib/bill/types";
import { getSettings } from "@/lib/data";
import { getPdfWatermarks } from "@/lib/menu-pdf/watermarks";
import { BillPdfDocument } from "./document";

export async function generateBillPdf(bill: BillPayload): Promise<Buffer> {
  const [settings, logo, watermarks] = await Promise.all([
    getSettings(),
    Promise.resolve(getBrandLogoDataUri()),
    getPdfWatermarks(),
  ]);

  const buffer = await renderToBuffer(
    <BillPdfDocument settings={settings} bill={bill} logo={logo} watermarks={watermarks} />
  );

  return Buffer.from(buffer);
}
