/**
 * Vercel Blob helpers for Baker's Perk.
 *
 * Blob is a flat store, but path prefixes act as folders. Everything this
 * project writes lives under a single `bakers-perk/` root, split into clear
 * sub-folders so the store stays tidy and easy to audit:
 *
 *   bakers-perk/
 *     menu/      — menu item photos
 *     gallery/   — custom-cake gallery photos
 *     hero/      — home hero images
 *     misc/      — anything else (logos, og images, etc.)
 *
 * Use `blobPath(folder, filename)` to build a key, never hardcode paths.
 */
import { put, del, type PutCommandOptions } from "@vercel/blob";

export const BLOB_ROOT = "bakers-perk";

export type BlobFolder = "menu" | "gallery" | "hero" | "misc";

/** Build a namespaced, slug-safe blob key, e.g. "bakers-perk/menu/black-forest.jpg". */
export function blobPath(folder: BlobFolder, filename: string): string {
  const clean = filename
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${BLOB_ROOT}/${folder}/${clean}`;
}

/**
 * Upload a file/blob to a project folder. `addRandomSuffix` defaults to true so
 * re-uploads never clobber an existing image (admin uploads); pass false for the
 * one-time seed where deterministic paths are preferred.
 */
export async function uploadToBlob(
  folder: BlobFolder,
  filename: string,
  data: Parameters<typeof put>[1],
  options: Partial<PutCommandOptions> = {}
) {
  return put(blobPath(folder, filename), data, {
    access: "public",
    addRandomSuffix: true,
    ...options,
  });
}

/** Delete a blob by its full URL (used by the admin gallery/menu managers). */
export async function deleteBlob(url: string) {
  return del(url);
}
