# God-Mode Organic — Blow Up Before Paid Ads

**Rule:** Don’t scale Meta spend until Stripe Live is verified + one real `cs_live_` charge. Until then, **organic is the growth engine.**

## Platforms (priority order)
| # | Platform | Why | Format |
|---|----------|-----|--------|
| 1 | **Instagram Reels** | Already posting · Graph API ready | 9:16 walkthroughs |
| 2 | **Facebook Reels / Page** | Same Meta asset · cross-post | Same MP4 + caption |
| 3 | **TikTok** | Cold discovery · pain hooks | Same MP4, shorter caption, native feel |
| 4 | **YouTube Shorts** | SEO residue · evergreen | Same MP4 + keyword title |
| 5 | **LinkedIn** | Grant + Bid + Offer B2B | Walkthrough + text post |
| 6 | **X / Twitter** | Hooks + link | 1 clip + thread |

## Account foundation checklist
- [ ] IG @apex.capitaladmin bio 100% (see Apex Ops `4 - Meta Instagram\INSTAGRAM_PROFILE_COPY.txt`)
- [ ] Profile photo = `public/brand/apex-logo-profile.png`
- [ ] Highlights: Notice · Grant · Bid · Offer · How it works
- [ ] Pin best walkthrough Reel
- [ ] Facebook Page name + cover + CTA button → `/go/notice` or `/modes`
- [ ] Create TikTok `@apexcapitaladmin` (or closest available) — same logo/bio
- [ ] Create YouTube channel “Apex Capital Admin Services” — Shorts tab
- [ ] Linktree-style: Modes + /go/* (or site `/modes` as bio link)
- [ ] GA4 + Meta Pixel installed (already on site)
- [ ] Google Search Console property verified

## Creative bar (non-negotiable)
1. **Real site walkthrough** (Playwright) — not text-card spam
2. Hook in 0–2s (pain + deadline)
3. Show sample intake
4. End card with `/go/{mode}`
5. Caption = problem → proof → CTA → disclaimer → hashtags
6. UTM on every link: `utm_source={platform}&utm_medium=reel&utm_campaign=apex_{mode}_walkthrough`

## Cadence (organic god-mode)
| Day | Posts | What |
|-----|-------|------|
| Every day | 2–4 | 1 Mode overview OR 1 engine-inside-Mode Reel |
| Mon | Brand/Vision | Vision reel or “time back” message |
| Tue | Notice Mode | Mode overview → then engines inside (pay-or-quit, vacate, deposit…) |
| Wed | Grant Mode | Mode overview → narrative → outline → budget → compliance |
| Thu | Bid Mode | Mode overview → proposal → change order → scope… |
| Fri | Offer Mode | Mode overview → offer → rejection → promotion… |
| Sat | Catalog/Concierge | “Which engine?” |
| Sun | How it works / FAQ | Trust + CTA |

**Advertise Modes two ways:**
1. **Mode overview** — list what’s inside + CTA `/go/{mode}` (captions in MODE-ADS)
2. **Engine inside Mode** — one engine per Reel → `/engine/{slug}?sample=1`

Full list: `docs/marketing/MODE_AD_CATALOG.md` · export: `npx tsx scripts/export-mode-ad-kits.ts`

Max ~4 IG/day (queue rule). Cross-post same MP4 to FB/TT/YT same day.

## Generate walkthroughs
```bash
npx tsx scripts/generate-mode-walkthrough-ad.ts --mode bid --force --capture
npx tsx scripts/generate-mode-walkthrough-ad.ts --mode offer --force --capture
npx tsx scripts/generate-mode-walkthrough-ad.ts --mode grant --force --capture
npx tsx scripts/generate-mode-walkthrough-ad.ts --mode notice --force --capture
npx tsx scripts/generate-mode-walkthrough-ad.ts --mode vision --force --capture
```
Outputs: `public/ads/apex-{mode}-walkthrough.mp4` + `.json` (caption included).

## Cross-post recipe (same video, 4 platforms)
1. Open `public/ads/apex-*-walkthrough.mp4`
2. Paste platform caption from `docs/marketing/CROSS_PLATFORM_POST_KIT.md` or the `.json` caption
3. Swap `utm_source=` to `instagram` | `facebook` | `tiktok` | `youtube`
4. First comment: soft CTA + `/go/*` link (IG/FB)
5. Reply to every comment in first 60 minutes

## Engagement loops that compound
- Ask “Grant, Notice, Bid, or Offer — what’s your deadline?” in captions
- Duet/stitch pain posts (TikTok) with your walkthrough answer
- SEO Shorts titles: “Pay or Quit Notice Draft in 60 Seconds (Not Legal Advice)”
- Collab with 1 landlord TikTok + 1 grant-writer IG weekly (DM value: free draft credit after first live charge works)

## Kill / keep rules (organic)
- Keep: watch-through >40% OR profile visits spike
- Remake: <20% watch-through — sharpen 0–2s hook only
- Never delete; archive weak; double-down winners with 3 hook variants

## When to turn on paid
Only after:
1. Stripe Live verified + bank
2. One `cs_live_` $24 order end-to-end
3. At least 2 walkthroughs with organic proof (saves / shares / link taps)
4. Then: $50/day Notice + Grant → see god-mode-ads-playbook canvas
