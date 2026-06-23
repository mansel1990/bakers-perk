import "server-only";
import { renderToBuffer } from "@react-pdf/renderer";
import { getBrandLogoDataUri } from "@/lib/brand.server";
import { getAddons, getMenuByCategory, getSettings } from "@/lib/data";
import { MenuPdfDocument } from "./document";
import { getPdfWatermarks } from "./watermarks";

export async function generateMenuPdf(): Promise<Buffer> {
  const [settings, menu, addons, watermarks, logo] = await Promise.all([
    getSettings(),
    getMenuByCategory(),
    getAddons(),
    getPdfWatermarks(),
    Promise.resolve(getBrandLogoDataUri()),
  ]);

  const buffer = await renderToBuffer(
    <MenuPdfDocument settings={settings} menu={menu} addons={addons} watermarks={watermarks} logo={logo} />
  );

  return Buffer.from(buffer);
}
