import type { Metadata } from "next";

export const SITE_URL = "https://bakersperk.com";

/** Square brand mark — same as the browser tab icon. Used for link previews. */
export const SHARE_IMAGE = {
  url: "/icon-512.png",
  width: 512,
  height: 512,
  alt: "Baker's Perk",
} as const;

/** Open Graph + Twitter tags so shared links show the tab icon. */
export const sharePreview: Pick<Metadata, "openGraph" | "twitter"> = {
  openGraph: {
    images: [SHARE_IMAGE],
  },
  twitter: {
    card: "summary",
    images: [SHARE_IMAGE.url],
  },
};
