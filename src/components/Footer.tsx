import Link from "next/link";
import { SITE, waLink } from "@/lib/site";

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-dark-line bg-ink px-5 pb-24 pt-12 lg:px-10 lg:pb-8">
      <div className="grid gap-7 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="font-serif text-2xl font-semibold text-on-ink">
            {SITE.name}
            <span className="text-accent">.</span>
          </div>
          <div className="mt-2.5 font-serif text-[13px] italic text-accent">{SITE.tagline}</div>
          <div className="mt-4 flex gap-2.5">
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-dark-line text-on-ink transition-transform hover:-translate-y-0.5"
            >
              IG
            </a>
            <a
              href={waLink("Hi Baker's Perk!")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-dark-line text-on-ink transition-transform hover:-translate-y-0.5"
            >
              WA
            </a>
          </div>
        </div>
        <div>
          <div className="mb-3 text-[10px] uppercase tracking-[3px] text-on-ink">Explore</div>
          {[
            ["Menu", "/menu"],
            ["Custom cakes", "/custom-cakes"],
            ["Gallery", "/gallery"],
            ["Contact", "/contact"],
          ].map(([label, href]) => (
            <Link key={href} href={href} className="block py-1 text-[13px] text-dark-muted hover:text-on-ink">
              {label}
            </Link>
          ))}
        </div>
        <div className="text-[13px] leading-relaxed text-dark-muted">
          <div className="mb-3 text-[10px] uppercase tracking-[3px] text-on-ink">Visit us</div>
          {SITE.address}
          <br />
          {SITE.hours}
          <br />
          {SITE.deliveryNote}
        </div>
      </div>
      <div className="mt-8 flex flex-wrap justify-between gap-2 border-t border-dark-line pt-4 text-[10px] uppercase tracking-[2px] text-dark-muted">
        <span>© 2026 {SITE.name} {SITE.byline}</span>
        <span>Made fresh in Chennai</span>
      </div>
    </footer>
  );
}
