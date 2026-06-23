import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AboutVideo from "@/components/AboutVideo";
import { getSettings } from "@/lib/data";
import { waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our story — Baker's Perk",
  description:
    "Meet Chef Alex — from Taj and ITC Hotels to a home bakery in Pudupet. Six years, 6,000+ customers, and 8,000+ cakes baked with care in Chennai.",
};
export const revalidate = 60;

const STATS = [
  { value: "2020", label: "Started with one oven" },
  { value: "6,000+", label: "Happy customers" },
  { value: "8,000+", label: "Cakes & bakes made" },
];

const VALUES = [
  {
    title: "Quality",
    body: "Hotel-trained standards — fresh ingredients, careful technique, no shortcuts.",
  },
  {
    title: "Consistency",
    body: "The cake you loved last time is the cake you'll get again. Every order, every time.",
  },
  {
    title: "Trust",
    body: "Six years of birthdays, weddings, and everyday celebrations — built one customer at a time.",
  },
];

export default async function OurStoryPage() {
  const settings = await getSettings();

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[52svh] overflow-hidden bg-ink-2 lg:h-[68svh]">
        <Image
          src="/about/chef-spread.png"
          alt="Chef Alex with a spread of cakes, cupcakes and bakes"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 70vw"
          className="object-cover object-[center_30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-ink/10" />
        <div className="absolute bottom-6 left-5 right-5 lg:bottom-10 lg:left-10 [text-shadow:0_1px_18px_rgba(20,28,22,0.45)]">
          <div className="text-[10px] uppercase tracking-[3px] text-accent">Meet the baker</div>
          <h1 className="mt-2 font-serif text-4xl font-semibold leading-[1.05] text-cream lg:text-[52px]">
            Our <em className="font-normal text-accent">story</em>
          </h1>
        </div>
      </section>

      {/* Intro + pull quote */}
      <section className="px-5 py-12 lg:px-10 lg:py-16">
        <p className="max-w-xl font-serif text-xl font-semibold leading-snug lg:text-2xl">
          &ldquo;From hotel kitchens to a home oven in Pudupet — still baking every cake like it&apos;s
          for family.&rdquo;
        </p>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted lg:text-[15px]">
          Chef Alex began his culinary career with training and experience at leading hospitality
          brands, including Taj Hotels and ITC Hotels, followed by roles across renowned restaurant
          chains in Chennai and professional training in Bengaluru.
        </p>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted lg:text-[15px]">
          In 2020, driven by a passion for baking and entrepreneurship, he started a small
          home-based bakery with a single oven. What began as a modest venture has grown steadily
          over the past six years, serving more than 6,000 customers and producing over 8,000 cakes
          and baked creations.
        </p>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted lg:text-[15px]">
          Today, the business continues to thrive, built on quality, consistency, and customer
          trust.
        </p>

        <div className="mt-10 max-w-2xl">
          <div className="text-[10px] uppercase tracking-[3px] text-muted">Behind the bake</div>
          <div className="mt-3">
            <AboutVideo />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-line bg-paper px-5 py-10 lg:px-10 lg:py-12">
        <div className="grid gap-6 sm:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.label} className="text-center sm:text-left">
              <div className="font-serif text-3xl font-semibold text-accent lg:text-4xl">{s.value}</div>
              <div className="mt-1 text-sm text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Second photo + event work */}
      <section className="px-5 py-12 lg:px-10 lg:py-16">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <figure className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink-2">
            <Image
              src="/about/chef-event.png"
              alt="Chef Alex at a themed dessert table with custom cakes and treats"
              fill
              sizes="(max-width: 1024px) 100vw, 35vw"
              className="object-cover"
            />
          </figure>
          <div>
            <div className="text-[10px] uppercase tracking-[3px] text-muted">Beyond the counter</div>
            <h2 className="mt-2 font-serif text-2xl font-semibold lg:text-3xl">
              Custom spreads for every <em className="font-normal text-accent">occasion</em>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted lg:text-[15px]">
              From intimate birthday tables to large celebration spreads — themed desserts, cake
              pops, cupcakes, and showpiece cakes designed and built to your brief.
            </p>
            <Link
              href="/custom-cakes"
              className="mt-5 inline-block text-[11px] uppercase tracking-[2px] text-accent"
            >
              See custom cakes →
            </Link>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-ink px-5 py-12 lg:px-10 lg:py-16">
        <div className="text-[10px] uppercase tracking-[3px] text-accent">What we stand for</div>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-2xl border border-dark-line p-5">
              <div className="font-serif text-lg font-semibold text-on-ink">{v.title}</div>
              <p className="mt-2 text-sm leading-relaxed text-dark-muted">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-12 lg:px-10 lg:py-16">
        <div className="rounded-2xl border border-line bg-paper p-6 text-center lg:p-10">
          <h2 className="font-serif text-2xl font-semibold lg:text-3xl">
            Ready to order?
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            Browse the menu or message us on WhatsApp — we reply fastest there.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={waLink("Hi Baker's Perk!", settings.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-wa px-8 py-3.5 text-sm font-medium text-white transition-transform hover:scale-[1.01] sm:w-auto"
            >
              Order on WhatsApp ↗
            </a>
            <Link
              href="/menu"
              className="inline-flex w-full items-center justify-center rounded-full border border-line px-8 py-3.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent sm:w-auto"
            >
              Browse menu
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
