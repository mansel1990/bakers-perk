const REEL_URL = "https://www.instagram.com/reel/CSH6DFuBjgY/";

export default function AboutVideo() {
  return (
    <div className="mx-auto max-w-sm">
      <div className="overflow-hidden rounded-2xl border border-line bg-ink-2">
        <iframe
          src={`${REEL_URL}embed/`}
          className="min-h-[680px] w-full border-0"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          loading="lazy"
          title="Baker's Perk on Instagram"
        />
      </div>
      <a
        href={REEL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 block text-center text-[11px] uppercase tracking-[2px] text-accent"
      >
        Watch on Instagram ↗
      </a>
    </div>
  );
}
