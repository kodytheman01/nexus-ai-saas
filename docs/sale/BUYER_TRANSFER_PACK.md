# Buyer Transfer Pack — Apex Capital Admin Services

Complete this **after escrow funds are secured**. Seller walks buyer through each line.

## Day-of transfer checklist

### 1. Code & Git
- [ ] Invite buyer as GitHub owner/admin on `nexus-ai-saas` (or transfer repo)
- [ ] Confirm `main` deploys cleanly
- [ ] Hand off any private branches / ad kit folders if included

### 2. Domain
- [ ] Transfer or push DNS for `apexcapitaladmin.com` to buyer’s registrar
- [ ] Update Netlify custom domain ownership
- [ ] Confirm HTTPS + www/apex redirects

### 3. Hosting (Netlify)
- [ ] Transfer Netlify site / team membership
- [ ] Rotate and re-set env vars with buyer’s values where needed
- [ ] Trigger production deploy; smoke `/`, `/go/notice`, `/go/grant`

### 4. Database (Neon)
- [ ] Transfer Neon project **or** export + import Postgres
- [ ] Update `DATABASE_URL` on Netlify
- [ ] Run `npx prisma db push` / seed if buyer wants a fresh catalog

### 5. Stripe
- [ ] Option A: Transfer Stripe account ownership (if eligible)  
- [ ] Option B: Buyer creates Stripe account; set `STRIPE_SECRET_KEY` + webhook  
- [ ] Webhook endpoint: `https://apexcapitaladmin.com/api/webhooks/stripe`  
- [ ] Events: at least `checkout.session.completed`  
- [ ] Test one live or test-mode purchase end-to-end

### 6. AI & email
- [ ] Buyer’s `OPENAI_API_KEY` (or agreed provider)
- [ ] Buyer’s `GMAIL_USER` + `GMAIL_APP_PASSWORD` (or SMTP)
- [ ] Send test deliverable email

### 7. Analytics & ads
- [ ] GA4 property access / new measurement ID
- [ ] Meta Pixel + Conversions API tokens
- [ ] Instagram / Facebook Page roles → buyer Business Manager
- [ ] Rotate `META_PAGE_ACCESS_TOKEN`, `INSTAGRAM_BUSINESS_ACCOUNT_ID`

### 8. Ops & secrets
- [ ] `OPS_DASHBOARD_PASSWORD` changed
- [ ] `CRON_SECRET` / Inngest keys if used
- [ ] Remove seller personal access from all dashboards

### 9. Brand & content
- [ ] Confirm `/brand` assets load
- [ ] IG handle @apex.capitaladmin access
- [ ] Ad creatives in repo (`public/ads/`, video kits) included

### 10. Support window
- [ ] Seller email support for **7 days** (business hours CT) for transfer-only questions
- [ ] No custom feature work unless separately paid

## Env var inventory (names only — values via password manager at close)

```
DATABASE_URL
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_APP_URL
OPENAI_API_KEY
OPENAI_MODEL
GMAIL_USER
GMAIL_APP_PASSWORD
META_PAGE_ACCESS_TOKEN
INSTAGRAM_BUSINESS_ACCOUNT_ID
META_PAGE_ID
NEXT_PUBLIC_META_PIXEL_ID
META_CONVERSIONS_API_TOKEN
NEXT_PUBLIC_GA_MEASUREMENT_ID
OPS_DASHBOARD_PASSWORD
INNGEST_EVENT_KEY
INNGEST_SIGNING_KEY
CRON_SECRET
```

## Smoke test (buyer runs after cutover)
```bash
npx tsx scripts/perfect-pass.ts
# or
npx tsx scripts/qa-site-smoke.ts
npx tsx scripts/verify-engine-quality.ts
```

## Legal note
Buyer accepts Terms/Privacy as-is unless renegotiated. Outputs remain informational drafts — not licensed advice. Seller does not warrant future revenue.
