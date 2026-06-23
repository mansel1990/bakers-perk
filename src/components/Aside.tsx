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
  { n: "04", label: "Our story", href: "/our-story" },
  { n: "05", label: "Contact", href: "/contact" },
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
            className="mt-4 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-wa px-5 py-3 text-[11px] font-semibold uppercase tracking-[2px] text-white shadow-[0_8px_22px_rgba(0,0,0,0.22)] ring-1 ring-white/20 transition-transform hover:scale-[1.02] hover:bg-[#20bd5a]"
          >
            <svg aria-hidden className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
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
