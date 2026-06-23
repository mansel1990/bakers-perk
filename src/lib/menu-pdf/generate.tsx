import "server-only";
import { renderToBuffer } from "@react-pdf/renderer";
import { getBrandLogoDataUri } from "@/lib/brand.server";
import type { MenuGroup } from "@/lib/data";
import { getAddons, getMenuByCategory, getSettings } from "@/lib/data";
import { MenuPdfDocument } from "./document";
import { blobUrlAsDataUri } from "./images";
import { getPdfWatermarks } from "./watermarks";

async function embedCategoryImages(menu: MenuGroup[]): Promise<MenuGroup[]> {
  return Promise.all(
    menu.map(async (group) => {
      if (group.category.id === "cupcakes" || !group.category.image) return group;
      const image = await blobUrlAsDataUri(group.category.image);
      return { ...group, category: { ...group.category, image } };
    })
  );
}

export async function generateMenuPdf(): Promise<Buffer> {
  const [settings, rawMenu, addons, watermarks, logo] = await Promise.all([
    getSettings(),
    getMenuByCategory(),
    getAddons(),
    getPdfWatermarks(),
    Promise.resolve(getBrandLogoDataUri()),
  ]);
  const menu = await embedCategoryImages(rawMenu);

  const buffer = await renderToBuffer(
    <MenuPdfDocument settings={settings} menu={menu} addons={addons} watermarks={watermarks} logo={logo} />
  );

  return Buffer.from(buffer);
}
