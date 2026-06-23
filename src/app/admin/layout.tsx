import type { Metadata } from "next";
import { SHARE_IMAGE, SITE_URL } from "@/lib/share-metadata";

export const metadata: Metadata = {
  title: "Admin — Baker's Perk",
  description: "Baker's Perk admin backoffice.",
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    siteName: "Baker's Perk",
    title: "Admin — Baker's Perk",
    description: "Baker's Perk admin backoffice.",
    url: `${SITE_URL}/admin`,
    images: [SHARE_IMAGE],
  },
  twitter: {
    card: "summary",
    title: "Admin — Baker's Perk",
    description: "Baker's Perk admin backoffice.",
    images: [SHARE_IMAGE.url],
  },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
