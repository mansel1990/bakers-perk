"use client";

import { useState } from "react";
import Link from "next/link";
import { FEATURED_MENU, FULL_MENU } from "@/data/menu";

export default function SearchIndex() {
  const [q, setQ] = useState("");
  const v = q.trim().toLowerCase();
  const pool = v ? FULL_MENU : FEATURED_MENU;
  const hits = pool.filter(
    (m) => !v || `${m.name} ${m.category} ${m.tags}`.toLowerCase().includes(v)
  );

  return (
    <>
      <div className="px-5 pt-8 lg:px-10" id="search">
        <div className="flex items-center gap-3 rounded-full border border-line bg-paper py-1.5 pl-5 pr-2 transition-colors focus-within:border-accent">
          <span className="text-accent">⌕</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Know your cake? Find it — 'red velvet', 'cheesecake', 'eggless'…"
            className="w-full bg-transparent py-2.5 text-[15px] outline-none placeholder:text-muted"
          />
        </div>
        <div className="mt-2.5 pl-5 text-[11px] text-muted">
          Popular:{" "}
          {["truffle", "red velvet", "cheesecake", "jars"].map((t, i) => (
            <button key={t} onClick={() => setQ(t)} className="cursor-pointer font-medium text-accent">
              {i > 0 && <span className="text-muted"> · </span>}
              {t}
            </button>
          ))}
        </div>
      </div>

      <section className="px-5 pb-14 pt-7 lg:px-10">
        <div className="mb-5 text-[10px] uppercase tracking-[3px] text-muted">Index — the bakes</div>
        {hits.map((m, i) => (
          <Link
            key={m.slug}
            href={`/menu#${m.slug}`}
            className="group flex items-center gap-4 border-b border-line py-4 transition-all lg:hover:pl-3"
          >
            <span className="hidden w-6 text-[11px] text-accent lg:block">
              {String(i + 1).padStart(2, "0")}
            </span>
            {m.image && (
              <span
                className="block h-12 w-[60px] flex-none rounded-[10px] bg-ink-2 bg-cover bg-center lg:hidden"
                style={{ backgroundImage: `url(${m.image})` }}
              />
            )}
            <span className="min-w-0">
              <span className="font-serif text-lg font-semibold group-hover:italic lg:text-[26px]">
                {m.name}
              </span>
              <span className="mt-0.5 block text-[10px] uppercase tracking-[2px] text-muted">
                {m.category}
              </span>
            </span>
            <span className="ml-auto flex-none text-right text-[11px] text-muted lg:text-xs">
              {m.price}
            </span>
            <span className="hidden text-accent opacity-0 transition-all group-hover:opacity-100 lg:block">
              →
            </span>
          </Link>
        ))}
        {hits.length === 0 && (
          <div className="py-8 text-sm text-muted">
            No match — but if you can imagine it, we can bake it.{" "}
            <Link href="/custom-cakes" className="font-medium text-accent">
              Describe your custom cake →
            </Link>
          </div>
        )}
        <Link
          href="/menu"
          className="mt-6 inline-block text-[11px] uppercase tracking-[2px] text-accent"
        >
          View the full menu →
        </Link>
      </section>
    </>
  );
}
