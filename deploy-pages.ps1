# Cloudflare Pages Deployment Script (PowerShell)
# 
# This script builds your SvelteKit project and deploys it to Cloudflare Pages
# using the Cloudflare API directly, bypassing wrangler.
#
# Prerequisites:
#   1. Set environment variables:
#      - $env:CLOUDFLARE_API_TOKEN (with Pages:Edit permissions)
#      - $env:CLOUDFLARE_ACCOUNT_ID
#   2. Install dependencies: npm install
#   3. Build the project: npm run build
#
# Usage:
#   .\deploy-pages.ps1

$ErrorActionPreference = "Stop"

$PROJECT_NAME = if ($env:CLOUDFLARE_PROJECT_NAME) { $env:CLOUDFLARE_PROJECT_NAME } else { "evd-site" }
$ACCOUNT_ID = $env:CLOUDFLARE_ACCOUNT_ID
$API_TOKEN = $env:CLOUDFLARE_API_TOKEN
$BUILD_DIR = ".\.svelte-kit\cloudflare"

# Validate environment variables
if (-not $ACCOUNT_ID) {
    Write-Host "❌ Error: CLOUDFLARE_ACCOUNT_ID environment variable is not set" -ForegroundColor Red
    exit 1
}

if (-not $API_TOKEN) {
    Write-Host "❌ Error: CLOUDFLARE_API_TOKEN environment variable is not set" -ForegroundColor Red
    exit 1
}

# Check if build directory exists
if (-not (Test-Path $BUILD_DIR)) {
    Write-Host "❌ Build directory not found: $BUILD_DIR" -ForegroundColor Red
    Write-Host "   Please run 'npm run build' first" -ForegroundColor Yellow
    exit 1
}

Write-Host "🚀 Starting Cloudflare Pages deployment..." -ForegroundColor Cyan
Write-Host "   Project: $PROJECT_NAME" -ForegroundColor Gray
Write-Host "   Account ID: $ACCOUNT_ID" -ForegroundColor Gray
Write-Host ""

# Create a zip file of the build directory
$zipPath = ".\.svelte-kit\cloudflare-deploy.zip"
Write-Host "📦 Creating deployment package..." -ForegroundColor Cyan

if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

# Compress the build directory
Compress-Archive -Path "$BUILD_DIR\*" -DestinationPath $zipPath -Force

Write-Host "✅ Package created: $zipPath" -ForegroundColor Green
Write-Host ""

# Upload to Cloudflare Pages
Write-Host "📤 Uploading to Cloudflare Pages..." -ForegroundColor Cyan

$headers = @{
    "Authorization" = "Bearer $API_TOKEN"
}

# Use Cloudflare Pages API to create a deployment
# Note: This uses the direct upload API endpoint
$apiUrl = "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/pages/projects/$PROJECT_NAME/deployments"

try {
    # For direct file upload, we need to use multipart/form-data
    # PowerShell's Invoke-RestMethod doesn't handle this well, so we'll use curl
    $curlCommand = "curl -X POST `"$apiUrl`" -H `"Authorization: Bearer $API_TOKEN`" -F `"file=@$zipPath`""
    
    Write-Host "   Executing deployment..." -ForegroundColor Gray
    
    $response = Invoke-Expression $curlCommand | ConvertFrom-Json
    
    if ($response.success) {
        $deployment = $response.result
        Write-Host ""
        Write-Host "✅ Deployment successful!" -ForegroundColor Green
        Write-Host "   Deployment ID: $($deployment.id)" -ForegroundColor Gray
        if ($deployment.url) {
            Write-Host "   URL: $($deployment.url)" -ForegroundColor Cyan
        }
        if ($deployment.alias) {
            Write-Host "   Alias: $($deployment.alias)" -ForegroundColor Cyan
        }
    } else {
        Write-Host "❌ Deployment failed:" -ForegroundColor Red
        Write-Host ($response.errors | ConvertTo-Json -Depth 10) -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Deployment error:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Alternative: You can manually upload the zip file via Cloudflare Dashboard:" -ForegroundColor Yellow
    Write-Host "   1. Go to Cloudflare Dashboard > Pages > $PROJECT_NAME" -ForegroundColor Yellow
    Write-Host "   2. Click 'Upload assets'" -ForegroundColor Yellow
    Write-Host "   3. Upload: $zipPath" -ForegroundColor Yellow
    exit 1
} finally {
    # Clean up zip file
    if (Test-Path $zipPath) {
        Remove-Item $zipPath -Force
        Write-Host ""
        Write-Host "🧹 Cleaned up temporary files" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "🎉 Deployment complete!" -ForegroundColor Green

