import type { Metadata } from "next";
import { Fraunces, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Aside from "@/components/Aside";
import Footer from "@/components/Footer";
import { SITE, waLink } from "@/lib/site";

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
  title: "Baker's Perk — Handcrafted cakes in Chennai",
  description:
    "Handcrafted cakes, cheesecakes and bakes by Chef Alex. Made to order, delivered anywhere in Chennai. Order on WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${grotesk.variable} antialiased`}>
        <Aside />
        <main className="lg:ml-[30vw]">
          {children}
          <Footer />
        </main>
        <a
          href={waLink("Hi Baker's Perk!")}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-3.5 left-3.5 right-3.5 z-50 flex items-center justify-center gap-2 rounded-full bg-wa py-4 text-sm font-medium text-white shadow-xl lg:hidden"
        >
          Order on WhatsApp
        </a>
      </body>
    </html>
  );
}
