# Baker's Perk — Implementation Status (as built)

**Date:** 18 Jun 2026 · **Owner:** Sanjay
**Purpose:** What is *actually* in the repo. Read alongside `docs/PRD.md` (original product spec) and `docs/PHASE2-PRD.md` (Phase 2 plan + progress).

---

## 0. Update — Phase 2 backend is now live (18 Jun 2026)

The sections below described the original **100% static** site. Since then, the backend foundation + public read swap landed:

- **Database:** Neon Postgres + Drizzle ORM, isolated in a dedicated **`bakers_perk`** schema. Tables: admins, categories, menu_items, item_variants, item_addons, gallery_images, orders, order_items, contact_messages, settings. Pushed + seeded.
- **Pricing is now numeric:** the old display-string prices are parsed into `item_variants` (e.g. `½ kg → 600`, `1 kg → 1200`), so cost is editable. 43 items / 72 variants seeded.
- **Photos in Vercel Blob:** all 28 images uploaded under a clean `bakers-perk/{menu,gallery,hero,misc}/` tree; `next.config.ts` allows the Blob domain for `next/image`.
- **Public site is DB-driven:** Home, Menu, Gallery, Custom Cakes, Contact, sidebar and footer all read from the DB via `src/lib/data.ts` (server data layer). Look/behaviour unchanged. Pages use ISR (`revalidate = 60`).
- **Settings are DB-backed:** tagline, WhatsApp, address, hours, etc. come from the `settings` table; announcement banner supported.
- **GA4 wired:** `G-20MNPYYJVH` via `next/script`, with `custom_cake_enquiry` and `contact_submit` events.
- **Auth secret + env:** `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `AUTH_SECRET`, `NEXT_PUBLIC_GA_ID` set locally (add the same in Vercel).

**Admin backoffice is now built too:** Auth.js login (username `alex`) with `middleware.ts` protection, and an admin shell (`/admin`) covering menu/cost CRUD, categories, add-ons, gallery (Blob client-upload), settings and a messages inbox — all on-theme and mobile-friendly, with a disabled **Bill generator** placeholder in the sidebar. Public routes moved into a `(site)` route group. The local `public/images` folder was removed (all images live in Vercel Blob).

**SEO is done:** `sitemap.xml`, `robots.txt` (admin/api disallowed), a dynamic OG/Twitter image (`opengraph-image.tsx`), LocalBusiness (`Bakery`) JSON-LD on public pages, plus richer OpenGraph/Twitter metadata.

**Installable PWA + phone push notifications:** `app/manifest.ts`, a service worker (`public/sw.js`), generated brand icons (`icon.png`/`apple-icon.png` + `public/icon-*.png`), and Web Push via VAPID (`web-push`). The owner installs the site to their home screen and taps **Enable on this device** on the admin dashboard; new contact enquiries push a notification (the `sendAdminNotification` helper is reusable for Phase-3 orders). Admins can also **change their password** in Settings (reset fallback: `npm run db:seed-admin`). New env: `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`.

**Still not built:** Cart + orders + payments are **Phase 3**.

Key new files: `src/db/{schema,index,seed,seed-admin}.ts`, `drizzle.config.ts`, `src/lib/{data,admin-data,blob,ga,contact,push}.ts`, `src/auth.ts`, `src/auth.config.ts`, `src/middleware.ts`, `src/components/{Analytics,RegisterSW}.tsx`, `src/components/admin/*`, `src/app/admin/*`, `src/app/{manifest,sitemap,robots,opengraph-image,twitter-image}.ts(x)`, `src/app/{icon,apple-icon}.png`, `public/sw.js`.

---

## 1. TL;DR

The live site is a **fully static, front-end-only marketing site**. It looks complete and on-brand, but **nothing is dynamic yet**:

- All content (menu, prices, gallery, shop info) is hardcoded in TypeScript files.
- There is **no database, no API routes, no authentication, and no file/image uploads**.
- Every "action" (order, contact, enquiry) is a **WhatsApp handoff** — we open `wa.me` with pre-filled text. Nothing is saved anywhere.
- Images are committed into `/public/images` and served by Next.js — **not** Vercel Blob.

In other words, several things the original PRD lists under "Phase 1" (cart → order saved to DB, admin backoffice, Vercel Blob, contact emails, GA4, SEO schema) were **not built**. The site shipped as a static brochure. Phase 2 is where the backend comes to life.

---

## 2. Tech stack (actual)

| Layer | In PRD | Actually installed |
|---|---|---|
| Framework | Next.js App Router + TS | ✅ Next.js `^15.3`, React `^19`, TypeScript `^5` |
| Styling | Tailwind + shadcn/ui + Framer Motion | ⚠️ Tailwind `^4.1` only — **no shadcn/ui, no Framer Motion** |
| Database | Vercel Postgres | ❌ none |
| Images | Vercel Blob | ❌ static files in `/public/images` |
| Admin auth | NextAuth credentials | ❌ none (placeholder page) |
| Email | Resend | ❌ none |
| Analytics | GA4 | ❌ none |
| Maps | Google Maps embed | ✅ iframe on Contact page |

Dependencies are intentionally minimal (`package.json` has only `next`, `react`, `react-dom` + Tailwind/TS dev deps). No ORM, no auth lib, no blob SDK yet.

---

## 3. Project structure

```
src/
  app/
    layout.tsx          # root: fonts, Aside (nav), Footer, mobile WhatsApp bar
    globals.css         # design tokens (palette as CSS vars) + Tailwind theme
    page.tsx            # Home
    menu/page.tsx       # Menu
    custom-cakes/page.tsx
    gallery/page.tsx
    contact/page.tsx
    admin/page.tsx      # placeholder only ("arrives in the DB phase")
  components/
    Aside.tsx           # 30/70 desktop sidebar + mobile overlay nav
    Footer.tsx
    HeroSlider.tsx      # crossfading hero images (home)
    SearchIndex.tsx     # home: live search over the menu
    MenuBrowser.tsx     # menu: category jump-nav + eggless filter (read-only)
    DreamPrompt.tsx     # custom-cake → WhatsApp prompt
    ContactForm.tsx     # name + message → opens WhatsApp
  data/
    menu.ts             # FULL_MENU, categories, featured — the menu source of truth
    gallery.ts          # GALLERY photos + occasion grouping
    cake_menu.md        # raw 2026 rate card (reference)
  lib/
    site.ts             # SITE constants (name, WhatsApp, address, hours, tagline…)
docs/
    PRD.md
```

There are **no** `src/app/api/*` routes and **no** `src/lib/db*` — confirmed.

---

## 4. What each page does today

### Home (`/`)
- `HeroSlider`: crossfades through 5 hardcoded gallery photos.
- `SearchIndex`: client-side search over `FULL_MENU`; shows featured items by default, filters as you type. Links to `/menu#<slug>`.
- Custom-cake band with `DreamPrompt`.

### Menu (`/menu`)
- `MenuBrowser`: renders `getMenuByCategory()`, sticky category jump-nav, and an **eggless-only toggle**.
- **Read-only price list.** There is **no "Add to cart"**, no variant selector control, no add-ons. Price is a pre-formatted string like `"½ kg ₹600 — 1 kg ₹1200"`.

### Custom cakes (`/custom-cakes`)
- Showcase grouped by occasion (`getCustomShowcase`), a 3-step "how it works", add-on chips (Photo +₹300 / Fondant +₹400 / Toys +₹200, hardcoded), and `DreamPrompt` → WhatsApp.

### Gallery (`/gallery`)
- Static grid of all `GALLERY` photos. No lightbox, no admin ordering.

### Contact (`/contact`)
- Shop details from `SITE`, a Google Maps embed iframe, and `ContactForm`.
- **The form does not email or store anything** — it just opens WhatsApp with the typed message. Copy explicitly says "no app data stored".

### Admin (`/admin`)
- Placeholder paragraph + `robots: noindex`. No login, no functionality.

---

## 5. Data model (current = TypeScript, not DB)

### `src/data/menu.ts`
```ts
type MenuItem = { slug; name; category; price: string; tags: string; image?: string }
```
- ~40 items across 6 categories (Standard, Premium, Exotic, Tiramisu & Mousse, Doughnuts, Tarts & Pies).
- **Price is a display string**, not numbers → cannot be summed, sorted by price, or edited granularly. This is the single biggest thing to restructure for the DB (we need numeric variants).
- `tags` is a space-separated string; "eggless" is detected via regex.
- `image` field exists on the type but **no menu item sets it** — menu rows are text-only.

### `src/data/gallery.ts`
```ts
type GalleryPhoto = { src; alt; caption; occasion? }
```
- 22 photos, paths under `/images/...`, grouped into 4 occasions for the custom-cakes showcase.

### `src/lib/site.ts`
- `SITE` object: name, byline, tagline, WhatsApp number (`919566074342`), Instagram, email, address, hours, delivery note, `minLeadDays: 2`.
- `waLink(text)` helper builds the `wa.me` URL used everywhere.

> Note the categories in the **code** (Standard/Premium/Exotic/Tiramisu & Mousse/Doughnuts/Tarts & Pies) differ from the **PRD §4.2** list (Signature/Premium/Cheesecakes/Cupcakes/Doughnuts/Jars/Tarts) and prices have been refreshed to a 2026 card. The code is the more current source of truth for the menu.

---

## 6. Design system (built & solid)

- **"The Lookbook"** layout is implemented: 30vw pinned dark sidebar on desktop (`Aside`), mobile sticky header + full-screen overlay + fixed bottom WhatsApp bar.
- **Palette** lives entirely as CSS variables in `globals.css` `:root` (currently "Pistachio Rose" — forest greens + rose accent). Swapping the block re-themes the whole site; three alternate palettes are kept as reference comments.
- Tailwind v4 `@theme inline` maps the CSS vars to utility colors (`bg-ink`, `text-accent`, `bg-panel`, etc.).
- Fonts: **Fraunces** (serif/display) + **Space Grotesk** (UI) via `next/font`.
- Motion is hand-rolled CSS transitions + the hero `setInterval`; respects `prefers-reduced-motion`. No GSAP/Lenis/Framer yet.

This layer is in good shape and should be **preserved as-is**; Phase 2 swaps the *data sources* behind these components, not the look.

---

## 7. Gaps vs PRD (the Phase 2 backlog, in effect)

| PRD item | Status | Notes |
|---|---|---|
| Cart → order saved to DB | ❌ Not built | No cart state, no checkout, no order persistence |
| WhatsApp order summary handoff | ⚠️ Partial | WhatsApp handoff exists, but not from a real cart/order |
| Admin auth | ❌ Not built | Placeholder page only |
| Admin: menu CRUD + pricing | ❌ Not built | Menu is a static TS file |
| Admin: orders dashboard | ❌ Not built | No orders exist |
| Admin: gallery management | ❌ Not built | Gallery is a static TS file |
| Admin: shop settings | ❌ Not built | `SITE` is a static TS file |
| Vercel Blob image hosting | ❌ Not built | Images committed to `/public/images` |
| Contact form → Resend email + DB | ❌ Not built | Form only opens WhatsApp |
| GA4 analytics | ❌ Not built | No GA script/events |
| SEO: sitemap, OG, JSON-LD schema | ❌ Not built | Only basic per-page `<title>`/description |
| Numeric/structured pricing | ❌ Not built | Prices are display strings |
| Menu item photos | ❌ Not built | `image` field unused |

**What IS done well:** brand/design system, all 6 public pages laid out, responsive nav, menu browse + search + eggless filter, gallery, contact details + map, WhatsApp-first UX.

---

## 8. Environment / deploy

- `.env.example` lists only commented-out future vars (`POSTGRES_URL`, `BLOB_READ_WRITE_TOKEN`, `NEXTAUTH_SECRET`, `NEXT_PUBLIC_GA_ID`). **None are wired up.**
- `next.config.ts` is empty (no `images.remotePatterns` yet — will be needed for Blob).
- Hosted on Vercel; domain `bakersperk.com` (Spaceship DNS) per PRD.

---

## 9. Implications for Phase 2

1. **Menu pricing must be restructured** from display strings to numeric `menu_items` + `item_variants` so admin can edit cost and the site can compute cart totals. A migration/seed must parse the current `menu.ts`.
2. **Components stay; data sources change.** `MenuBrowser`, `SearchIndex`, `GalleryPage`, `Footer`, `Aside`, Contact all read from `data/*` and `lib/site.ts` today — these become DB-backed server fetches (or props).
3. **Blob migration is a one-time seed**: push `/public/images/*` to Vercel Blob, store URLs in `gallery_images` / `menu_items.image_url`, then point components at Blob URLs and add `images.remotePatterns` to `next.config.ts`.
4. **Admin + auth are greenfield** — clean slate, no legacy to undo.
