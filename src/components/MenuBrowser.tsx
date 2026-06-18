"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { MenuGroup, MenuItemView } from "@/lib/data";
import MenuPrice from "@/components/MenuPrice";

function PriceRow({ m }: { m: MenuItemView }) {
  return (
    <div
      id={m.slug}
      className="flex scroll-mt-[120px] items-center justify-between gap-4 border-b border-line py-4 last:border-0"
    >
      <span className="min-w-0">
        <span className="font-serif text-lg font-semibold lg:text-xl">{m.name}</span>
        {m.isEggless && (
          <span className="ml-2.5 rounded-full border border-line px-2 py-0.5 text-[9px] uppercase tracking-[1.5px] text-muted">
            Eggless
          </span>
        )}
      </span>
      <div className="flex-none text-right">
        <MenuPrice pricing={m.pricing} />
      </div>
    </div>
  );
}

export default function MenuBrowser({ menu }: { menu: MenuGroup[] }) {
  const [egglessOnly, setEgglessOnly] = useState(false);

  const groups = useMemo(() => {
    return menu
      .map((g) => ({
        ...g,
        items: egglessOnly ? g.items.filter((m) => m.isEggless) : g.items,
      }))
      .filter((g) => g.items.length > 0);
  }, [egglessOnly, menu]);

  return (
    <>
      {/* Sticky jump-nav + eggless toggle */}
      <div className="sticky top-[52px] z-30 -mx-5 border-b border-line bg-cream/95 px-5 py-3 backdrop-blur lg:top-0 lg:-mx-10 lg:px-10">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {groups.map((g) => (
            <a
              key={g.category.id}
              href={`#${g.category.id}`}
              className="flex-none rounded-full border border-line px-3.5 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
            >
              {g.category.name}
            </a>
          ))}
          <button
            onClick={() => setEgglessOnly((v) => !v)}
            aria-pressed={egglessOnly}
            className={`ml-auto flex-none rounded-full px-3.5 py-1.5 text-xs transition-colors ${
              egglessOnly
                ? "bg-accent text-ink"
                : "border border-line text-muted hover:border-accent hover:text-accent"
            }`}
          >
            Eggless only
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-12">
        {groups.map((g) => (
          <section key={g.category.id} id={g.category.id} className="scroll-mt-[120px]">
            {/* Category banner — photo if available, else typographic gradient */}
            <div className="relative overflow-hidden rounded-2xl">
              {g.category.image ? (
                <Image
                  src={g.category.image}
                  alt={g.category.name}
                  width={1200}
                  height={400}
                  className="h-36 w-full object-cover lg:h-44"
                />
              ) : (
                <div
                  className="h-28 w-full lg:h-32"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 78% 28%, var(--panel), var(--ink) 78%)",
                  }}
                />
              )}
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/85 via-ink/35 to-transparent p-5">
                <h2 className="font-serif text-2xl font-semibold text-on-ink lg:text-3xl">
                  {g.category.name}
                </h2>
                <p className="mt-1 max-w-md text-xs text-dark-muted lg:text-[13px]">
                  {g.category.blurb}
                </p>
              </div>
            </div>

            <div className="mt-3">
              {g.items.map((m) => (
                <PriceRow key={m.slug} m={m} />
              ))}
            </div>
          </section>
        ))}

        {groups.length === 0 && (
          <p className="py-10 text-sm text-muted">No eggless bakes flagged yet — clear the filter to see the full menu.</p>
        )}
      </div>
    </>
  );
}
