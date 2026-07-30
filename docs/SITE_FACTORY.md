# Site Factory — Build $10k-feel SaaS sites from the Apex stack

Use this playbook to clone **Apex Capital Admin Services** into a new niche in ~1 day.
Goal: same polish (navy/gold institutional UI, Stripe checkout, Flagships, Grant-style Mode, Concierge, ads deep-links) with a new brand + catalog.

## What “finished” means (Definition of Done)

| Layer | Must have |
|-------|-----------|
| Brand | Name, domain, navy/gold (or new tokens), About/Terms/Privacy |
| Catalog | 50–500 engines OR curated Flagships-first catalog |
| Money path | One primary Mode (e.g. Grant Mode) → deep link `/go/{mode}` → sample intake → Stripe |
| Trust | Samples, no fake testimonials, FOA/advice disclaimers where needed |
| Ops | Admin login, Stripe webhook, email delivery, GA4 + Meta Pixel |
| Ads | Wave-1 creatives + `/go/...` UTMs + IG queue script |
| Concierge | Floating “Find an engine” AI router |

## Stack (do not reinvent)

- Next.js App Router + Tailwind
- Prisma + Postgres (Neon)
- Stripe Checkout + webhooks
- OpenAI for generation + Concierge
- Netlify deploy from `main`
- Meta Pixel + GA4 + server conversions

## Day-0 checklist (new site, ~4–8 hours if assets ready)

1. **Copy repo** → new GitHub repo → rename brand strings (`config/trust.ts`, `layout.tsx`, nav).
2. **Domain** → Netlify + DNS → `NEXT_PUBLIC_APP_URL`.
3. **Env** (Netlify): `DATABASE_URL`, `STRIPE_*`, `OPENAI_*`, `GMAIL_*`, pixel IDs, `OPS_DASHBOARD_PASSWORD`.
4. **Seed catalog** — niche engines + `config/flagship.ts` (10 flagships).
5. **Money Mode** — copy `config/conversion.ts` + `/go/{mode}` + sample intake checkout.
6. **Homepage** — hero + Mode strip + Flagships-first catalog (not a mile-long wall).
7. **Concierge** — keep `SupportChatWidget` + `/api/support-chat`.
8. **Ads** — regenerate captions; land paid traffic on `/go/{mode}`.
9. **Smoke** — `npm run qa:smoke` against production URL.
10. **Ship** — push `main`, hard-refresh, one test Stripe payment.

## Files to customize per site

| File | Change |
|------|--------|
| `config/trust.ts` | Entity name, email, phone, SLA |
| `config/flagship.ts` | 10 flagships + hooks/samples |
| `config/conversion.ts` | Primary money slug + paid-traffic rules |
| `app/page.tsx` | Hero copy |
| `app/{mode}/page.tsx` | Mode landing (Grant Mode pattern) |
| `lib/intake-examples.ts` | Sample intakes |
| `prisma/seed.ts` | Engine catalog |
| Brand CSS tokens | Keep institutional; avoid purple/AI-slop defaults |

## Ads / posting (agent-operated)

1. Host MP4s at `/ads` (public).
2. Set `PUBLIC_AD_VIDEO_BASE_URL=https://{domain}/ads`.
3. Put **long-lived** `META_PAGE_ACCESS_TOKEN` + `INSTAGRAM_BUSINESS_ACCOUNT_ID` in env (local + Netlify if using a scheduled function).
4. `npm run ig:queue` → `npm run ig:publish` (or GitHub Action cron).
5. Every Grant/Mode caption must use `/go/{mode}?utm_...` — never dump ads on the 500-wall homepage.

## Selling the build (agency)

- **Productized offer:** “Institutional AI SaaS in your niche — live in 7–14 days”
- **Price band:** $4,500–$12,000 setup + $297–$997/mo ops (hosting, Concierge, minor catalog updates)
- **Upsells:** ad creatives pack, human-review desk, custom engines
- **Do not** sell the live Apex domain cheap while it can earn; sell *clones* of the system

## Selling Apex itself (optional)

Only if you want cash now and will stop operating it:
- **No meaningful revenue:** roughly **$2k–$8k** as a turnkey codebase + brand + domain (buyer market: indie hackers, Flippa/Empire Flippers micro)
- **With $1k+/mo net:** often **2–4× annual profit** (more with growth proof)
- List: Flippa, Acquire.com, IndieHackers, warm LinkedIn outreach to grant-tech / nonprofit SaaS buyers

## Daily factory rhythm (make money)

| Time | Action |
|------|--------|
| Morning | Pick niche + domain; clone factory |
| Midday | Seed 10 flagships + money Mode; Stripe live |
| Afternoon | Ship Netlify; smoke QA |
| Evening | Client delivery OR list “done-for-you SaaS” offer; schedule 3 ads |

**Realistic throughput:** 1 polished site every 1–2 days once the factory is muscle memory — not 10/day without a team.

## Next site niches that fit this exact mold

1. **Clinic Admin Drafts** — intake → prior-auth / patient letters (compliance heavy)
2. **Contractor Bid Pack** — proposals, change orders, lien notices (educational)
3. **Creator Contract Desk** — brand deals, usage licenses, invoices
4. **HR Offer & Policy Desk** — offer letters, PIP drafts, handbooks (disclaimer-forward)
5. **Real Estate Transaction Desk** — LOIs, checklists, seller disclosures (state disclaimers)

Pick one → clone → rename → ship.
