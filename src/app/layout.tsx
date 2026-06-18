import type { Metadata, Viewport } from "next";
import { Fraunces, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Analytics from "@/components/Analytics";
import RegisterSW from "@/components/RegisterSW";

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
  metadataBase: new URL("https://bakersperk.com"),
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
  openGraph: {
    type: "website",
    siteName: "Baker's Perk",
    title: "Baker's Perk — Handcrafted cakes in Chennai",
    description:
      "Handcrafted cakes, cheesecakes and bakes by Chef Alex. Made to order, delivered anywhere in Chennai.",
    url: "https://bakersperk.com",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Baker's Perk — Handcrafted cakes in Chennai",
    description: "Handcrafted cakes, cheesecakes and bakes by Chef Alex, made to order in Chennai.",
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
