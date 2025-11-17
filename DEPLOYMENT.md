# Cloudflare Pages Deployment Guide

This project can be deployed to Cloudflare Pages using several methods, bypassing the wrangler CLI issues.

## Prerequisites

1. **Cloudflare API Token**: Create one at https://dash.cloudflare.com/profile/api-tokens
   - Required permissions: `Account > Cloudflare Pages > Edit`
   - Or use a token with `Account > Account Settings > Read` and `Zone > Zone Settings > Read`

2. **Cloudflare Account ID**: Found in your Cloudflare dashboard URL or account settings

3. **Environment Variables**:
   ```powershell
   # Windows PowerShell
   $env:CLOUDFLARE_API_TOKEN = "your-api-token-here"
   $env:CLOUDFLARE_ACCOUNT_ID = "your-account-id-here"
   ```

## Deployment Methods

### Method 1: GitHub Actions (Recommended)

Automatically deploys when you push to the main/master branch.

1. **Set up GitHub Secrets**:
   - Go to your GitHub repository → Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
     - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID

2. **Push to GitHub**:
   ```bash
   git push origin main
   ```

3. The GitHub Action will automatically:
   - Build your project
   - Deploy to Cloudflare Pages

### Method 2: Node.js Script

Deploy directly from your local machine using the Node.js script.

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Set environment variables** (if not already set):
   ```powershell
   $env:CLOUDFLARE_API_TOKEN = "your-api-token"
   $env:CLOUDFLARE_ACCOUNT_ID = "your-account-id"
   ```

3. **Run the deployment script**:
   ```bash
   npm run deploy
   # or
   node deploy-pages.js
   ```

### Method 3: PowerShell Script

Use the PowerShell script for Windows deployment.

1. **Build the project**:
   ```powershell
   npm run build
   ```

2. **Set environment variables**:
   ```powershell
   $env:CLOUDFLARE_API_TOKEN = "your-api-token"
   $env:CLOUDFLARE_ACCOUNT_ID = "your-account-id"
   ```

3. **Run the PowerShell script**:
   ```powershell
   .\deploy-pages.ps1
   ```

### Method 4: Manual Upload via Cloudflare Dashboard

If all automated methods fail, you can manually upload the build.

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Create a zip file** of the `.svelte-kit/cloudflare` directory

3. **Upload via Cloudflare Dashboard**:
   - Go to https://dash.cloudflare.com
   - Navigate to Pages → Your Project
   - Click "Upload assets" or "Deployments" → "Create deployment"
   - Upload the zip file

### Method 5: Cloudflare Pages Direct Upload API (Using curl)

If you have curl installed, you can use this method:

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Create a zip file**:
   ```powershell
   Compress-Archive -Path ".\.svelte-kit\cloudflare\*" -DestinationPath "deploy.zip" -Force
   ```

3. **Upload using curl**:
   ```bash
   curl -X POST \
     "https://api.cloudflare.com/client/v4/accounts/YOUR_ACCOUNT_ID/pages/projects/evd-site/deployments" \
     -H "Authorization: Bearer YOUR_API_TOKEN" \
     -F "file=@deploy.zip"
   ```

## Environment Variables for Build

If you need to set build-time environment variables (like `VITE_TURNSTILE_SITEKEY`), create a `.env.production` file:

```env
VITE_TURNSTILE_SITEKEY=your-site-key-here
```

## Cloudflare Pages Configuration

Make sure your Cloudflare Pages project is configured with:

- **Framework preset**: SvelteKit
- **Build command**: `npm run build`
- **Build output directory**: `.svelte-kit/cloudflare`
- **Root directory**: `/` (or leave empty)

## Troubleshooting

### Build directory not found
- Make sure you've run `npm run build` before deploying
- Check that `.svelte-kit/cloudflare` directory exists

### API authentication errors
- Verify your API token has the correct permissions
- Check that your Account ID is correct
- Ensure environment variables are set correctly

### Deployment fails
- Check the Cloudflare Dashboard for error messages
- Verify your project name matches in `wrangler.toml` and deployment scripts
- Ensure all required environment variables are set in Cloudflare Dashboard (secrets)

## Project Configuration

- **Project Name**: `evd-site` (can be changed via `CLOUDFLARE_PROJECT_NAME` env var)
- **Account ID**: Found in `wrangler.toml` or Cloudflare Dashboard
- **Build Output**: `.svelte-kit/cloudflare`

## Additional Resources

- [Cloudflare Pages API Documentation](https://developers.cloudflare.com/api/operations/pages-deployment-create-deployment)
- [Cloudflare Pages Guide](https://developers.cloudflare.com/pages/)
- [SvelteKit Cloudflare Adapter](https://kit.svelte.dev/docs/adapter-cloudflare)

