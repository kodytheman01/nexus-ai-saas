# Reads .env and sets GitHub Actions secrets (values not echoed).
# Requires: gh auth login
Set-Location "C:\Users\kodyt\Projects\nexus-ai-saas"
if (-not (gh auth status 2>$null)) { Write-Error "Run: gh auth login"; exit 1 }
function Get-EnvVal([string]$key) {
  $line = Get-Content .\.env | Where-Object { $_ -match "^$key=" } | Select-Object -First 1
  if (-not $line) { return $null }
  return $line.Substring($key.Length + 1).Trim()
}
$page = Get-EnvVal "META_PAGE_ACCESS_TOKEN"
$ig = Get-EnvVal "INSTAGRAM_BUSINESS_ACCOUNT_ID"
$base = Get-EnvVal "PUBLIC_AD_VIDEO_BASE_URL"
if (-not $page -or -not $ig) { Write-Error "Missing tokens in .env"; exit 1 }
if (-not $base) { $base = "https://apexcapitaladmin.com/ads" }
$page | gh secret set META_PAGE_ACCESS_TOKEN
$ig | gh secret set INSTAGRAM_BUSINESS_ACCOUNT_ID
$base | gh secret set PUBLIC_AD_VIDEO_BASE_URL
Write-Host "SECRETS_SET_OK"
gh secret list
