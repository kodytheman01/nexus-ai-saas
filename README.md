# Nexus Engines — Problem-to-Asset Factory

Turn specialized knowledge engines into paid micro-assets.

## Quick start

```bash
npm install
npx prisma db push
npx prisma db seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Copy `.env.example` to `.env`:

- **DATABASE_URL** — PostgreSQL (Neon/Supabase). Required for Netlify; SQLite is not used.
- **No Stripe key** → **demo mode** (instant unlock, no payment)
- **Stripe keys** → real Checkout + webhook at `/api/webhooks/stripe`
- **No OpenAI key** → demo placeholder output
- **OpenAI key** → live generation

**Deploy to Netlify:** see [NETLIFY.md](./NETLIFY.md).

## Money loop

1. Catalog → `/engine/[slug]`
2. `POST /api/checkout` stores long input as ephemeral payload, then Stripe (or demo)
3. Webhook / demo path creates `engine_runs` row and queues generation
4. `/success` polls `/api/engine-status` until complete

## Scripts

- `npm run dev` — Next.js
- `npm run db:push` — sync Prisma schema
- `npm run db:seed` — seed Engines 1–10
- `npm run build` — production build

## Disclaimer

Outputs are informational blueprints only — not legal, tax, medical, or engineering advice.
