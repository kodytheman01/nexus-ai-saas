# Meta / Instagram — agent posting handoff (one step from you)

I can run the queue and schedule. I **cannot** finish Meta login or create a Business account without your phone/email verification.

## Blockers right now (local)

- `META_PAGE_ACCESS_TOKEN` — missing
- `META_USER_TOKEN` — missing  
- `INSTAGRAM_BUSINESS_ACCOUNT_ID` — already set
- `PUBLIC_AD_VIDEO_BASE_URL` — already set (`/ads`)

## What you do once (5–10 min)

1. Open [Meta Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app → Get Token → **User token** with:
   - `instagram_basic`
   - `instagram_content_publish`
   - `pages_show_list`
   - `pages_read_engagement`
3. Paste the token into local `.env` as:
   ```
   META_USER_TOKEN=EAA...
   ```
4. Tell me “token is in .env” — I run:
   ```
   npx tsx scripts/bootstrap-meta-tokens.ts
   ```
   That writes `META_PAGE_ACCESS_TOKEN` + confirms IG id.
5. I then:
   ```
   npm run ig:queue
   npm run ig:publish -- --limit 1
   ```
   and enable the schedule (GitHub Action / cron).

## Do NOT paste

- Random `me/accounts` URL query strings
- Short-lived tokens into chat (put in `.env` only)

## Schedule once token works

- GitHub Action: `.github/workflows/ig-publish.yml` (cron every 2h, posts due queue items)
- Or Windows Task Scheduler calling `npm run ig:publish`

Captions for Grant Mode must use:
`https://apexcapitaladmin.com/go/grant?utm_source=instagram&utm_medium=reel&utm_campaign=apex_wave1_grant`
