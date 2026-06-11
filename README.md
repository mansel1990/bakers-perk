# Baker's Perk — bakersperk.com

Handcrafted cakes in Chennai. Next.js (App Router) + Tailwind v4, hosted on Vercel.

## Run locally

```bash
npm install
npm run dev
```

## Changing the color palette

Pistachio Rose is live. All colors live in one block in `src/app/globals.css` (`:root`),
including a dedicated `--panel` token for the desktop sidebar. Paste a new set of
values there and the entire site repaints — alternate palettes (Plum, Forest,
Tangerine) are kept as a reference comment in the same file.

## Shop info

WhatsApp number, address, hours, tagline: `src/lib/site.ts` (moves to the admin
backoffice in a later phase).

## Menu data

`src/data/menu.ts` (moves to Postgres + admin CRUD in a later phase).

## Roadmap

See `docs/PRD.md`.
