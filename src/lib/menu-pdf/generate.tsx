import "server-only";
import { renderToBuffer } from "@react-pdf/renderer";
import { getAddons, getMenuByCategory, getSettings } from "@/lib/data";
import { MenuPdfDocument } from "./document";

export async function generateMenuPdf(): Promise<Buffer> {
  const [settings, menu, addons] = await Promise.all([
    getSettings(),
    getMenuByCategory(),
    getAddons(),
  ]);

  const buffer = await renderToBuffer(
    <MenuPdfDocument settings={settings} menu={menu} addons={addons} />
  );

  return Buffer.from(buffer);
}
