import "server-only";
import fs from "node:fs";
import path from "node:path";
import { BRAND } from "./brand";

function resolveLogoPath(): string {
  const candidates = [
    path.join(process.cwd(), BRAND.logoFile),
    path.join(process.cwd(), BRAND.logoPublicFile),
  ];
  for (const abs of candidates) {
    if (fs.existsSync(abs)) return abs;
  }
  throw new Error(
    `Brand logo not found. Expected at ${BRAND.logoFile} or ${BRAND.logoPublicFile}.`
  );
}

function mimeFromBuffer(buf: Buffer): "image/jpeg" | "image/png" {
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
  throw new Error("Brand logo must be a JPEG or PNG file.");
}

/** Base64 data URI for @react-pdf and other server-side embeds. */
export function getBrandLogoDataUri(): string {
  const abs = resolveLogoPath();
  const buf = fs.readFileSync(abs);
  const mime = mimeFromBuffer(buf);
  return `data:${mime};base64,${buf.toString("base64")}`;
}

/** Absolute path — react-pdf also accepts local file paths in Node. */
export function getBrandLogoPath(): string {
  return resolveLogoPath();
}
