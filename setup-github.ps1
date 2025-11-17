# Quick setup script for GitHub repository (PowerShell)

Write-Host "Setting up GitHub repository for Cloudflare Pages deployment..." -ForegroundColor Cyan

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Initial commit: SvelteKit app with Cloudflare Pages deployment"
    Write-Host "Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "Git repository already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Create a new repository on GitHub (don't initialize with README)"
Write-Host "2. Run these commands (replace YOUR_USERNAME and REPO_NAME):"
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git" -ForegroundColor Gray
Write-Host "   git branch -M main" -ForegroundColor Gray
Write-Host "   git push -u origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Add these secrets in GitHub repository settings -> Secrets -> Actions:" -ForegroundColor Yellow
Write-Host "   - CLOUDFLARE_API_TOKEN: l4Bg_eEaRTwZ9VKYwoFZLrq-VM6EhF9C1wQopafi" -ForegroundColor Gray
Write-Host "   - CLOUDFLARE_ACCOUNT_ID: eb8aad565e3bfef48fdeade9d8b2c3ea" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Push to main branch to trigger deployment!" -ForegroundColor Green
Write-Host ""
Write-Host "See GITHUB_SETUP.md for detailed instructions" -ForegroundColor Cyan
