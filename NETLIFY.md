# Deploy to Netlify

Your app runs on **your computer** until you deploy. Netlify needs **PostgreSQL** (not SQLite).

## 1. Create a free database (Neon)

1. Sign up at [neon.tech](https://neon.tech)
2. Create a project → copy the **connection string** (starts with `postgresql://`)
3. Paste it as `DATABASE_URL` in Netlify env vars (step 4)

## 2. Push code to GitHub

```bash
git add .
git commit -m "Prepare Netlify deploy"
git remote add origin https://github.com/YOUR_USER/nexus-ai-saas.git
git push -u origin main
```

## 3. Connect Netlify

1. [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import from Git**
2. Pick your repo
3. Build settings are read from `netlify.toml` automatically
4. Click **Deploy** (first build may fail until env vars are set — that's normal)

## 4. Environment variables (Netlify → Site → Environment variables)

| Variable | Value |
|----------|--------|
| `DATABASE_URL` | Neon connection string |
| `NEXT_PUBLIC_APP_URL` | `https://apexcapitaladmin.com` |
| `OPENAI_API_KEY` | Your OpenAI key (optional for demo output) |
| `GMAIL_USER` | `admin@apexcapitaladmin.com` |
| `GMAIL_APP_PASSWORD` | Google Workspace **App Password** (not your normal login password) |
| `STRIPE_SECRET_KEY` | Stripe test/live secret key |
| `STRIPE_WEBHOOK_SECRET` | From Stripe webhook setup (below) |
| `OPS_DASHBOARD_PASSWORD` | Password for `/admin` ops dashboard |
| `GOOGLE_SITE_VERIFICATION` | Search Console HTML-tag token (optional until verified) |
| `NEXT_PUBLIC_GA_ID` | GA4 measurement ID (e.g. `G-VRBDF096T6`) |

Redeploy after adding variables: **Deploys → Trigger deploy → Clear cache and deploy**.

## 5. Stripe webhook (when using real payments)

1. Stripe Dashboard → **Developers → Webhooks → Add endpoint**
2. URL: `https://apexcapitaladmin.com/api/webhooks/stripe`
   (Legacy path `/.netlify/functions/stripe-webhook` also works — proxied to the same handler.)
3. Event: `checkout.session.completed`
4. Copy signing secret → `STRIPE_WEBHOOK_SECRET` in Netlify

## 7. Google Search Console

1. [search.google.com/search-console](https://search.google.com/search-console) → **Add property** → URL prefix → `https://apexcapitaladmin.com`
2. Choose **HTML tag** verification → copy only the `content="…"` token
3. Netlify → Environment variables → `GOOGLE_SITE_VERIFICATION` = that token
4. Redeploy, then click **Verify**
5. **Sitemaps** → submit `https://apexcapitaladmin.com/sitemap.xml`

The site already renders the verification meta tag when the env var is set (`app/layout.tsx`).

## 8. Ops daily rhythm

1. Open `https://apexcapitaladmin.com/admin` (password = `OPS_DASHBOARD_PASSWORD`)
2. Clear the **human review queue** within 1 business day
3. Confirm Connection health (Stripe / OpenAI / Gmail) before scaling ads
4. After real orders, optionally add anonymized wins in `config/wins.ts`

## 9. Ads launch (after one successful paid checkout)

- Standard creatives: `video-ads-output/` (500 MP4s)
- Launch kits with captions + UTM URLs: `ad-launch-kits/`
- Premium subset: `video-ads-premium/` (~41)
- Prefer Grant Mode landing: `https://apexcapitaladmin.com/grant-mode` or engine UTM links from each kit
- Do not auto-blast Instagram until Meta Business tokens + public video hosting are configured

---

**Live URL format:** `https://random-name.netlify.app` or your custom domain.

Local dev still uses `npm run dev` with the same `DATABASE_URL` (Neon works from localhost too).
