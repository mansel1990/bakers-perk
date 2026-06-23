const BLOB_HOST = "public.blob.vercel-storage.com";

/** True for HTTPS Vercel Blob public URLs used by this app. */
export function isAllowedBlobUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      (parsed.hostname === BLOB_HOST || parsed.hostname.endsWith(`.${BLOB_HOST}`))
    );
  } catch {
    return false;
  }
}

export function assertAllowedBlobUrl(url: string): string {
  if (!isAllowedBlobUrl(url)) {
    throw new Error("Image URL must be a Vercel Blob HTTPS URL.");
  }
  return url;
}

export function allowedBlobUrlOrNull(url: string | null | undefined): string | null {
  if (!url) return null;
  return isAllowedBlobUrl(url) ? url : null;
}
