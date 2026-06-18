"use client";

import { useState } from "react";
import { waLink } from "@/lib/site";
import { trackEvent } from "@/lib/ga";
import { submitContactMessage } from "@/lib/contact";

export default function ContactForm({ whatsapp }: { whatsapp?: string }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const send = () => {
    const intro = name.trim() ? `Hi Baker's Perk! This is ${name.trim()}.` : "Hi Baker's Perk!";
    const body = message.trim() ? ` ${message.trim()}` : "";
    trackEvent("contact_submit", { source: "contact_form" });
    // Persist for the admin inbox (best-effort), then hand off to WhatsApp.
    void submitContactMessage({ name, message });
    window.open(waLink(`${intro}${body}`, whatsapp), "_blank");
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        send();
      }}
      className="rounded-2xl border border-line bg-paper p-5 lg:p-6"
    >
      <div className="text-[10px] uppercase tracking-[3px] text-accent">Send a message</div>
      <label className="mt-4 block">
        <span className="text-xs text-muted">Your name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Priya"
          className="mt-1.5 w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
        />
      </label>
      <label className="mt-4 block">
        <span className="text-xs text-muted">What can we bake for you?</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="A 1 kg red velvet for Saturday pickup…"
          className="mt-1.5 w-full resize-none rounded-xl border border-line bg-cream px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
        />
      </label>
      <button
        type="submit"
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-wa py-3.5 text-sm font-medium text-white transition-transform hover:scale-[1.01]"
      >
        Continue on WhatsApp ↗
      </button>
      <p className="mt-3 text-center text-[11px] text-muted">
        Opens WhatsApp with your message ready to send — no app data stored.
      </p>
    </form>
  );
}
