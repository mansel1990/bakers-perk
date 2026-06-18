import Aside from "@/components/Aside";
import Footer from "@/components/Footer";
import { waLink } from "@/lib/site";
import { getSettings } from "@/lib/data";

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSettings();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: settings.name,
    description: settings.tagline,
    url: "https://bakersperk.com",
    telephone: `+${settings.whatsapp}`,
    email: settings.email,
    image: "https://bakersperk.com/opengraph-image",
    priceRange: "₹₹",
    servesCuisine: "Cakes & Bakes",
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: "Chennai",
      addressRegion: "Tamil Nadu",
      addressCountry: "IN",
    },
    sameAs: [settings.instagram].filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Aside settings={settings} />
      <main className="lg:ml-[30vw]">
        {settings.bannerEnabled && settings.bannerText && (
          <div className="bg-accent px-5 py-2 text-center text-[13px] font-medium text-ink lg:px-10">
            {settings.bannerText}
          </div>
        )}
        {children}
        <Footer settings={settings} />
      </main>
      <a
        href={waLink("Hi Baker's Perk!", settings.whatsapp)}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-3.5 left-3.5 right-3.5 z-50 flex items-center justify-center gap-2 rounded-full bg-wa py-4 text-sm font-medium text-white shadow-xl lg:hidden"
      >
        Order on WhatsApp
      </a>
    </>
  );
}
