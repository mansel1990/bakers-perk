"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type HeroPhoto = { src: string; alt: string };

const INTERVAL = 6500;

export default function HeroSlider({ photos }: { photos: HeroPhoto[] }) {
  const HERO_PHOTOS = photos;
  const [active, setActive] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || HERO_PHOTOS.length < 2) return;

    const start = () => {
      timer.current = setInterval(
        () => setActive((i) => (i + 1) % HERO_PHOTOS.length),
        INTERVAL
      );
    };
    const stop = () => {
      if (timer.current) clearInterval(timer.current);
      timer.current = null;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <>
      {HERO_PHOTOS.map((p, i) => (
        <div
          key={p.src}
          className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={p.src}
            alt={p.alt}
            fill
            priority={i === 0}
            sizes="(max-width: 1024px) 100vw, 70vw"
            className="object-cover"
          />
        </div>
      ))}

      {/* Dots */}
      <div className="absolute right-5 top-5 z-10 flex gap-1.5 lg:right-8 lg:top-8">
        {HERO_PHOTOS.map((p, i) => (
          <button
            key={p.src}
            onClick={() => setActive(i)}
            aria-label={`Show cake ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === active ? "w-5 bg-cream" : "w-1.5 bg-cream/50 hover:bg-cream/80"
            }`}
          />
        ))}
      </div>
    </>
  );
}
