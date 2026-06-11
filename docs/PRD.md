# Baker's Perk — Website PRD

**Brand:** Baker's Perk *by Chef Alex* (per logo — note the apostrophe)
**Version:** 1.3 · **Date:** 11 Jun 2026 · **Owner:** Sanjay
**Tagline:** "Bake this world a better place" (admin-editable)
**WhatsApp orders:** +91 95660 74342 · **Contact email:** alexjamez255@gmail.com
**Address:** 13/5 Munusamy Lane, Adithanar Salai, Pudupet, Chennai 600002 · **Hours:** 11 AM – 7 PM
**Domain:** bakersperk.com (Spaceship) · **Hosting:** Vercel
**Instagram:** [@bakers_perk](https://www.instagram.com/bakers_perk)

---

## 1. Overview

A modern, colorful, elegant website for Bakers Perk, a Chennai-based cake maker. Customers browse the menu, add items to a cart, and place an order that the Bakers Perk team confirms over WhatsApp (location + payment details shared there). Online payment (Razorpay) and the priced custom-cake builder come in Phase 2.

**Delivery scope:** Anywhere in Chennai, Tamil Nadu (exact serviceable areas to be refined later). Pickup also supported.

---

## 2. Phases

### Phase 1 (this build)
- Marketing home page
- Interactive menu page (standard items, weight variants, eggless)
- Custom cakes showcase page (no priced builder yet — enquiry CTA to WhatsApp)
- Cart → order saved to DB + pre-filled WhatsApp (wa.me) handoff
- Gallery page (admin-managed)
- Contact page (email form + fixed map of shop)
- Admin backoffice: menu CRUD + pricing, orders dashboard, gallery management, shop settings
- Google Analytics 4
- SEO basics (metadata, OG images, sitemap, local-business schema)

### Phase 2
- Custom cake builder with live pricing (weight × flavor base rate + shape + eggless surcharge + priced add-ons + notes), all rates admin-configurable
- Razorpay payments
- Delivery area restrictions (specific Chennai areas)
- Possible: customer reference-image upload, promo banners/coupons

---

## 3. Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router, TypeScript) |
| Database | Vercel Postgres |
| Images | Vercel Blob (admin uploads; no S3 needed) |
| Admin auth | NextAuth credentials — primary admin can create 1–2 more admin logins |
| Styling | Tailwind CSS + shadcn/ui, Framer Motion for subtle animation |
| Email (contact form) | Resend (free tier) → shop email |
| Analytics | GA4 (ID provided later) |
| Maps | Google Maps embed (free iframe, no API key) |

**Initial images:** the 20 downloaded photos go into the repo temporarily; a one-time seed script uploads them to Vercel Blob and registers them in the gallery table so admin can reorder/delete them from day one. No S3.

---

## 4. Pages & Requirements

### 4.1 Home (marketing)
- Hero: cake photography, tagline, CTA → Menu / Order on WhatsApp
- Highlights: signature items, custom-cake teaser, delivery across Chennai
- Gallery strip, testimonials (optional, admin-editable later), footer with hours/address/socials
- Announcement banner (admin-toggleable, e.g. holiday notice)

### 4.2 Menu (interactive)
- Category tabs/filter, driven by data. Launch categories (from 2020 menu): Signature Cakes, Premium Cakes, Exotic Cheesecakes, Cupcakes, Doughnuts, Jars, Tarts
- Item card: photo, name, description, egg/eggless badge, variant selector (½kg / 1kg for cakes; flat price for cupcakes/doughnuts/jars/tarts), Add to Cart. Some items are 1kg-only (Rainbow, cheesecakes) — supported by variant model
- **Cake add-ons (Phase 1):** the menu's flat add-ons — Photo Cake +₹300, Fondant Cake +₹400, Fondant Toys +₹200 — are selectable when adding a cake to cart, admin-configurable. (This is separate from the Phase 2 custom builder.)
- Search + eggless-only filter; hidden items not shown
- Smooth, modern interactions (hover states, quick-add, mobile-first)

#### Seed menu (from 2020 PDF — prices to be confirmed as current)

| Category | Items (½kg / 1kg ₹) |
|---|---|
| Signature Cakes | Black Forest 400/800 · Pineapple 500/900 · Butterscotch 450/800 · Choco Truffle 450/850 · Lychee 450/850 · White Choco Flakes 450/900 · Toffee Chocolate 500/900 · Irish Coffee 500/900 · Fresh Fruit 550/900 · Raspberry Truffle 550/900 · Nutty Crunch 550/1000 · Blueberry Bliss 600/1100 · Berry Street 600/1100 |
| Premium Cakes | Rainbow –/1000 · Red Velvet 650/1100 · Hazelnut Chocolate 650/1200 · Ferrero Rocher Treat 650/1200 · Belgian Chocolate 600/1200 |
| Exotic Cheesecakes | Mango/Strawberry 1000 · New York 1100 · Oreo 1100 (1kg only) |
| Cupcakes | Red Velvet, Vanilla, Choco Chip, Blueberry, Caramel, Chocolate — ₹70 each (one item per flavor) |
| Doughnuts | Milk Chocolate/Stuffed/Coffee & Cream/Custard ₹70 · Chocolate/Butterscotch ₹60 · Cinnamon Danish ₹60 |
| Jars | Caramel Fudge, Red Velvet, Triple Chocolate Mousse, Tiramisu, Irish Coffee, Blueberry — ₹160 |
| Tarts | Lemon/Chocolate ₹35 · Fruit Tart/Apple Pie ₹50 |

### 4.3 Custom Cakes (Phase 1 = showcase)
- Showcase of past custom work + what's possible (tiers, photo cakes, figurines)
- "Tell us your dream cake" CTA → WhatsApp with pre-filled enquiry text
- Phase 2 replaces this with the priced builder

### 4.4 Cart & Order
- Cart drawer/page: items, variant, qty, subtotal (₹)
- Checkout fields: name, phone, needed-by date (date picker enforces min lead time — default 2 days, admin-editable), pickup or delivery, delivery address (only if delivery), notes
- On submit:
  1. Order saved to DB with status `new`
  2. Customer shown confirmation + button opening wa.me/<shop number> with full order summary pre-filled
  3. Copy: "Our team will get back to you on WhatsApp to confirm your order and location, and share payment details."
- No online payment in Phase 1

### 4.5 Gallery
- Responsive masonry/grid, lightbox view; images and order fully admin-managed

### 4.6 Contact
- Form (name, email, phone, message) → emails the shop; stored in DB as backup
- Fixed embedded map of shop location, address, hours, WhatsApp + Instagram links

### 4.7 Admin (`/admin`, auth-protected)
- **Login:** email + password; primary admin can add/remove up to 2 more admins
- **Menu:** CRUD items, categories, weight variants + prices, egg/eggless, photos, hide/show, sort order
- **Orders:** list + detail, statuses `new → confirmed → delivered / cancelled`, link to open customer's WhatsApp chat
- **Gallery:** upload (Vercel Blob), reorder (drag), delete, pick homepage hero images
- **Settings:** tagline, WhatsApp number, contact email, address, opening hours, min lead-time days, announcement banner, delivery note text
- Pricing config for custom cakes (flavor rates/kg, add-ons, eggless surcharge) ships with Phase 2 but schema is designed now

---

## 5. Data Model (Postgres)

- `admins` (id, name, email, password_hash, created_by)
- `categories` (id, name, slug, sort)
- `menu_items` (id, category_id, name, slug, description, image_url, is_eggless_available, is_visible, sort)
- `item_variants` (id, item_id, label e.g. "½kg", price_inr, is_default)
- `item_addons` (id, name, price_inr, applies_to_category_ids, is_active) — Photo Cake, Fondant, Fondant Toys
- `orders` (id, customer_name, phone, needed_by_date, fulfilment pickup|delivery, address, notes, subtotal_inr, status, created_at)
- `order_items` (id, order_id, item_name, variant_label, unit_price_inr, qty, eggless, addons_json)
- `gallery_images` (id, blob_url, alt, sort, is_hero)
- `settings` (key, value) — tagline, whatsapp_number, contact_email, address, hours, min_lead_days, banner_text, banner_enabled
- `contact_messages` (id, name, email, phone, message, created_at)
- *Phase 2:* `cake_flavors` (rate_per_kg), `cake_addons` (price), `cake_config` (eggless_surcharge, shapes)

---

## 6. Design Direction — LOCKED: "The Lookbook"

Modern editorial concept, approved via prototype (`lookbook.html`):

- **Layout:** 30/70 split on desktop — pinned dark brand panel (logo, numbered nav, tagline small + italic, WhatsApp CTA) with scrolling content right. Mobile: sticky header + full-screen overlay menu, fixed bottom WhatsApp bar.
- **Typography:** Fraunces (serif, display + italic accents) + Space Grotesk (UI). Oversized editorial headings; tagline de-emphasized.
- **Menu index:** numbered editorial rows; desktop hover shows a cursor-following photo card; mobile shows inline thumbnails. Live search above the index (matches names, categories, tags like "eggless") with custom-cake nudge on empty results.
- **Custom cakes:** prompt-style "Describe your dream cake…" input that opens pre-filled WhatsApp.
- **Palette:** Espresso (live) — ink #171010, cream #F7F0E6, accent caramel #C98A4B. All colors are CSS variables in one block in `src/app/globals.css`; alternates (Plum, Forest, Tangerine) documented inline. Final palette is a 10-line swap.
- **Motion:** scroll reveals (IntersectionObserver), hover transitions; GSAP/Lenis smooth scroll added in polish phase. Mobile-first, Lighthouse-friendly — no WebGL.
- Gallery and Menu are separate routes carrying the same look and feel.

## 7. Non-Functional

- Mobile-first, Lighthouse ≥ 90 (performance/SEO/accessibility)
- next/image with Blob loader for optimized images
- Indian locale: ₹ formatting, IST dates, +91 phone validation
- GA4 events: view_item, add_to_cart, begin_checkout, whatsapp_order_placed, contact_submit
- Admin routes server-protected; rate-limit contact/order endpoints

---

## 8. Open Items (needed from Sanjay)

| # | Item | Status |
|---|---|---|
| 1 | WhatsApp order number | ✅ +91 95660 74342 |
| 2 | Contact email | ✅ alexjamez255@gmail.com |
| 3 | Shop address + hours | ✅ 13/5 Munusamy Lane, Adithanar Salai, Pudupet, Chennai 600002 · 11 AM–7 PM |
| 4 | Tagline | ✅ "Bake this world a better place" (editable in admin settings) |
| 5 | Logo files | ✅ Received (need transparent PNG/SVG for site use) |
| 6 | Starting menu | ✅ 2020 PDF received — **confirm prices are still current** |
| 7 | 20 images | Ready — add to repo at kickoff |
| 8 | GA4 measurement ID | Later |
| 9 | Exact delivery areas | Phase 2 |

---

## 9. Execution Plan

1. **Setup** — repo, Next.js + Tailwind + shadcn, Vercel project, Postgres + Blob provisioning, schema + seed script
2. **Theme** — design tokens from logo, home page mockup → approval
3. **Public pages** — Home, Menu, Custom Cakes showcase, Gallery, Contact
4. **Cart + order flow** — cart state, checkout, order API, wa.me handoff
5. **Admin** — auth, menu CRUD, orders dashboard, gallery, settings
6. **Polish & launch** — GA4, SEO/schema, Lighthouse pass, domain hookup (Spaceship DNS → Vercel), smoke test on mobile
