import type { Metadata } from "next";
import DreamPrompt from "@/components/DreamPrompt";

export const metadata: Metadata = { title: "Custom cakes — Baker's Perk" };

export default function CustomCakesPage() {
  return (
    <div className="bg-ink px-5 py-12 lg:min-h-[70vh] lg:px-10 lg:py-20">
      <div className="text-[10px] uppercase tracking-[3px] text-accent">Made for you</div>
      <h1 className="mt-2 font-serif text-4xl font-semibold text-on-ink lg:text-5xl">
        Describe it. <em className="font-normal text-accent">We&apos;ll bake it.</em>
      </h1>
      <p className="mb-8 mt-3 max-w-md text-sm text-dark-muted">
        Photo cakes +₹300 · fondant cakes +₹400 · fondant toys +₹200. We need just 2 days notice —
        your idea lands straight in our WhatsApp.
      </p>
      <DreamPrompt />
    </div>
  );
}
