"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

type HeroPhoto = { src: string; alt: string };

const INTERVAL = 5000;
const SWIPE_THRESHOLD = 48;

export default function HeroSlider({ photos }: { photos: HeroPhoto[] }) {
  const [active, setActive] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const restartTimer = useRef<() => void>(() => {});
  const pointerStart = useRef<{ x: number; y: number } | null>(null);

  const count = photos.length;

  const goTo = useCallback(
    (index: number) => setActive((index + count) % count),
    [count]
  );

  const manualGoTo = useCallback(
    (index: number) => {
      goTo(index);
      restartTimer.current();
    },
    [goTo]
  );

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || count < 2) return;

    const start = () => {
      timer.current = setInterval(() => setActive((i) => (i + 1) % count), INTERVAL);
    };
    const stop = () => {
      if (timer.current) clearInterval(timer.current);
      timer.current = null;
    };
    restartTimer.current = () => {
      stop();
      start();
    };

    const onVisibility = () => (document.hidden ? stop() : start());

    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [count]);

  const onPointerDown = (e: React.PointerEvent) => {
    pointerStart.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start) return;

    const deltaX = e.clientX - start.x;
    const deltaY = e.clientY - start.y;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) < Math.abs(deltaY)) return;

    manualGoTo(active + (deltaX < 0 ? 1 : -1));
  };

  const onPointerCancel = () => {
    pointerStart.current = null;
  };

  return (
    <div
      className="absolute inset-0 touch-pan-y"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onPointerLeave={onPointerCancel}
    >
      {photos.map((p, i) => (
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
            className="pointer-events-none object-cover"
            draggable={false}
          />
        </div>
      ))}

      {/* Dots */}
      <div className="absolute right-5 top-5 z-10 flex gap-1.5 lg:right-8 lg:top-8">
        {photos.map((p, i) => (
          <button
            key={p.src}
            onClick={() => manualGoTo(i)}
            aria-label={`Show cake ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === active ? "w-5 bg-cream" : "w-1.5 bg-cream/50 hover:bg-cream/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
