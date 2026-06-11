import type { Metadata } from "next";
import { SITE, waLink } from "@/lib/site";

export const metadata: Metadata = { title: "Contact — Baker's Perk" };

export default function ContactPage() {
  return (
    <div className="px-5 py-12 lg:px-10 lg:py-16">
      <div className="text-[10px] uppercase tracking-[3px] text-accent">Say hello</div>
      <h1 className="mt-2 font-serif text-4xl font-semibold lg:text-5xl">Contact</h1>
      <div className="mt-6 max-w-md text-sm leading-relaxed text-muted">
        {SITE.address}
        <br />
        {SITE.hours}
        <br />
        {SITE.deliveryNote}
      </div>
      <a
        href={waLink("Hi Baker's Perk!")}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-block rounded-full bg-ink px-6 py-3 text-sm font-medium text-on-ink"
      >
        Chat on WhatsApp ↗
      </a>
      <p className="mt-8 text-xs text-muted">
        Contact form + embedded map land in the next build phase.
      </p>
    </div>
  );
}
