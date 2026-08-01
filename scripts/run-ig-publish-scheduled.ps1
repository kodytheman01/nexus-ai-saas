Set-Location "C:\Users\kodyt\Projects\nexus-ai-saas"
$env:NODE_OPTIONS = ""
# God Mode walkthrough MP4s — served from Netlify (public/ads)
$env:PUBLIC_AD_VIDEO_BASE_URL = "https://apexcapitaladmin.com/ads"

# 1) Retire one due Wave-1 spam Reel (slow cleanup) — never fails the post step
npx --yes tsx scripts/run-ig-retire-due.ts *>> "instagram-release\last-retire.log"

# 2) Post one due God Mode walkthrough remake
npm run ig:publish -- --limit 1 *>> "instagram-release\last-publish.log"
