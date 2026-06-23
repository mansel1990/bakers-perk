import "server-only";
import fs from "node:fs";
import { isAllowedBlobUrl } from "@/lib/blob-url";

function mimeFromBuffer(buf: Buffer): string {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    buf.length >= 8 &&
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47
  ) {
    return "image/png";
  }
  return "image/jpeg";
}

export function readLocalImageAsDataUri(absPath: string): string | null {
  if (!fs.existsSync(absPath)) return null;
  const buf = fs.readFileSync(absPath);
  return `data:${mimeFromBuffer(buf)};base64,${buf.toString("base64")}`;
}

export async function fetchImageAsDataUri(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": "BakersPerk/1.0 (menu PDF; +https://bakersperk.com)" },
  });
  if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get("content-type")?.split(";")[0]?.trim();
  const mime = contentType?.startsWith("image/") ? contentType : mimeFromBuffer(buf);
  return `data:${mime};base64,${buf.toString("base64")}`;
}

/** Embed remote menu images as data URIs for @react-pdf (avoids runtime fetches). */
export async function blobUrlAsDataUri(url: string | null | undefined): Promise<string | null> {
  if (!url) return null;
  if (url.startsWith("data:")) return url;
  if (!isAllowedBlobUrl(url)) return null;
  return fetchImageAsDataUri(url);
}
