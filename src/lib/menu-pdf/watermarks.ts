import "server-only";
import fs from "node:fs";
import path from "node:path";

const ASSETS_DIR = path.join(process.cwd(), "scripts", "assets", "pdf");

/** Pexels — free to use. Cached locally after first fetch. */
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

function toDataUri(filePath: string): string {
  const buf = fs.readFileSync(filePath);
  return `data:image/jpeg;base64,${buf.toString("base64")}`;
}

async function downloadIfMissing(file: string, url: string, force = false) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
  const dest = path.join(ASSETS_DIR, file);
  if (force && fs.existsSync(dest)) fs.unlinkSync(dest);
  if (fs.existsSync(dest)) return;

  const res = await fetch(url, {
    headers: { "User-Agent": "BakersPerk/1.0 (menu PDF; +https://bakersperk.com)" },
  });
  if (!res.ok) throw new Error(`Failed to download PDF watermark ${file}: ${res.status}`);
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
}

/** Ensures local watermark assets exist. */
export async function getPdfWatermarks(): Promise<PdfWatermarkSet> {
  const refresh = process.env.PDF_REFRESH_WATERMARKS === "1";
  await Promise.all(WATERMARK_SOURCES.map((s) => downloadIfMissing(s.file, s.url, refresh)));
  const uris = WATERMARK_SOURCES.map((s) => toDataUri(path.join(ASSETS_DIR, s.file)));
  return {
    accents: uris,
    pageFill: uris[0],
    cupcakeBanner: uris[1],
  };
}
