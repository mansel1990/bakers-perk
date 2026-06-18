# Baker's Perk — Phase 2 PRD: Database, Admin & Dynamic Content

**Version:** 1.1 · **Date:** 18 Jun 2026 · **Owner:** Sanjay
**Status:** 🟢 Decisions locked — build in progress.

> Read `docs/IMPLEMENTATION.md` for current state. This phase makes the site **dynamic and admin-editable** without changing the look.

### Decisions locked (18 Jun 2026)
- **Auth:** Auth.js (NextAuth v5) credentials — **login by username**, primary admin **`alex`**. No second admin for now.
- **Database:** Neon Postgres + Drizzle ORM, isolated in a dedicated `bakers_perk` schema. ✅ live + seeded.
- **Photos:** all images moved to Vercel Blob under a clean `bakers-perk/` folder tree. ✅ done.
- **Domain:** `bakersperk.com` purchased (Spaceship) → points to Vercel.
- **Analytics:** GA4 `G-20MNPYYJVH` (stream "bakers-perk"). ✅ wired.
- **Cart / orders / payments:** moved out of Phase 2 → **Phase 3** (with Razorpay + custom builder).
- **Resend (contact emails):** dropped for now — contact stays WhatsApp-first; messages will be stored in the DB for the admin inbox (no email service).

### Build progress
- ✅ DB schema + seed (menu/prices/variants/add-ons/gallery/settings)
- ✅ All photos in Vercel Blob; `next/image` configured for the Blob domain
- ✅ Public site reads everything from the DB (menu, search, gallery, custom showcase, footer, sidebar, settings) + announcement banner
- ✅ GA4 installed (+ `custom_cake_enquiry`, `contact_submit` events)
- ✅ Auth.js login (username `alex`) + `middleware.ts` protection
- ✅ Admin backoffice: menu/cost CRUD, categories, add-ons, gallery manager (Blob client-upload), settings, messages inbox; **Bill generator** placeholder (disabled) in the sidebar
- ✅ Contact form captures to DB (admin inbox) + WhatsApp handoff
- ✅ Admin **change-password** form (+ `db:seed-admin` reset path)
- ✅ SEO: `sitemap.xml`, `robots.txt`, dynamic OG/Twitter image, LocalBusiness (Bakery) JSON-LD, richer metadata
- ✅ **PWA + Web Push**: installable app (manifest, service worker, brand icons) and admin phone notifications via VAPID — fires on new contact enquiry (reusable for Phase 3 orders)

### Admin routes
`/admin/login` · `/admin` (dashboard) · `/admin/menu` · `/admin/gallery` · `/admin/messages` · `/admin/settings`. Public pages live in a `(site)` route group; admin has its own themed, mobile-friendly shell.

---

## 1. Goal

Turn the static brochure into a **content-managed site**:

1. **Admin login** so the Baker's Perk team can sign in securely.
2. **Everything comes from database tables** — menu, prices, categories, gallery, shop settings.
3. **Admin can edit the menu and cost** (and gallery, shop info) from a backoffice — no code changes, no redeploys.
4. **Photos go to Vercel Blob** wherever uploads happen (gallery + menu item photos).
5. **Contact messages are captured** in the DB (still WhatsApp-first, but the admin gets an inbox). Cart/orders are Phase 3.

### Phase numbering note
The original `PRD.md` folded DB/admin into "Phase 1" but it was never built, and labelled "Phase 2" as the *custom-cake builder + Razorpay*. To keep things clear:

- **Phase 2 (this doc)** = backend, DB, admin, Blob, dynamic public site, GA4, basic SEO. **No cart.**
- **Phase 3 (later)** = cart + checkout + order capture, **Razorpay payments**, custom-cake builder with live pricing, delivery-area rules.

---

## 2. Key decisions for Sanjay to confirm

These are the decisions that shape the build. My recommendation is in **bold**; tell me if you'd prefer an alternative.

### 2.1 Admin login — what kind of auth?

**Locked: Auth.js (NextAuth v5) with a Credentials provider — login by *username* (not email).** Primary admin username is **`alex`**. Email on the admin record is optional. No public sign-up; admin-only. No second admin for now (the schema still supports adding more later).

Why this over the alternatives:

| Option | Verdict | Reasoning |
|---|---|---|
| **Auth.js / NextAuth v5 (Credentials)** | ✅ **Recommended** | Built for Next.js App Router. Handles secure session cookies, CSRF, and `middleware.ts` route protection for us. Passwords are bcrypt-hashed in our own `admins` table — no third party holds your logins. Easy to add 1–2 more admins. |
| "Just a normal login" (hand-rolled cookie/JWT) | ⚠️ Possible but not advised | We'd have to correctly implement session signing, expiry, CSRF, and cookie security ourselves. Easy to get subtly wrong on a site that takes customer data. Not worth the risk for ~zero saved effort. |
| Hosted auth (Clerk / Auth0 / Google OAuth) | ❌ Overkill | Adds a paid/3rd-party dependency and a sign-in UI mismatch for a 1–3 person bakery team. Google OAuth would also force admins to use specific Google accounts. |

So: **not "just a normal login"** in the roll-your-own sense — but the *experience* is a normal username + password box. Auth.js just does the dangerous parts properly. There is no public customer login; auth is **admin-only**.

**Admin management:** the primary admin (`alex`, seeded once) can add/remove more admins from Settings later. No public sign-up.

### 2.2 Database — provider & access layer

- **Provider: Vercel Postgres** (Neon-backed) — same as PRD, zero-config on Vercel, generous free tier.
- **Access layer: Drizzle ORM** (recommended) — TypeScript-first, lightweight, serverless-friendly, SQL-like. Alternative is Prisma (heavier, but nice Studio GUI). **Recommend Drizzle.**
- **Migrations + seed:** schema defined in code; a seed script imports the current `menu.ts` / `gallery.ts` / `site.ts` into tables so we launch with today's exact content.

> Confirm: Vercel Postgres + Drizzle OK?

### 2.3 Pricing model — the important restructure

Today a price is a **string** (`"½ kg ₹600 — 1 kg ₹1200"`). To let admin edit cost and to compute carts later, prices become **numbers in a variants table**:

- A menu item has one or more **variants** (e.g. `½ kg → 600`, `1 kg → 1200`; or a single flat variant for doughnuts/tarts at `120`).
- Items with no fixed price (e.g. "Enquire for price" cheesecakes) get a `price_on_request` flag and no numeric variant.
- The public menu re-formats numbers into the same display strings it shows now, so **the page looks identical**.

> Confirm: this restructure is expected and fine.

### 2.4 Photos — Vercel Blob

- **Gallery + menu item photos** are stored in **Vercel Blob**; the DB stores the Blob URL.
- **One-time seed:** upload the existing `/public/images/*` to Blob and register them, so admin can reorder/delete/replace from day one.
- **Admin uploads** use Blob client-upload (presigned) to avoid the 4.5 MB serverless body limit and to handle large cake photos.
- `next.config.ts` gets `images.remotePatterns` for the Blob domain so `next/image` keeps optimizing.

> Confirm: move images to Blob now (vs. keeping `/public` for the seed set and only Blob for new uploads). **Recommend: all to Blob** for consistency.

---

## 3. Database schema (built — schema `bakers_perk`)

As implemented and pushed to Neon. All tables live in the `bakers_perk` Postgres schema.

```
admins
  id, name, username (unique), email (nullable), password_hash,
  role ('owner'|'admin'), is_active, created_by, created_at

categories
  id, name, slug (unique), blurb, image_url (Blob banner), sort, is_visible

menu_items
  id, category_id (fk), name, slug (unique), description, tags,
  image_url (Blob, nullable), is_eggless, is_price_on_request,
  is_visible, sort, created_at, updated_at

item_variants
  id, item_id (fk), label ('½ kg' | '1 kg' | 'each' …),
  price_inr (int), is_default, sort

item_addons                      -- Photo Cake, Fondant, Fondant Toys
  id, name, price_inr (int), applies_to ('cakes'|'all'…), is_active, sort

gallery_images
  id, blob_url, alt, caption, occasion (nullable), sort,
  is_hero, is_visible, created_at

contact_messages
  id, name, email, phone, message, is_read, created_at

settings                          -- key/value, admin-editable
  key, value
  -- name, byline, tagline, whatsapp_number, instagram, contact_email,
  -- address, hours, delivery_note, min_lead_days, banner_text, banner_enabled

orders / order_items              -- tables exist but UNUSED until Phase 3 (cart + payments)
```

> The `orders` / `order_items` tables are already created so Phase 3 can use them without a migration. Phase 3 also adds `cake_flavors`, `cake_addons`, `cake_config` for the priced builder.

---

## 4. Scope — what gets built in Phase 2

### 4.1 Admin backoffice (`/admin/*`, auth-protected)

- **Login** (`/admin/login`): **username** + password (Auth.js). `middleware.ts` protects all `/admin/*` except login.
- **Dashboard**: counts (unread messages) + quick links.
- **Menu manager**:
  - Categories: add/rename/reorder/hide, banner image.
  - Items: add/edit/delete, set description, tags, eggless flag, visibility, sort, **photo upload (Blob)**.
  - **Variants + cost**: edit labels and ₹ prices per item (the "edit cost" requirement).
  - Add-ons: edit Photo Cake / Fondant / Fondant Toys prices.
- **Gallery manager**: upload (Blob), drag-reorder, delete, set hero images, set occasion/caption.
- **Contact inbox**: list/read stored contact messages.
- **Settings**: edit tagline, WhatsApp number, contact email, address, hours, min lead-time, delivery note, announcement banner (text + on/off).
- *(Orders dashboard ships in Phase 3 with the cart.)*

### 4.2 Public site — swap static data for DB ✅ DONE

- Menu, search index, categories, gallery, custom-cakes showcase, footer, sidebar, contact details all read from the DB instead of `data/*` and `lib/site.ts`, via a server data layer (`src/lib/data.ts`).
- Announcement banner renders when enabled in settings.
- Pages use ISR (`revalidate = 60`); admin mutations will add on-demand `revalidatePath` for instant updates.
- **Look and behaviour unchanged** — this was a data-source swap behind existing components.

### 4.3 Contact form → DB capture

- Store `contact_messages` in the DB (server action) so the admin has an inbox. Keep the WhatsApp handoff as the primary path.
- **No email service (Resend dropped).** Can be added later if the team wants email notifications.

### 4.4 Analytics & SEO

- ✅ GA4 (`G-20MNPYYJVH`) installed via `next/script`; events `custom_cake_enquiry`, `contact_submit` fire today. More events arrive with the cart in Phase 3.
- ⬜ `sitemap.xml`, OG image defaults, and LocalBusiness JSON-LD schema.

> Cart & order capture moved to **Phase 3** (see below).

---

## 5. Out of scope (Phase 3)

- **Cart + checkout + order capture** (`orders` / `order_items`) and the orders dashboard.
- **Razorpay / online payments.**
- Custom-cake builder with live pricing.
- Delivery-area restrictions by Chennai zone.
- Customer accounts/login (there is **no** public login — admin only).
- Coupons/promos.
- Email notifications (Resend).

---

## 6. Non-functional

- Admin routes server-protected via middleware; passwords bcrypt-hashed; rate-limit the contact endpoint.
- Keep Lighthouse ≥ 90 — DB reads are server-side; Blob images via `next/image`.
- Indian locale preserved (₹, IST dates, +91 validation).
- Secrets via Vercel env vars: `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `AUTH_SECRET`, `NEXT_PUBLIC_GA_ID`.

---

## 7. Build order

1. ✅ **Foundation** — Neon Postgres + Blob; Drizzle; schema in `bakers_perk`; pushed.
2. ✅ **Seed** — imported `menu.ts` / `gallery.ts` / `site.ts` into tables; uploaded `/public/images` → Blob; wired `next.config.ts`.
3. ✅ **Public read swap** — components read the DB (menu, gallery, settings, footer/sidebar). Look identical, now data-driven + ISR.
4. ✅ **Analytics** — GA4 installed + events.
5. ✅ **Auth** — Auth.js credentials (username), seeded primary admin `alex`, `middleware.ts` protection, `/admin/login`.
6. ✅ **Admin: menu + settings** — "edit menu & cost", categories, add-ons + shop settings (site revalidated on save).
7. ✅ **Admin: gallery** — Blob client-upload, sort, hero/occasion/caption, delete.
8. ✅ **Contact capture** — messages stored in DB + admin inbox.
9. ✅ **SEO + polish** — sitemap, robots, OG/Twitter image, LocalBusiness JSON-LD, metadata.
10. ✅ **PWA + Web Push** — installable app + admin phone notifications (VAPID), change-password.

> **New env vars for deploy (add to Vercel):** `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` (e.g. `mailto:alexjamez255@gmail.com`). Keys generated with `npx web-push generate-vapid-keys --json` and stored in `.env`.

---

## 8. Resolved decisions

| # | Question | Decision |
|---|---|---|
| 1 | Auth approach | ✅ Auth.js v5 credentials |
| 2 | Admin login identifier | ✅ **Username** (`alex`), email optional |
| 3 | DB + access layer | ✅ Neon Postgres + Drizzle, `bakers_perk` schema |
| 4 | Move all images to Blob | ✅ Yes — all 28 in Blob |
| 5 | Cart/orders in Phase 2? | ✅ No — moved to **Phase 3** with payments |
| 6 | Resend contact emails | ✅ Dropped — DB inbox only |
| 7 | GA4 measurement ID | ✅ `G-20MNPYYJVH` |
| 8 | Second/third admin | ✅ None for now (schema supports adding later) |

### Next admin to confirm before the auth build
- **Primary admin password** for `alex` (you'll set it; I'll seed it hashed). Until then I can seed a temporary one and print it for you to change.

