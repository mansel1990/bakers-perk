"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/ga";
import { submitContactMessage } from "@/lib/contact";

function phoneDigits(phone: string) {
  return phone.replace(/\D/g, "");
}

export default function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [formError, setFormError] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const send = async () => {
    const trimmedPhone = phone.trim();
    if (phoneDigits(trimmedPhone).length < 10) {
      setPhoneError("Please enter a valid 10-digit phone number.");
      return;
    }
    setPhoneError("");
    setFormError("");
    setSending(true);

    trackEvent("contact_submit", { source: "contact_form" });
    const result = await submitContactMessage({ name, phone: trimmedPhone, message, company });

    setSending(false);
    if (!result.ok) {
      if ("error" in result && result.error === "invalid_phone") {
        setPhoneError("Please enter a valid 10-digit phone number.");
      } else if ("error" in result && result.error === "rate_limit") {
        setFormError("Too many messages from this number. Please try again in an hour or message us on WhatsApp.");
      }
      return;
    }

    setSent(true);
    setName("");
    setPhone("");
    setMessage("");
  };

  if (sent) {
    return (
      <div className="rounded-2xl border border-line bg-paper p-5 lg:p-6">
        <div className="text-[10px] uppercase tracking-[3px] text-accent">Message sent</div>
        <p className="mt-4 font-serif text-2xl font-semibold">Thanks — we&apos;ll be in touch soon.</p>
        <p className="mt-2 text-sm text-muted">
          Your message is in our inbox. For a faster reply, you can also message us on WhatsApp using
          the button on the left.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-5 text-sm font-medium text-accent underline-offset-2 hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void send();
      }}
      className="relative rounded-2xl border border-line bg-paper p-5 lg:p-6"
    >
      <input
        type="text"
        name="company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="pointer-events-none absolute h-0 w-0 opacity-0"
      />
      <div className="text-[10px] uppercase tracking-[3px] text-accent">Send a message</div>
      <label className="mt-4 block">
        <span className="text-xs text-muted">Your name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Priya"
          required
          className="mt-1.5 w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
        />
      </label>
      <label className="mt-4 block">
        <span className="text-xs text-muted">
          Phone number <span className="text-accent">*</span>
        </span>
        <input
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            if (phoneError) setPhoneError("");
          }}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="e.g. 9876543210"
          required
          className="mt-1.5 w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
        />
        {phoneError ? <p className="mt-1.5 text-xs text-accent">{phoneError}</p> : null}
      </label>
      <label className="mt-4 block">
        <span className="text-xs text-muted">What can we bake for you?</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="A 1 kg red velvet for Saturday pickup…"
          required
          className="mt-1.5 w-full resize-none rounded-xl border border-line bg-cream px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
        />
      </label>
      {formError ? <p className="mt-3 text-xs text-accent">{formError}</p> : null}
      <button
        type="submit"
        disabled={sending}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-sm font-medium text-on-ink transition-transform hover:scale-[1.01] disabled:opacity-60"
      >
        {sending ? "Sending…" : "Send message"}
      </button>
      <p className="mt-3 text-center text-[11px] text-muted">
        Goes straight to our team — we&apos;ll reply using your phone number.
      </p>
    </form>
  );
}
