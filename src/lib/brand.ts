/**
 * Canonical brand assets — import paths from here across site, admin, and PDF.
 *
 * - `logo` — public URL (served from /public/brand/)
 * - `logoFile` — repo path for server-side reads (PDF); lives in src/assets so
 *   it is always deployed even when public/ is empty on Vercel.
 */
export const BRAND = {
  /** Public URL for next/image, img, etc. */
  logo: "/brand/logo.jpg",
  /** Repo path for server-side reads (PDF). */
  logoFile: "src/assets/brand/logo.jpg",
  logoPublicFile: "public/brand/logo.jpg",
} as const;
