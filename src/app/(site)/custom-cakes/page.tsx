import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import DreamPrompt from "@/components/DreamPrompt";
import { getCustomShowcase, getAddons, getSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Custom cakes — Baker's Perk" };
export const revalidate = 60;

const STEPS = [
  { n: "01", title: "Describe it", body: "Tell us the theme, flavour, weight and date — a photo for reference helps." },
  { n: "02", title: "2 days notice", body: "We confirm the design and price on WhatsApp, then start baking." },
  { n: "03", title: "Pickup or delivery", body: "Collect from Pudupet or we deliver anywhere in Chennai." },
];

export default async function CustomCakesPage() {
  const [showcase, addons, settings] = await Promise.all([
    getCustomShowcase(4),
    getAddons(),
    getSettings(),
  ]);

  return (
    <div>
      {/* Hero — prompt stays above the fold */}
      <section className="bg-ink px-5 py-12 lg:px-10 lg:py-20">
        <div className="text-[10px] uppercase tracking-[3px] text-accent">Made for you</div>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-on-ink lg:text-5xl">
          Describe it. <em className="font-normal text-accent">We&apos;ll bake it.</em>
        </h1>
        <p className="mb-8 mt-3 max-w-md text-sm text-dark-muted">
          Any theme, flavour or shape — your idea lands straight in our WhatsApp.
        </p>
        <DreamPrompt whatsapp={settings.whatsapp} />

        <div className="mt-7 flex flex-wrap gap-2.5">
          {addons.map((a) => (
            <span
              key={a.label}
              className="rounded-full border border-dark-line px-4 py-2 text-xs text-on-ink"
            >
              {a.label} <span className="text-accent">{a.price}</span>
            </span>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-5 py-12 lg:px-10 lg:py-16">
        <div className="text-[10px] uppercase tracking-[3px] text-muted">How it works</div>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="rounded-2xl border border-line bg-paper p-5">
              <div className="font-serif text-2xl text-accent">{s.n}</div>
              <div className="mt-2 font-serif text-lg font-semibold">{s.title}</div>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Curated showcase by occasion */}
      <section className="px-5 pb-14 lg:px-10 lg:pb-20">
        <div className="text-[10px] uppercase tracking-[3px] text-muted">A few we&apos;ve made</div>
        <h2 className="mt-2 font-serif text-2xl font-semibold lg:text-3xl">
          Real custom cakes, by occasion
        </h2>

        {showcase.map((group) => (
          <div key={group.occasion} className="mt-8">
            <div className="mb-3 flex items-baseline justify-between">
              <h3 className="font-serif text-lg font-semibold lg:text-xl">{group.occasion}</h3>
              <Link href="/gallery" className="text-[11px] uppercase tracking-[2px] text-accent">
                More →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
              {group.photos.map((photo) => (
                <figure
                  key={photo.src}
                  className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink-2"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 220px"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent px-3 pb-3 pt-10">
                    <span className="font-serif text-xs font-semibold text-on-ink lg:text-sm">
                      {photo.caption}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        ))}

        <Link
          href="/gallery"
          className="mt-9 inline-block text-[11px] uppercase tracking-[2px] text-accent"
        >
          See the full gallery →
        </Link>
      </section>
    </div>
  );
}
