import "server-only";
import path from "node:path";
import { fetchImageAsDataUri, readLocalImageAsDataUri } from "./images";

const ASSETS_DIR = path.join(process.cwd(), "scripts", "assets", "pdf");

/** Pexels — free to use. Fetched in memory on serverless; local cache optional in dev. */
const WATERMARK_SOURCES = [
  {
    file: "watermark-chocolate-cake.jpg",
    url: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    file: "watermark-cupcakes.jpg",
    url: "https://images.pexels.com/photos/974229/pexels-photo-974229.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    file: "watermark-pastry.jpg",
    url: "https://images.pexels.com/photos/1073083/pexels-photo-1073083.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    file: "watermark-layer-cake.jpg",
    url: "https://images.pexels.com/photos/1721932/pexels-photo-1721932.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
] as const;

export type PdfWatermarkSet = {
  /** Corner / accent tiles */
  accents: string[];
  /** Full-page faint fill — baked into background, not a scrim overlay */
  pageFill: string;
  /** Guaranteed cupcake photo for menu + PDF category banner */
  cupcakeBanner: string;
};

async function resolveWatermark(file: string, url: string): Promise<string> {
  const local = readLocalImageAsDataUri(path.join(ASSETS_DIR, file));
  if (local) return local;
  return fetchImageAsDataUri(url);
}

/** Load watermark assets as data URIs (works on read-only serverless filesystems). */
export async function getPdfWatermarks(): Promise<PdfWatermarkSet> {
  const uris = await Promise.all(WATERMARK_SOURCES.map((s) => resolveWatermark(s.file, s.url)));
  return {
    accents: uris,
    pageFill: uris[0],
    cupcakeBanner: uris[1],
  };
}
