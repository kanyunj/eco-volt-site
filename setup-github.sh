#!/bin/bash
# Quick setup script for GitHub repository

echo "🚀 Setting up GitHub repository for Cloudflare Pages deployment..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit: SvelteKit app with Cloudflare Pages deployment"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

echo ""
echo "📋 Next steps:"
echo "1. Create a new repository on GitHub (don't initialize with README)"
echo "2. Run these commands (replace YOUR_USERNAME and REPO_NAME):"
echo "   git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Add these secrets in GitHub repository settings → Secrets → Actions:"
echo "   - CLOUDFLARE_API_TOKEN: l4Bg_eEaRTwZ9VKYwoFZLrq-VM6EhF9C1wQopafi"
echo "   - CLOUDFLARE_ACCOUNT_ID: eb8aad565e3bfef48fdeade9d8b2c3ea"
echo ""
echo "4. Push to main branch to trigger deployment!"
echo ""
echo "📖 See GITHUB_SETUP.md for detailed instructions"

