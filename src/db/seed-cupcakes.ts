/**
 * Incremental seed: adds the Cupcakes category + items to the live DB and uploads
 * the category banner to Vercel Blob. Safe to re-run — skips rows that exist.
 *
 * Run with:  npm run db:seed-cupcakes
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { asc, eq, gt, sql } from "drizzle-orm";
import { put } from "@vercel/blob";
import { db } from "./index";
import { categories, menuItems, itemVariants } from "./schema";
import { blobPath } from "../lib/blob";
import { FULL_MENU, MENU_CATEGORIES, isEggless } from "../data/menu";

const CUPCAKE_CATEGORY = "Cupcakes";
const BANNER_FILENAME = "menu-cupcakes.jpg";
const ASSETS_DIR = path.join(process.cwd(), "scripts", "assets");

/** Pexels — pink frosted cupcakes with sprinkles (free to use). */
const BANNER_SOURCE =
  "https://images.pexels.com/photos/974229/pexels-photo-974229.jpeg?auto=compress&cs=tinysrgb&w=1200";

function parseVariants(price: string): { label: string; priceInr: number; isDefault: boolean }[] {
  const flat = price.match(/₹([\d,]+)/);
  if (flat) return [{ label: "each", priceInr: parseInt(flat[1].replace(/,/g, ""), 10), isDefault: true }];
  return [];
}

async function ensureBannerAsset(force = false): Promise<Buffer> {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
  const local = path.join(ASSETS_DIR, BANNER_FILENAME);
  if (force && fs.existsSync(local)) fs.unlinkSync(local);
  if (!fs.existsSync(local)) {
    console.log("→ Downloading cupcake banner…");
    const res = await fetch(BANNER_SOURCE, {
      headers: { "User-Agent": "BakersPerk/1.0 (menu seed; +https://bakersperk.com)" },
    });
    if (!res.ok) throw new Error(`Failed to download banner: ${res.status}`);
    fs.writeFileSync(local, Buffer.from(await res.arrayBuffer()));
  }
  return fs.readFileSync(local);
}

async function uploadBanner(data: Buffer): Promise<string> {
  const res = await put(blobPath("menu", BANNER_FILENAME), data, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "image/jpeg",
  });
  return res.url;
}

async function main() {
  const catMeta = MENU_CATEGORIES.find((c) => c.name === CUPCAKE_CATEGORY);
  if (!catMeta) throw new Error("Cupcakes category missing from menu.ts");

  const cupcakeItems = FULL_MENU.filter((m) => m.category === CUPCAKE_CATEGORY);
  if (!cupcakeItems.length) throw new Error("No cupcake items in menu.ts");

  // --- Category ---
  let categoryId: number;
  const existing = await db.select().from(categories).where(eq(categories.slug, catMeta.id)).limit(1);

  if (existing.length) {
    categoryId = existing[0].id;
    console.log(`→ Category "${CUPCAKE_CATEGORY}" already exists (id ${categoryId})`);
  } else {
    const doughnuts = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, "doughnuts"))
      .limit(1);
    const insertSort = doughnuts.length ? doughnuts[0].sort : 4;

    // Make room before Doughnuts
    await db
      .update(categories)
      .set({ sort: sql`${categories.sort} + 1` })
      .where(gt(categories.sort, insertSort - 1));

    console.log("→ Uploading category banner to Vercel Blob…");
    const bannerUrl = await uploadBanner(await ensureBannerAsset());

    const [row] = await db
      .insert(categories)
      .values({
        name: catMeta.name,
        slug: catMeta.id,
        blurb: catMeta.blurb,
        imageUrl: bannerUrl,
        sort: insertSort,
        isVisible: true,
      })
      .returning({ id: categories.id });
    categoryId = row.id;
    console.log(`  ✓ Created category (id ${categoryId}) — ${bannerUrl}`);
  }

  // Refresh banner if category existed without an image, or when forcing a photo swap
  const forceBanner = process.argv.includes("--refresh-banner");
  if (existing.length && (forceBanner || !existing[0].imageUrl)) {
    const bannerUrl = await uploadBanner(await ensureBannerAsset(forceBanner));
    await db.update(categories).set({ imageUrl: bannerUrl }).where(eq(categories.id, categoryId));
    console.log(`  ✓ Updated category banner — ${bannerUrl}`);
  }

  // --- Items ---
  const siblings = await db
    .select({ slug: menuItems.slug })
    .from(menuItems)
    .where(eq(menuItems.categoryId, categoryId));
  const have = new Set(siblings.map((s) => s.slug));

  let maxSort =
    (
      await db
        .select({ sort: menuItems.sort })
        .from(menuItems)
        .orderBy(asc(menuItems.sort))
    ).at(-1)?.sort ?? -1;

  for (const m of cupcakeItems) {
    if (have.has(m.slug)) {
      console.log(`  · ${m.name} — already in DB`);
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
        sort: ++maxSort,
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
    console.log(`  ✓ ${m.name} (${m.price})`);
  }

  console.log("\n✓ Cupcakes seed complete.");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
