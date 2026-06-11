import type { Metadata } from "next";
import { FULL_MENU } from "@/data/menu";

export const metadata: Metadata = { title: "Menu — Baker's Perk" };

export default function MenuPage() {
  return (
    <div className="px-5 py-12 lg:px-10 lg:py-16">
      <div className="text-[10px] uppercase tracking-[3px] text-accent">The full collection</div>
      <h1 className="mt-2 font-serif text-4xl font-semibold lg:text-5xl">Menu</h1>
      <p className="mt-3 max-w-md text-sm text-muted">
        Full interactive menu — categories, weight variants, eggless filter and cart — lands in
        the next build phase. The bakes below are the current rate card.
      </p>
      <div className="mt-8">
        {FULL_MENU.map((m) => (
          <div key={m.slug} id={m.slug} className="flex items-baseline justify-between border-b border-line py-4">
            <span>
              <span className="font-serif text-xl font-semibold">{m.name}</span>
              <span className="ml-3 text-[10px] uppercase tracking-[2px] text-muted">{m.category}</span>
            </span>
            <span className="text-xs text-muted">{m.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
