import type { Metadata } from "next";
import MenuBrowser from "@/components/MenuBrowser";
import { getMenuByCategory } from "@/lib/data";

export const metadata: Metadata = { title: "Menu — Baker's Perk" };
export const revalidate = 60;

export default async function MenuPage() {
  const menu = await getMenuByCategory();

  return (
    <div className="px-5 py-12 lg:px-10 lg:py-16">
      <div className="text-[10px] uppercase tracking-[3px] text-accent">The full collection</div>
      <h1 className="mt-2 font-serif text-4xl font-semibold lg:text-5xl">Menu</h1>
      <p className="mt-3 max-w-md text-sm text-muted">
        Our 2026 rate card. Cakes come in ½ kg and 1 kg — tap a category to jump, or filter for
        eggless. Want something bespoke?{" "}
        <a href="/custom-cakes" className="font-medium text-accent">
          Design a custom cake →
        </a>
      </p>

      <MenuBrowser menu={menu} />
    </div>
  );
}
