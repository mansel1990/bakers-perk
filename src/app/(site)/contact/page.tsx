import type { Metadata } from "next";
import { waLink } from "@/lib/site";
import { getSettings } from "@/lib/data";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = { title: "Contact — Baker's Perk" };
export const revalidate = 60;

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-line py-3.5 last:border-0">
      <span className="text-[10px] uppercase tracking-[2.5px] text-muted">{label}</span>
      <span className="text-sm leading-relaxed">{children}</span>
    </div>
  );
}

export default async function ContactPage() {
  const SITE = await getSettings();
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(SITE.address)}&output=embed`;
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(SITE.address)}`;

  return (
    <div className="px-5 py-12 lg:px-10 lg:py-16">
      <div className="text-[10px] uppercase tracking-[3px] text-accent">Say hello</div>
      <h1 className="mt-2 font-serif text-4xl font-semibold lg:text-5xl">Contact</h1>
      <p className="mt-3 max-w-md text-sm text-muted">
        Order, ask about a custom cake, or just say hi — we reply fastest on WhatsApp.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:gap-8">
        {/* Left — details + quick actions */}
        <div>
          <div className="rounded-2xl border border-line bg-paper p-5 lg:p-6">
            <Row label="Visit">
              {SITE.address}
              <br />
              <a
                href={directionsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent"
              >
                Get directions ↗
              </a>
            </Row>
            <Row label="Hours">{SITE.hours}</Row>
            <Row label="Delivery">{SITE.deliveryNote}</Row>
            <Row label="WhatsApp & Phone">
              <a href={`tel:+${SITE.whatsapp}`} className="font-medium text-accent">
                +{SITE.whatsapp.replace(/^(\d{2})(\d{5})(\d{5})$/, "$1 $2 $3")}
              </a>
            </Row>
            <Row label="Instagram">
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent"
              >
                @bakers_perk ↗
              </a>
            </Row>
            <Row label="Email">
              <a href={`mailto:${SITE.email}`} className="font-medium text-accent">
                {SITE.email}
              </a>
            </Row>
          </div>

          <a
            href={waLink("Hi Baker's Perk!", SITE.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 rounded-full bg-wa py-3.5 text-sm font-medium text-white transition-transform hover:scale-[1.01]"
          >
            Chat on WhatsApp ↗
          </a>
        </div>

        {/* Right — map + form */}
        <div className="flex flex-col gap-6">
          <div className="overflow-hidden rounded-2xl border border-line bg-ink-2">
            <iframe
              src={mapSrc}
              title="Baker's Perk location map"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-56 w-full lg:h-64"
            />
          </div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
