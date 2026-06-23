"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: "▦" },
  { label: "Menu & pricing", href: "/admin/menu", icon: "✦" },
  { label: "Gallery", href: "/admin/gallery", icon: "❑" },
  { label: "Messages", href: "/admin/messages", icon: "✉" },
  { label: "Bill generator", href: "/admin/bills", icon: "🧾" },
  { label: "Settings", href: "/admin/settings", icon: "⚙" },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const path = usePathname();
  const isActive = (href: string) => (href === "/admin" ? path === "/admin" : path.startsWith(href));

  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          onClick={onNavigate}
          className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-colors ${
            isActive(l.href)
              ? "bg-on-ink/15 text-on-ink"
              : "text-panel-muted hover:bg-on-ink/10 hover:text-on-ink"
          }`}
        >
          <span className="text-accent">{l.icon}</span>
          {l.label}
        </Link>
      ))}
    </nav>
  );
}

function SidebarInner({ userName, onNavigate }: { userName: string; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <Link href="/admin" onClick={onNavigate} className="font-serif text-xl font-semibold text-on-ink">
        Baker&apos;s Perk<span className="text-accent">.</span>
      </Link>
      <div className="mt-1 text-[9px] uppercase tracking-[3px] text-panel-muted">Backoffice</div>

      <div className="mt-8 flex-1">
        <NavLinks onNavigate={onNavigate} />
      </div>

      <div className="border-t border-panel-line pt-4 text-[11px] text-panel-muted">
        Signed in as <span className="text-on-ink">{userName}</span>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="mt-2 w-full rounded-full border border-panel-line px-4 py-2 text-[10px] font-medium uppercase tracking-[2px] text-on-ink transition-colors hover:bg-on-ink hover:text-ink"
        >
          Sign out
        </button>
        <Link href="/" className="mt-2 block text-center text-[10px] uppercase tracking-[2px] hover:text-on-ink">
          View site ↗
        </Link>
      </div>
    </div>
  );
}

export default function AdminShell({
  userName,
  children,
}: {
  userName: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-svh bg-cream">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col bg-panel p-6 lg:flex">
        <SidebarInner userName={userName} />
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-panel px-4 py-3 lg:hidden">
        <Link href="/admin" className="font-serif text-lg font-semibold text-on-ink">
          Baker&apos;s Perk<span className="text-accent">.</span>
        </Link>
        <button
          onClick={() => setOpen(true)}
          className="rounded-full border border-panel-line px-3.5 py-2 text-[11px] tracking-[2px] text-on-ink"
        >
          MENU ☰
        </button>
      </header>

      {/* Mobile slide-over */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <div
          className={`absolute inset-0 bg-ink/50 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />
        <div
          className={`absolute inset-y-0 left-0 w-72 max-w-[82vw] bg-panel p-6 transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="absolute right-4 top-4 h-9 w-9 rounded-full border border-panel-line text-on-ink"
          >
            ✕
          </button>
          <SidebarInner userName={userName} onNavigate={() => setOpen(false)} />
        </div>
      </div>

      {/* Content */}
      <div className="lg:ml-64">
        <div className="mx-auto max-w-5xl px-4 py-6 lg:px-8 lg:py-10">{children}</div>
      </div>
    </div>
  );
}
