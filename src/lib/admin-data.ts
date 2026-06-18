import "server-only";
import { asc, desc } from "drizzle-orm";
import { db } from "@/db";
import {
  categories,
  menuItems,
  itemVariants,
  itemAddons,
  galleryImages,
  contactMessages,
  type Category,
  type MenuItem,
  type ItemVariant,
  type ItemAddon,
  type GalleryImage,
  type ContactMessage,
} from "@/db/schema";

export type AdminItem = MenuItem & { variants: ItemVariant[] };
export type AdminCategory = Category & { items: AdminItem[] };

export async function getAdminCategories(): Promise<Category[]> {
  return db.select().from(categories).orderBy(asc(categories.sort));
}

export async function getAdminMenu(): Promise<AdminCategory[]> {
  const [cats, items, variants] = await Promise.all([
    db.select().from(categories).orderBy(asc(categories.sort)),
    db.select().from(menuItems).orderBy(asc(menuItems.sort)),
    db.select().from(itemVariants).orderBy(asc(itemVariants.sort)),
  ]);
  const vByItem = new Map<number, ItemVariant[]>();
  for (const v of variants) {
    const arr = vByItem.get(v.itemId) ?? [];
    arr.push(v);
    vByItem.set(v.itemId, arr);
  }
  return cats.map((c) => ({
    ...c,
    items: items
      .filter((i) => i.categoryId === c.id)
      .map((i) => ({ ...i, variants: vByItem.get(i.id) ?? [] })),
  }));
}

export async function getAdminAddons(): Promise<ItemAddon[]> {
  return db.select().from(itemAddons).orderBy(asc(itemAddons.sort));
}

export async function getAdminGallery(): Promise<GalleryImage[]> {
  return db.select().from(galleryImages).orderBy(asc(galleryImages.sort));
}

export async function getAdminMessages(): Promise<ContactMessage[]> {
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}
