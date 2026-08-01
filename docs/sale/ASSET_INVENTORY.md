# Asset Inventory — Apex Capital Admin Services

## Digital properties
| Asset | Detail |
|-------|--------|
| Domain | apexcapitaladmin.com |
| Production site | https://apexcapitaladmin.com |
| Git repo | nexus-ai-saas (GitHub) |
| Hosting | Netlify + @netlify/plugin-nextjs |
| Database | Neon Postgres (Prisma) |
| Payments | Stripe Checkout + webhooks |
| Email | Gmail SMTP (nodemailer) |
| AI | OpenAI chat completions |
| Jobs | Inngest (`engine/payment.success`, abandoned drip) |
| Analytics | GA4 + Meta Pixel / CAPI |
| Social | Instagram @apex.capitaladmin + Facebook Page |

## Product surface
| Area | Count / notes |
|------|----------------|
| Active engines | 525 |
| Core catalog | 500 |
| Notice / Tenant | 14 |
| Bid Mode | 6 |
| Offer Mode | 5 |
| Flagships | 26 |
| Money URLs | `/go/grant` `/go/notice` `/go/bid` `/go/offer` |
| Mode hubs | `/grant-mode` `/notice-mode` `/bid-mode` `/offer-mode` `/modes` |
| Trust pages | `/platform` `/faq` `/brand` `/how-it-works` `/about` `/terms` `/privacy` |

## Notable features
- Specialist sample intake auto-load (every engine)
- Engine quality normalization on seed
- Canonical redirects for cannibal SKUs → Mode engines
- Abandoned checkout capture (pre-Stripe + Stripe session)
- Success-page upsells by engine/category
- TX/FL/CA Notice state packs
- Concierge AI routing (full catalog)
- Optional human review (+$49)
- Walkthrough ad assets under `public/ads/`

## Brand
| Asset | Path / URL |
|-------|------------|
| Logo (profile) | `/brand/apex-logo-profile.png` |
| FB cover | `/brand/apex-cover-facebook.png` |
| Colors | Navy `#0b1f3a` · Gold `#c9a227` · Cream `#f7f5f0` |
| Support | admin@apexcapitaladmin.com · (214) 506-3083 |

## Exclusions (unless negotiated)
- Seller personal devices / password managers
- Seller’s other businesses / Site Factory sibling repos
- Future feature work beyond 7-day transfer support
