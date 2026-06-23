"use server";

import { revalidatePath } from "next/cache";
import { asc, eq } from "drizzle-orm";
import { del } from "@vercel/blob";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { sendAdminNotification } from "@/lib/push";
import { allowedBlobUrlOrNull, assertAllowedBlobUrl } from "@/lib/blob-url";
import { db } from "@/db";
import {
  admins,
  categories,
  menuItems,
  itemVariants,
  itemAddons,
  galleryImages,
  contactMessages,
  settings,
  pushSubscriptions,
} from "@/db/schema";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
}

/** Revalidate the whole public site (shares the root layout) + admin. */
function refresh() {
  revalidatePath("/", "layout");
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const int = (fd: FormData, k: string, d = 0) => {
  const n = parseInt(str(fd, k), 10);
  return Number.isFinite(n) ? n : d;
};
const bool = (fd: FormData, k: string) => fd.get(k) === "on" || fd.get(k) === "true";

export type ActionState = { ok?: boolean; error?: string };

async function runAction(fn: () => Promise<void>): Promise<ActionState> {
  try {
    await fn();
    return { ok: true };
  } catch (e) {
    console.error("[admin action]", e);
    if (e instanceof Error && e.message === "Unauthorized") {
      return { error: "Session expired. Sign in again." };
    }
    return { error: "Couldn't save. Try again." };
  }
}

/* ----------------------------- Categories ------------------------------ */

export async function createCategory(fd: FormData) {
  await requireAdmin();
  const name = str(fd, "name");
  if (!name) return;
  await db.insert(categories).values({
    name,
    slug: str(fd, "slug") || slugify(name),
    blurb: str(fd, "blurb") || null,
    sort: int(fd, "sort"),
    isVisible: true,
  });
  refresh();
}

export async function updateCategory(_prev: ActionState, fd: FormData): Promise<ActionState> {
  return runAction(async () => {
    await requireAdmin();
    const id = int(fd, "id");
    await db
      .update(categories)
      .set({
        name: str(fd, "name"),
        blurb: str(fd, "blurb") || null,
        imageUrl: allowedBlobUrlOrNull(str(fd, "imageUrl")),
        sort: int(fd, "sort"),
        isVisible: bool(fd, "isVisible"),
      })
      .where(eq(categories.id, id));
    refresh();
  });
}

export async function deleteCategory(fd: FormData) {
  await requireAdmin();
  await db.delete(categories).where(eq(categories.id, int(fd, "id")));
  refresh();
}

export async function setCategoryImage(categoryId: number, imageUrl: string) {
  await requireAdmin();
  const safeUrl = assertAllowedBlobUrl(imageUrl);
  await db.update(categories).set({ imageUrl: safeUrl }).where(eq(categories.id, categoryId));
  refresh();
}

/* ------------------------------- Items --------------------------------- */

export async function createItem(fd: FormData) {
  await requireAdmin();
  const name = str(fd, "name");
  const categoryId = int(fd, "categoryId");
  if (!name || !categoryId) return;
  await db.insert(menuItems).values({
    categoryId,
    name,
    slug: str(fd, "slug") || slugify(name),
    description: str(fd, "description") || null,
    tags: str(fd, "tags") || null,
    isEggless: bool(fd, "isEggless"),
    isPriceOnRequest: bool(fd, "isPriceOnRequest"),
    isVisible: true,
    sort: int(fd, "sort"),
  });
  refresh();
}

export async function updateItem(_prev: ActionState, fd: FormData): Promise<ActionState> {
  return runAction(async () => {
    await requireAdmin();
    const id = int(fd, "id");
    await db
      .update(menuItems)
      .set({
        name: str(fd, "name"),
        categoryId: int(fd, "categoryId"),
        description: str(fd, "description") || null,
        tags: str(fd, "tags") || null,
        isEggless: bool(fd, "isEggless"),
        isPriceOnRequest: bool(fd, "isPriceOnRequest"),
        isVisible: bool(fd, "isVisible"),
        sort: int(fd, "sort"),
        updatedAt: new Date(),
      })
      .where(eq(menuItems.id, id));
    refresh();
  });
}

export async function deleteItem(fd: FormData) {
  await requireAdmin();
  await db.delete(menuItems).where(eq(menuItems.id, int(fd, "id")));
  refresh();
}

export async function setItemImage(itemId: number, imageUrl: string) {
  await requireAdmin();
  const safeUrl = assertAllowedBlobUrl(imageUrl);
  await db
    .update(menuItems)
    .set({ imageUrl: safeUrl, updatedAt: new Date() })
    .where(eq(menuItems.id, itemId));
  refresh();
}

/* ------------------------------ Variants ------------------------------- */

export async function addVariant(fd: FormData) {
  await requireAdmin();
  const itemId = int(fd, "itemId");
  const label = str(fd, "label");
  if (!itemId || !label) return;
  const existing = await db.select().from(itemVariants).where(eq(itemVariants.itemId, itemId));
  await db.insert(itemVariants).values({
    itemId,
    label,
    priceInr: int(fd, "priceInr"),
    isDefault: existing.length === 0,
    sort: existing.length,
  });
  refresh();
}

export async function updateVariant(_prev: ActionState, fd: FormData): Promise<ActionState> {
  return runAction(async () => {
    await requireAdmin();
    await db
      .update(itemVariants)
      .set({ label: str(fd, "label"), priceInr: int(fd, "priceInr"), sort: int(fd, "sort") })
      .where(eq(itemVariants.id, int(fd, "id")));
    refresh();
  });
}

export async function setDefaultVariant(fd: FormData) {
  await requireAdmin();
  const itemId = int(fd, "itemId");
  const id = int(fd, "id");
  await db.update(itemVariants).set({ isDefault: false }).where(eq(itemVariants.itemId, itemId));
  await db.update(itemVariants).set({ isDefault: true }).where(eq(itemVariants.id, id));
  refresh();
}

export async function deleteVariant(fd: FormData) {
  await requireAdmin();
  await db.delete(itemVariants).where(eq(itemVariants.id, int(fd, "id")));
  refresh();
}

/* ------------------------------- Add-ons ------------------------------- */

export async function createAddon(fd: FormData) {
  await requireAdmin();
  const name = str(fd, "name");
  if (!name) return;
  const existing = await db.select().from(itemAddons);
  await db.insert(itemAddons).values({
    name,
    priceInr: int(fd, "priceInr"),
    appliesTo: "cakes",
    isActive: true,
    sort: existing.length,
  });
  refresh();
}

export async function updateAddon(_prev: ActionState, fd: FormData): Promise<ActionState> {
  return runAction(async () => {
    await requireAdmin();
    await db
      .update(itemAddons)
      .set({ name: str(fd, "name"), priceInr: int(fd, "priceInr"), isActive: bool(fd, "isActive") })
      .where(eq(itemAddons.id, int(fd, "id")));
    refresh();
  });
}

export async function deleteAddon(fd: FormData) {
  await requireAdmin();
  await db.delete(itemAddons).where(eq(itemAddons.id, int(fd, "id")));
  refresh();
}

/* ------------------------------- Gallery ------------------------------- */

export async function createGalleryImage(data: {
  blobUrl: string;
  alt: string;
  caption?: string;
  occasion?: string | null;
  isHero?: boolean;
}) {
  await requireAdmin();
  const existing = await db.select().from(galleryImages).orderBy(asc(galleryImages.sort));
  await db.insert(galleryImages).values({
    blobUrl: data.blobUrl,
    alt: data.alt || "Baker's Perk cake",
    caption: data.caption || null,
    occasion: data.occasion || null,
    isHero: data.isHero ?? false,
    isVisible: true,
    sort: existing.length,
  });
  refresh();
}

export async function updateGalleryImage(fd: FormData) {
  await requireAdmin();
  await db
    .update(galleryImages)
    .set({
      alt: str(fd, "alt"),
      caption: str(fd, "caption") || null,
      occasion: str(fd, "occasion") || null,
      isHero: bool(fd, "isHero"),
      isVisible: bool(fd, "isVisible"),
      sort: int(fd, "sort"),
    })
    .where(eq(galleryImages.id, int(fd, "id")));
  refresh();
}

export async function deleteGalleryImage(fd: FormData) {
  await requireAdmin();
  const id = int(fd, "id");
  const rows = await db.select().from(galleryImages).where(eq(galleryImages.id, id)).limit(1);
  if (rows[0]) {
    try {
      await del(rows[0].blobUrl);
    } catch {
      // blob may already be gone — ignore
    }
  }
  await db.delete(galleryImages).where(eq(galleryImages.id, id));
  refresh();
}

/* ------------------------------ Settings ------------------------------- */

const SETTING_KEYS = [
  "name",
  "byline",
  "tagline",
  "whatsapp_number",
  "instagram",
  "contact_email",
  "address",
  "hours",
  "delivery_note",
  "min_lead_days",
  "banner_text",
] as const;

export async function updateSettings(fd: FormData) {
  await requireAdmin();
  for (const key of SETTING_KEYS) {
    const value = str(fd, key);
    await db
      .insert(settings)
      .values({ key, value })
      .onConflictDoUpdate({ target: settings.key, set: { value } });
  }
  // banner toggle is a checkbox
  const bannerEnabled = bool(fd, "banner_enabled") ? "true" : "false";
  await db
    .insert(settings)
    .values({ key: "banner_enabled", value: bannerEnabled })
    .onConflictDoUpdate({ target: settings.key, set: { value: bannerEnabled } });
  refresh();
}

/* ------------------------------ Messages ------------------------------- */

export async function markMessageRead(fd: FormData) {
  await requireAdmin();
  await db.update(contactMessages).set({ isRead: true }).where(eq(contactMessages.id, int(fd, "id")));
  refresh();
}

export async function deleteMessage(fd: FormData) {
  await requireAdmin();
  await db.delete(contactMessages).where(eq(contactMessages.id, int(fd, "id")));
  refresh();
}

/* --------------------------- Account / security ------------------------ */

export type PasswordState = { ok?: boolean; error?: string };

export async function changePassword(_prev: PasswordState, fd: FormData): Promise<PasswordState> {
  const session = await auth();
  const userId = Number((session?.user as { id?: string } | undefined)?.id);
  if (!session?.user || !userId) return { error: "You're not signed in." };

  const current = str(fd, "current");
  const next = str(fd, "next");
  const confirm = str(fd, "confirm");
  if (next.length < 8) return { error: "New password must be at least 8 characters." };
  if (next !== confirm) return { error: "New passwords don't match." };

  const rows = await db.select().from(admins).where(eq(admins.id, userId)).limit(1);
  const admin = rows[0];
  if (!admin) return { error: "Account not found." };

  const ok = await bcrypt.compare(current, admin.passwordHash);
  if (!ok) return { error: "Current password is incorrect." };

  const passwordHash = await bcrypt.hash(next, 12);
  await db.update(admins).set({ passwordHash }).where(eq(admins.id, userId));
  return { ok: true };
}

/* ----------------------------- Push devices ---------------------------- */

export async function savePushSubscription(sub: {
  endpoint: string;
  p256dh: string;
  auth: string;
  userAgent?: string;
}) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  const adminId = Number((session.user as { id?: string }).id) || null;
  await db
    .insert(pushSubscriptions)
    .values({
      endpoint: sub.endpoint,
      p256dh: sub.p256dh,
      auth: sub.auth,
      adminId,
      userAgent: sub.userAgent ?? null,
    })
    .onConflictDoUpdate({
      target: pushSubscriptions.endpoint,
      set: { p256dh: sub.p256dh, auth: sub.auth, adminId },
    });
}

export async function deletePushSubscription(endpoint: string) {
  await requireAdmin();
  await db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, endpoint));
}

export async function sendTestNotification() {
  await requireAdmin();
  await sendAdminNotification({
    title: "Test — Baker's Perk",
    body: "Notifications are working. You'll be alerted on new enquiries.",
    url: "/admin",
    tag: "test",
  });
}
