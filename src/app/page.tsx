import SearchIndex from "@/components/SearchIndex";
import DreamPrompt from "@/components/DreamPrompt";

export default function Home() {
  return (
    <>
      {/* Hero — drop hero.jpg into /public/images to replace the placeholder */}
      <section className="relative h-[58svh] overflow-hidden lg:h-[84svh]">
        <div
          className="absolute inset-0 bg-ink-2 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(/images/hero.jpg), radial-gradient(circle at 60% 35%, #6e3b2a, #1a0d08 75%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
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

      <SearchIndex />

      {/* Custom cakes band */}
      <section className="bg-ink px-5 py-12 lg:px-10 lg:py-16">
        <h2 className="font-serif text-3xl font-semibold leading-tight text-on-ink lg:text-4xl">
          Describe it. <em className="font-normal text-accent">We&apos;ll bake it.</em>
        </h2>
        <p className="mb-6 mt-2 text-[13px] text-dark-muted">
          Photo cakes · fondant · toy toppers — we need just 2 days notice.
        </p>
        <DreamPrompt />
      </section>
    </>
  );
}
