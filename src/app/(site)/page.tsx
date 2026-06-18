import SearchIndex from "@/components/SearchIndex";
import DreamPrompt from "@/components/DreamPrompt";
import HeroSlider from "@/components/HeroSlider";
import { getFeaturedMenu, getFullMenu, getHeroPhotos, getSettings } from "@/lib/data";

export const revalidate = 60;

export default async function Home() {
  const [heroPhotos, featured, all, settings] = await Promise.all([
    getHeroPhotos(),
    getFeaturedMenu(),
    getFullMenu(),
    getSettings(),
  ]);

  return (
    <>
      {/* Hero — crossfading slider of the most striking cakes */}
      <section className="relative h-[58svh] overflow-hidden bg-ink-2 lg:h-[84svh]">
        <HeroSlider photos={heroPhotos} />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-ink/10" />
        <div className="absolute bottom-6 left-5 right-5 lg:bottom-9 lg:left-10 [text-shadow:0_1px_18px_rgba(20,28,22,0.45)]">
          <div className="text-[10px] uppercase tracking-[3px] text-accent">
            The 2026 collection
          </div>
          <h1 className="mt-2 font-serif text-4xl font-semibold leading-[1.05] text-cream lg:text-[56px]">
            Cakes worth
            <br />
            <em className="font-normal text-accent">slowing down</em> for.
          </h1>
        </div>
      </section>

      <SearchIndex featured={featured} all={all} />

      {/* Custom cakes band */}
      <section className="bg-ink px-5 py-12 lg:px-10 lg:py-16">
        <h2 className="font-serif text-3xl font-semibold leading-tight text-on-ink lg:text-4xl">
          Describe it. <em className="font-normal text-accent">We&apos;ll bake it.</em>
        </h2>
        <p className="mb-6 mt-2 text-[13px] text-dark-muted">
          Photo cakes · fondant · toy toppers — we need just 2 days notice.
        </p>
        <DreamPrompt whatsapp={settings.whatsapp} />
      </section>
    </>
  );
}
