Set-Location "C:\Users\kodyt\Projects\nexus-ai-saas"
$env:NODE_OPTIONS = ""
npm run ig:publish -- --limit 1 *>> "instagram-release\last-publish.log"
