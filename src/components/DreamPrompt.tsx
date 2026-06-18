"use client";

import { useState } from "react";
import { waLink } from "@/lib/site";
import { trackEvent } from "@/lib/ga";

export default function DreamPrompt({ whatsapp }: { whatsapp?: string }) {
  const [text, setText] = useState("");
  const send = () => {
    trackEvent("custom_cake_enquiry", { source: "dream_prompt" });
    window.open(
      waLink(`Hi Baker's Perk! I'd love a custom cake: ${text || "a custom cake"}`, whatsapp),
      "_blank"
    );
  };

  return (
    <div className="flex max-w-xl items-center gap-3 rounded-2xl border border-dark-line bg-ink-2 py-2 pl-5 pr-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
        placeholder="A 2-tier chocolate cake with a cricket theme…"
        className="w-full bg-transparent text-sm text-on-ink outline-none placeholder:text-dark-muted"
      />
      <button
        onClick={send}
        aria-label="Send enquiry"
        className="h-11 w-11 flex-none rounded-xl bg-accent text-xl text-ink transition-transform hover:scale-105"
      >
        →
      </button>
    </div>
  );
}
