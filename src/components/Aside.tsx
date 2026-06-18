"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { waLink } from "@/lib/site";
import type { SiteSettings } from "@/lib/data";

const NAV = [
  { n: "01", label: "Menu", href: "/menu" },
  { n: "02", label: "Custom cakes", href: "/custom-cakes" },
  { n: "03", label: "Gallery", href: "/gallery" },
  { n: "04", label: "Contact", href: "/contact" },
];

function Logo({ name, className = "" }: { name: string; className?: string }) {
  return (
    <Link href="/" className={`font-serif font-semibold text-on-ink ${className}`}>
      {name}
      <span className="text-accent">.</span>
    </Link>
  );
}

export default function Aside({ settings }: { settings: SiteSettings }) {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  return (
    <>
      {/* Desktop pinned panel — 30% */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-[30vw] flex-col bg-panel p-9 lg:flex">
        <div>
          <Logo name={settings.name} className="text-[21px]" />
          <div className="mt-1.5 text-[9px] uppercase tracking-[3px] text-panel-muted">
            {settings.byline} — Chennai
          </div>
        </div>
        <nav className="my-auto">
          {NAV.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`block py-2.5 text-xs uppercase tracking-[2px] transition-all hover:pl-2.5 hover:text-on-ink ${
                path.startsWith(l.href) ? "text-on-ink" : "text-panel-muted"
              }`}
            >
              <span className="mr-3 text-[10px] text-accent">{l.n}</span>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="text-[11px] leading-relaxed text-panel-muted">
          <div className="mb-3 font-serif text-[12.5px] italic text-on-ink/90">{settings.tagline}</div>
          Pudupet, Chennai 600002
          <br />
          {settings.hours}
          <br />
          {settings.deliveryNote}
          <br />
          <a
            href={waLink("Hi Baker's Perk!", settings.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-panel-line px-5 py-2.5 text-[10px] font-medium uppercase tracking-[2.5px] text-on-ink transition-colors hover:bg-on-ink hover:text-ink"
          >
            Order on WhatsApp ↗
          </a>
        </div>
      </aside>

      {/* Mobile sticky header */}
      <div className="sticky top-0 z-40 flex items-center justify-between bg-ink px-4 py-3 lg:hidden">
        <Logo name={settings.name} className="text-[17px]" />
        <button
          onClick={() => setOpen(true)}
          className="rounded-full border border-dark-line px-3.5 py-2 text-[11px] tracking-[2px] text-on-ink"
        >
          MENU ☰
        </button>
      </div>

      {/* Mobile full-screen overlay */}
      <div
        className={`fixed inset-0 z-50 flex flex-col bg-ink p-5 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex items-center justify-between">
          <Logo name={settings.name} className="text-[17px]" />
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="h-10 w-10 rounded-full border border-dark-line text-on-ink"
          >
            ✕
          </button>
        </div>
        <nav className="my-auto">
          {NAV.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 font-serif text-[34px] font-semibold text-on-ink"
            >
              <span className="mr-3.5 font-sans text-[13px] text-accent">{l.n}</span>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="text-[11px] leading-loose text-dark-muted">
          <span className="font-serif italic text-accent">{settings.tagline}</span>
          <br />
          Pudupet, Chennai · {settings.hours} · @bakers_perk
        </div>
      </div>
    </>
  );
}
