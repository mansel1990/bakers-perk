/**
 * Database schema for Baker's Perk.
 *
 * Everything lives in a dedicated Postgres schema (`bakers_perk`) rather than
 * `public`, so this project stays cleanly isolated from anything else sharing
 * the same Neon database.
 */
import {
  pgSchema,
  serial,
  integer,
  text,
  varchar,
  boolean,
  timestamp,
  date,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

/** Our namespace — all tables are created as bakers_perk.<table>. */
export const schema = pgSchema("bakers_perk");

/* ----------------------------------------------------------------------------
 * Admins (Auth.js credentials provider authenticates against this table)
 * --------------------------------------------------------------------------*/
export const admins = schema.table(
  "admins",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 120 }).notNull(),
    username: varchar("username", { length: 60 }).notNull(), // login handle (e.g. "alex")
    email: varchar("email", { length: 255 }), // optional, for notifications
    passwordHash: text("password_hash").notNull(),
    role: varchar("role", { length: 20 }).notNull().default("admin"), // 'owner' | 'admin'
    isActive: boolean("is_active").notNull().default(true),
    createdBy: integer("created_by"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("admins_username_uq").on(t.username)]
);

/* ----------------------------------------------------------------------------
 * Menu: categories -> items -> variants, plus cross-item add-ons
 * --------------------------------------------------------------------------*/
export const categories = schema.table(
  "categories",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 120 }).notNull(),
    slug: varchar("slug", { length: 140 }).notNull(),
    blurb: text("blurb"),
    imageUrl: text("image_url"), // Vercel Blob URL for the category banner
    sort: integer("sort").notNull().default(0),
    isVisible: boolean("is_visible").notNull().default(true),
  },
  (t) => [uniqueIndex("categories_slug_uq").on(t.slug)]
);

export const menuItems = schema.table(
  "menu_items",
  {
    id: serial("id").primaryKey(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 200 }).notNull(),
    slug: varchar("slug", { length: 220 }).notNull(),
    description: text("description"),
    tags: text("tags"), // space-separated search keywords (admin-editable)
    imageUrl: text("image_url"), // Vercel Blob URL, nullable
    isEggless: boolean("is_eggless").notNull().default(false),
    isPriceOnRequest: boolean("is_price_on_request").notNull().default(false),
    isVisible: boolean("is_visible").notNull().default(true),
    sort: integer("sort").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("menu_items_slug_uq").on(t.slug),
    index("menu_items_category_idx").on(t.categoryId),
  ]
);

export const itemVariants = schema.table(
  "item_variants",
  {
    id: serial("id").primaryKey(),
    itemId: integer("item_id")
      .notNull()
      .references(() => menuItems.id, { onDelete: "cascade" }),
    label: varchar("label", { length: 60 }).notNull(), // '½ kg', '1 kg', 'each'
    priceInr: integer("price_inr").notNull(),
    isDefault: boolean("is_default").notNull().default(false),
    sort: integer("sort").notNull().default(0),
  },
  (t) => [index("item_variants_item_idx").on(t.itemId)]
);

export const itemAddons = schema.table("item_addons", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  priceInr: integer("price_inr").notNull(),
  appliesTo: varchar("applies_to", { length: 40 }).notNull().default("cakes"),
  isActive: boolean("is_active").notNull().default(true),
  sort: integer("sort").notNull().default(0),
});

/* ----------------------------------------------------------------------------
 * Gallery (images stored in Vercel Blob; we keep the URL + metadata)
 * --------------------------------------------------------------------------*/
export const galleryImages = schema.table("gallery_images", {
  id: serial("id").primaryKey(),
  blobUrl: text("blob_url").notNull(),
  alt: text("alt").notNull(),
  caption: text("caption"),
  occasion: varchar("occasion", { length: 60 }),
  sort: integer("sort").notNull().default(0),
  isHero: boolean("is_hero").notNull().default(false),
  isVisible: boolean("is_visible").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* ----------------------------------------------------------------------------
 * Orders (captured on checkout, then handed off to WhatsApp)
 * --------------------------------------------------------------------------*/
export const orders = schema.table("orders", {
  id: serial("id").primaryKey(),
  publicRef: varchar("public_ref", { length: 20 }).notNull(),
  customerName: varchar("customer_name", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  neededByDate: date("needed_by_date"),
  fulfilment: varchar("fulfilment", { length: 20 }).notNull().default("pickup"), // 'pickup' | 'delivery'
  address: text("address"),
  notes: text("notes"),
  subtotalInr: integer("subtotal_inr").notNull().default(0),
  status: varchar("status", { length: 20 }).notNull().default("new"), // new|confirmed|delivered|cancelled
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orderItems = schema.table(
  "order_items",
  {
    id: serial("id").primaryKey(),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    itemName: varchar("item_name", { length: 200 }).notNull(),
    variantLabel: varchar("variant_label", { length: 60 }),
    unitPriceInr: integer("unit_price_inr").notNull(),
    qty: integer("qty").notNull().default(1),
    isEggless: boolean("is_eggless").notNull().default(false),
    addonsJson: jsonb("addons_json"),
  },
  (t) => [index("order_items_order_idx").on(t.orderId)]
);

/* ----------------------------------------------------------------------------
 * Contact messages (stored as backup; also emailed via Resend)
 * --------------------------------------------------------------------------*/
export const contactMessages = schema.table("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* ----------------------------------------------------------------------------
 * Settings (key/value — tagline, whatsapp_number, hours, banner, etc.)
 * --------------------------------------------------------------------------*/
export const settings = schema.table("settings", {
  key: varchar("key", { length: 80 }).primaryKey(),
  value: text("value"),
});

/* ----------------------------------------------------------------------------
 * Web Push subscriptions (one row per installed admin device)
 * --------------------------------------------------------------------------*/
export const pushSubscriptions = schema.table(
  "push_subscriptions",
  {
    id: serial("id").primaryKey(),
    endpoint: text("endpoint").notNull(),
    p256dh: text("p256dh").notNull(),
    auth: text("auth").notNull(),
    adminId: integer("admin_id"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("push_subscriptions_endpoint_uq").on(t.endpoint)]
);

/* Convenience inferred types */
export type Admin = typeof admins.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type MenuItem = typeof menuItems.$inferSelect;
export type ItemVariant = typeof itemVariants.$inferSelect;
export type ItemAddon = typeof itemAddons.$inferSelect;
export type GalleryImage = typeof galleryImages.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type Setting = typeof settings.$inferSelect;
export type PushSubscription = typeof pushSubscriptions.$inferSelect;
