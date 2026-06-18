/**
 * Server-side data layer. All public pages read content from the database
 * through these cached functions instead of the static files in src/data.
 *
 * IMPORTANT: server-only. Do not import from client components — pass the
 * returned plain objects down as props instead.
 */
import "server-only";
import { cache } from "react";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  categories,
  menuItems,
  itemVariants,
  itemAddons,
  galleryImages,
  settings as settingsTable,
} from "@/db/schema";
import { SITE } from "@/lib/site";

const INR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/* -------------------------------------------------------------------------- */
/* Settings                                                                    */
/* -------------------------------------------------------------------------- */

export type SiteSettings = {
  name: string;
  byline: string;
  tagline: string;
  whatsapp: string;
  instagram: string;
  email: string;
  address: string;
  hours: string;
  deliveryNote: string;
  minLeadDays: number;
  bannerText: string;
  bannerEnabled: boolean;
};

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const rows = await db.select().from(settingsTable);
  const kv = new Map(rows.map((r) => [r.key, r.value ?? ""]));
  const get = (k: string, fallback: string) => kv.get(k) ?? fallback;

  return {
    name: get("name", SITE.name),
    byline: get("byline", SITE.byline),
    tagline: get("tagline", SITE.tagline),
    whatsapp: get("whatsapp_number", SITE.whatsapp),
    instagram: get("instagram", SITE.instagram),
    email: get("contact_email", SITE.email),
    address: get("address", SITE.address),
    hours: get("hours", SITE.hours),
    deliveryNote: get("delivery_note", SITE.deliveryNote),
    minLeadDays: Number(get("min_lead_days", String(SITE.minLeadDays))) || SITE.minLeadDays,
    bannerText: get("banner_text", ""),
    bannerEnabled: get("banner_enabled", "false") === "true",
  };
});

/* -------------------------------------------------------------------------- */
/* Menu                                                                        */
/* -------------------------------------------------------------------------- */

export type PriceVariant = { label: string; priceInr: number };

export type MenuPricing =
  | { kind: "on-request" }
  | { kind: "single"; priceInr: number }
  | { kind: "variants"; variants: PriceVariant[] };

export type MenuItemView = {
  slug: string;
  name: string;
  category: string;
  /** Plain-text price for PDF export and search snippets */
  price: string;
  pricing: MenuPricing;
  image: string | null;
  isEggless: boolean;
  searchText: string;
};

export type CategoryView = {
  id: string; // slug — used as the anchor id on the menu page
  name: string;
  blurb: string;
  image: string | null;
};

export type MenuGroup = { category: CategoryView; items: MenuItemView[] };

function sortVariants(variants: { label: string; priceInr: number; sort: number }[]) {
  return [...variants].sort((a, b) => a.sort - b.sort);
}

function buildPricing(
  variants: { label: string; priceInr: number; sort: number }[],
  isPriceOnRequest: boolean
): MenuPricing {
  if (isPriceOnRequest || variants.length === 0) return { kind: "on-request" };
  const sorted = sortVariants(variants);
  if (sorted.length === 1 && sorted[0].label === "each") {
    return { kind: "single", priceInr: sorted[0].priceInr };
  }
  return {
    kind: "variants",
    variants: sorted.map((v) => ({ label: v.label, priceInr: v.priceInr })),
  };
}

function formatPrice(pricing: MenuPricing): string {
  if (pricing.kind === "on-request") return "Enquire for price";
  if (pricing.kind === "single") return INR(pricing.priceInr);
  return pricing.variants.map((v) => `${v.label} ${INR(v.priceInr)}`).join(" — ");
}

/** All visible categories with their visible items (sorted), shaped for the UI. */
export const getMenuByCategory = cache(async (): Promise<MenuGroup[]> => {
  const [cats, items, variants] = await Promise.all([
    db.select().from(categories).where(eq(categories.isVisible, true)).orderBy(asc(categories.sort)),
    db.select().from(menuItems).where(eq(menuItems.isVisible, true)).orderBy(asc(menuItems.sort)),
    db.select().from(itemVariants).orderBy(asc(itemVariants.sort)),
  ]);

  const variantsByItem = new Map<number, typeof variants>();
  for (const v of variants) {
    const list = variantsByItem.get(v.itemId) ?? [];
    list.push(v);
    variantsByItem.set(v.itemId, list);
  }

  return cats
    .map((c) => {
      const catItems = items
        .filter((i) => i.categoryId === c.id)
        .map((i): MenuItemView => {
          const vs = variantsByItem.get(i.id) ?? [];
          const pricing = buildPricing(vs, i.isPriceOnRequest);
          return {
            slug: i.slug,
            name: i.name,
            category: c.name,
            price: formatPrice(pricing),
            pricing,
            image: i.imageUrl,
            isEggless: i.isEggless,
            searchText: `${i.name} ${c.name} ${i.tags ?? ""} ${i.isEggless ? "eggless" : ""}`.toLowerCase(),
          };
        });
      return {
        category: { id: c.slug, name: c.name, blurb: c.blurb ?? "", image: c.imageUrl },
        items: catItems,
      };
    })
    .filter((g) => g.items.length > 0);
});

/** Flat list of all visible items (for the home search index). */
export const getFullMenu = cache(async (): Promise<MenuItemView[]> => {
  const groups = await getMenuByCategory();
  return groups.flatMap((g) => g.items);
});

/** Curated home highlights — falls back to the first N items if a slug is missing. */
const FEATURED_SLUGS = [
  "black-forest",
  "double-chocolate",
  "red-velvet",
  "golden-belgian-chocolate",
  "ferrero-rocher-treat",
  "swiss-blueberry",
  "new-york-baked-cheese-cake",
  "tiramisu-tub",
  "custard-doughnut",
  "lemon-tart",
];

export const getFeaturedMenu = cache(async (): Promise<MenuItemView[]> => {
  const all = await getFullMenu();
  const bySlug = new Map(all.map((m) => [m.slug, m]));
  const picked = FEATURED_SLUGS.map((s) => bySlug.get(s)).filter((m): m is MenuItemView => !!m);
  return picked.length ? picked : all.slice(0, 10);
});

export type AddonView = { label: string; price: string };

export const getAddons = cache(async (): Promise<AddonView[]> => {
  const rows = await db
    .select()
    .from(itemAddons)
    .where(eq(itemAddons.isActive, true))
    .orderBy(asc(itemAddons.sort));
  return rows.map((a) => ({ label: a.name, price: `+${INR(a.priceInr)}` }));
});

/* -------------------------------------------------------------------------- */
/* Gallery                                                                     */
/* -------------------------------------------------------------------------- */

export type GalleryView = { src: string; alt: string; caption: string; occasion: string | null };

export const getGallery = cache(async (): Promise<GalleryView[]> => {
  const rows = await db
    .select()
    .from(galleryImages)
    .where(eq(galleryImages.isVisible, true))
    .orderBy(asc(galleryImages.sort));
  return rows.map((g) => ({ src: g.blobUrl, alt: g.alt, caption: g.caption ?? "", occasion: g.occasion }));
});

export const getHeroPhotos = cache(async (): Promise<{ src: string; alt: string }[]> => {
  const rows = await db
    .select()
    .from(galleryImages)
    .where(eq(galleryImages.isHero, true))
    .orderBy(asc(galleryImages.sort));
  return rows.map((g) => ({ src: g.blobUrl, alt: g.alt }));
});

const OCCASION_ORDER = ["Weddings", "Birthdays & Themed", "Anniversary", "Character & Novelty"];

export type OccasionGroup = { occasion: string; photos: GalleryView[] };

export const getCustomShowcase = cache(async (limit = 4): Promise<OccasionGroup[]> => {
  const all = await getGallery();
  return OCCASION_ORDER.map((occasion) => ({
    occasion,
    photos: all.filter((p) => p.occasion === occasion).slice(0, limit),
  })).filter((g) => g.photos.length > 0);
});
