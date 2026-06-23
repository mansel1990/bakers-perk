/**
 * One-time seed: migrates the existing static content into the database and
 * uploads every photo in /public/images to Vercel Blob (clean folders).
 *
 * Run with:  npm run db:seed
 * Idempotent — clears our content tables first, then re-inserts. Re-uploads
 * images each run (deterministic blob paths, so they overwrite, not pile up).
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { db } from "./index";
import {
  categories,
  menuItems,
  itemVariants,
  itemAddons,
  galleryImages,
  settings,
} from "./schema";
import { blobPath, BLOB_ROOT } from "../lib/blob";
import { put, list } from "@vercel/blob";
import { FULL_MENU, MENU_CATEGORIES, isEggless } from "../data/menu";
import { GALLERY } from "../data/gallery";
import { SITE } from "../lib/site";

const IMAGES_DIR = path.join(process.cwd(), "public", "images");
const ASSETS_DIR = path.join(process.cwd(), "scripts", "assets");

/** Hero photos flagged is_hero=true (mirrors HeroSlider's current selection). */
const HERO_SRCS = new Set([
  "/images/gallery-silhouette-wedding.jpg",
  "/images/gallery-floral-retirement.jpg",
  "/images/gallery-red-velvet-heart.jpg",
  "/images/gallery-wedding-pradeep-ramya.jpg",
  "/images/gallery-25th-anniversary.jpg",
]);

/** Map a category name -> its banner image local path. */
const CATEGORY_IMAGE: Record<string, string | undefined> = Object.fromEntries(
  MENU_CATEGORIES.map((c) => [c.name, c.image])
);

/** Parse a display price string into numeric variants. */
function parseVariants(price: string): { label: string; priceInr: number; isDefault: boolean }[] {
  if (/enquire/i.test(price)) return [];
  const kg = [...price.matchAll(/(½\s*kg|1\s*kg)\s*₹([\d,]+)/g)];
  if (kg.length) {
    return kg.map((m, i) => ({
      label: m[1].replace(/\s+/g, " ").trim(),
      priceInr: parseInt(m[2].replace(/,/g, ""), 10),
      isDefault: i === 0,
    }));
  }
  const flat = price.match(/₹([\d,]+)/);
  if (flat) return [{ label: "each", priceInr: parseInt(flat[1].replace(/,/g, ""), 10), isDefault: true }];
  return [];
}

/**
 * Upload a local /images/<file> to Blob under the given folder; returns the URL,
 * or null if the source file no longer exists (images may have been removed from
 * the repo after the initial migration — they already live in Blob + the DB).
 */
async function uploadImage(localSrc: string, folder: "menu" | "gallery" | "hero"): Promise<string | null> {
  const file = localSrc.replace("/images/", "");
  let abs = path.join(IMAGES_DIR, file);
  if (!fs.existsSync(abs)) {
    abs = path.join(ASSETS_DIR, file);
  }
  if (!fs.existsSync(abs)) {
    console.warn(`  ! ${file} not found in public/images or scripts/assets — skipping upload`);
    return null;
  }
  const data = fs.readFileSync(abs);
  const res = await put(blobPath(folder, file), data, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "image/jpeg",
  });
  return res.url;
}

async function clearContent() {
  // child -> parent order to respect FKs
  await db.delete(itemVariants);
  await db.delete(menuItems);
  await db.delete(categories);
  await db.delete(itemAddons);
  await db.delete(galleryImages);
  await db.delete(settings);
}

async function main() {
  console.log("→ Clearing existing content…");
  await clearContent();

  // --- Categories (+ banner images to Blob) ---
  console.log("→ Categories…");
  const categoryIdByName = new Map<string, number>();
  for (let i = 0; i < MENU_CATEGORIES.length; i++) {
    const c = MENU_CATEGORIES[i];
    let imageUrl: string | null = null;
    const localBanner = CATEGORY_IMAGE[c.name];
    if (localBanner) {
      imageUrl = await uploadImage(localBanner, "menu");
    }
    const [row] = await db
      .insert(categories)
      .values({ name: c.name, slug: c.id, blurb: c.blurb, imageUrl, sort: i, isVisible: true })
      .returning({ id: categories.id });
    categoryIdByName.set(c.name, row.id);
  }

  // --- Menu items + variants ---
  console.log("→ Menu items + variants…");
  let itemSort = 0;
  for (const m of FULL_MENU) {
    const categoryId = categoryIdByName.get(m.category);
    if (!categoryId) {
      console.warn(`  ! Skipping ${m.name} — unknown category ${m.category}`);
      continue;
    }
    const variants = parseVariants(m.price);
    const [item] = await db
      .insert(menuItems)
      .values({
        categoryId,
        name: m.name,
        slug: m.slug,
        tags: m.tags,
        isEggless: isEggless(m),
        isPriceOnRequest: variants.length === 0,
        isVisible: true,
        sort: itemSort++,
      })
      .returning({ id: menuItems.id });

    if (variants.length) {
      await db.insert(itemVariants).values(
        variants.map((v, i) => ({
          itemId: item.id,
          label: v.label,
          priceInr: v.priceInr,
          isDefault: v.isDefault,
          sort: i,
        }))
      );
    }
  }

  // --- Add-ons ---
  console.log("→ Add-ons…");
  await db.insert(itemAddons).values([
    { name: "Photo Cake", priceInr: 300, appliesTo: "cakes", isActive: true, sort: 0 },
    { name: "Fondant Cake", priceInr: 400, appliesTo: "cakes", isActive: true, sort: 1 },
    { name: "Fondant Toys", priceInr: 200, appliesTo: "cakes", isActive: true, sort: 2 },
  ]);

  // --- Gallery (photos to Blob) ---
  console.log("→ Gallery images → Blob…");
  for (let i = 0; i < GALLERY.length; i++) {
    const g = GALLERY[i];
    const isHero = HERO_SRCS.has(g.src);
    const url = await uploadImage(g.src, isHero ? "hero" : "gallery");
    if (!url) continue;
    await db.insert(galleryImages).values({
      blobUrl: url,
      alt: g.alt,
      caption: g.caption,
      occasion: g.occasion ?? null,
      sort: i,
      isHero,
      isVisible: true,
    });
    process.stdout.write(`  ✓ ${g.src.replace("/images/", "")}\n`);
  }

  // --- Settings ---
  console.log("→ Settings…");
  await db.insert(settings).values([
    { key: "name", value: SITE.name },
    { key: "byline", value: SITE.byline },
    { key: "tagline", value: SITE.tagline },
    { key: "whatsapp_number", value: SITE.whatsapp },
    { key: "instagram", value: SITE.instagram },
    { key: "contact_email", value: SITE.email },
    { key: "address", value: SITE.address },
    { key: "hours", value: SITE.hours },
    { key: "delivery_note", value: SITE.deliveryNote },
    { key: "min_lead_days", value: String(SITE.minLeadDays) },
    { key: "banner_text", value: "" },
    { key: "banner_enabled", value: "false" },
  ]);

  // --- Summary ---
  const blobs = await list({ prefix: `${BLOB_ROOT}/` });
  console.log("\n✓ Seed complete.");
  console.log(`  Categories: ${MENU_CATEGORIES.length}`);
  console.log(`  Menu items: ${FULL_MENU.length}`);
  console.log(`  Gallery: ${GALLERY.length}`);
  console.log(`  Blobs under ${BLOB_ROOT}/: ${blobs.blobs.length}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
