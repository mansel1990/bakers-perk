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

## Database (Neon Postgres + Drizzle)

All content lives in the `bakers_perk` schema. The public site reads it via
`src/lib/data.ts`. Schema is in `src/db/schema.ts`.

```bash
npm run db:push      # apply schema changes to the database
npm run db:seed      # import src/data/* into the DB + upload photos to Vercel Blob
npm run db:studio    # browse the database in Drizzle Studio
```

Env vars (see `.env.example`): `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`,
`AUTH_SECRET`, `NEXT_PUBLIC_GA_ID`.

## Shop info & menu

Editable in the DB (`settings` and `menu_items` tables); admin UI is in progress.
The static files in `src/data/*` and `src/lib/site.ts` are now only the **seed
source** + fallback defaults.

## Roadmap

See `docs/PRD.md`, `docs/PHASE2-PRD.md`, and `docs/IMPLEMENTATION.md`.
