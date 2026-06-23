"use client";

import { useRef, useState } from "react";

export default function AboutVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    const el = videoRef.current;
    if (!el) return;
    void el.play();
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-ink-2">
      <video
        ref={videoRef}
        className="aspect-video w-full object-cover"
        controls={playing}
        playsInline
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      >
        <source src="/about/about-us-vid.mp4" type="video/mp4" />
      </video>

      {!playing && (
        <button
          type="button"
          onClick={play}
          aria-label="Play behind the bake video"
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink/25 transition-colors hover:bg-ink/35"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cream/95 text-ink shadow-lg">
            <svg aria-hidden className="ml-1 h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="rounded-full bg-ink/70 px-4 py-1.5 text-[11px] uppercase tracking-[2px] text-cream">
            Watch video
          </span>
        </button>
      )}
    </div>
  );
}
