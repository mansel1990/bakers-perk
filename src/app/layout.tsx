import type { Metadata, Viewport } from "next";
import { Fraunces, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Analytics from "@/components/Analytics";
import RegisterSW from "@/components/RegisterSW";
import { SHARE_IMAGE, SITE_URL } from "@/lib/share-metadata";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Baker's Perk — Handcrafted cakes in Chennai",
    template: "%s · Baker's Perk",
  },
  description:
    "Handcrafted cakes, cheesecakes and bakes by Chef Alex. Made to order, delivered anywhere in Chennai. Order on WhatsApp.",
  applicationName: "Baker's Perk",
  appleWebApp: { capable: true, title: "Baker's Perk", statusBarStyle: "default" },
  keywords: [
    "Baker's Perk",
    "cakes Chennai",
    "custom cakes Chennai",
    "eggless cakes",
    "photo cakes",
    "birthday cakes Chennai",
  ],
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    siteName: "Baker's Perk",
    title: "Baker's Perk — Handcrafted cakes in Chennai",
    description:
      "Handcrafted cakes, cheesecakes and bakes by Chef Alex. Made to order, delivered anywhere in Chennai.",
    url: SITE_URL,
    locale: "en_IN",
    images: [SHARE_IMAGE],
  },
  twitter: {
    card: "summary",
    title: "Baker's Perk — Handcrafted cakes in Chennai",
    description: "Handcrafted cakes, cheesecakes and bakes by Chef Alex, made to order in Chennai.",
    images: [SHARE_IMAGE.url],
  },
};

export const viewport: Viewport = {
  themeColor: "#2c4032",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${fraunces.variable} ${grotesk.variable} antialiased`}>
        {children}
        <Analytics />
        <RegisterSW />
      </body>
    </html>
  );
}
