# GitHub Actions Setup Guide

This guide will help you set up automatic deployment to Cloudflare Pages using GitHub Actions.

## Prerequisites

1. A GitHub account
2. Your Cloudflare API token and Account ID (you already have these)
3. Git installed on your local machine

## Step 1: Initialize Git Repository

If you haven't already, initialize a git repository:

```bash
cd "D:\projects\Eco volt\evd site"
git init
git add .
git commit -m "Initial commit"
```

## Step 2: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right → "New repository"
3. Name it (e.g., `evd-site`)
4. **Don't** initialize with README, .gitignore, or license (since you already have files)
5. Click "Create repository"

## Step 3: Connect Local Repository to GitHub

GitHub will show you commands. Run these in your project directory:

```bash
git remote add origin https://github.com/YOUR_USERNAME/evd-site.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## Step 4: Set Up GitHub Secrets

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add these two secrets:

   **Secret 1:**
   - Name: `CLOUDFLARE_API_TOKEN`
   - Value: `l4Bg_eEaRTwZ9VKYwoFZLrq-VM6EhF9C1wQopafi`

   **Secret 2:**
   - Name: `CLOUDFLARE_ACCOUNT_ID`
   - Value: `eb8aad565e3bfef48fdeade9d8b2c3ea`

4. Click **Add secret** for each one

## Step 5: Trigger Deployment

Once the secrets are set up, you can trigger a deployment in two ways:

### Option A: Push to Main Branch
Simply push any changes to the `main` branch:
```bash
git add .
git commit -m "Deploy to Cloudflare Pages"
git push origin main
```

### Option B: Manual Trigger
1. Go to your repository on GitHub
2. Click **Actions** tab
3. Select **Deploy to Cloudflare Pages** workflow
4. Click **Run workflow** → **Run workflow**

## Step 6: Monitor Deployment

1. Go to **Actions** tab in your GitHub repository
2. Click on the running workflow to see the deployment progress
3. Once complete, your site will be live at: `https://evd-site.pages.dev`

## Troubleshooting

### Build Fails
- Check the Actions logs for error messages
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Deployment Succeeds but Site Shows 404
- Check Cloudflare Pages dashboard for deployment status
- Verify the build output directory is correct
- Check browser console for errors

### Secrets Not Working
- Ensure secret names match exactly: `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`
- Verify the API token has the correct permissions
- Check that secrets are set at the repository level (not organization level if that's different)

## Security Notes

⚠️ **Important**: Your API token is sensitive. Never commit it to the repository or share it publicly. Always use GitHub Secrets.

## Next Steps

After successful deployment:
- Your site will automatically deploy on every push to `main`
- You can view deployments in the Cloudflare Pages dashboard
- Set up a custom domain in Cloudflare Pages settings if needed

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [SvelteKit Cloudflare Adapter](https://kit.svelte.dev/docs/adapter-cloudflare)

