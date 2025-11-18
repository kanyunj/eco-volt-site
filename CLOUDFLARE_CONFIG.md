# Cloudflare Pages Configuration Guide

## Required Environment Variables

For the contact form to work properly, you need to configure the following in your Cloudflare Pages dashboard:

### 1. Navigate to Cloudflare Pages Settings
- Go to: https://dash.cloudflare.com/eb8aad565e3bfef48fdeade9d8b2c3ea/pages/view/evd-site
- Click on **Settings** → **Environment variables**

### 2. Set Production Environment Variables

Add these variables for the **Production** environment:

#### Email Configuration (Required for form submissions)
- **Variable name:** `MAIL_FROM`
  - **Value:** An email address from your verified domain (e.g., `no-reply@ecovoltdynamics.com`)
  - **Note:** The domain must be verified with MailChannels. See MailChannels setup below.

- **Variable name:** `MAIL_TO`
  - **Value:** `hello@ecovoltdynamics.com` (or your preferred recipient email)

#### Turnstile Configuration (Required for spam protection)
- **Variable name:** `TURNSTILE_SECRET`
  - **Value:** Your Cloudflare Turnstile secret key
  - **How to get it:**
    1. Go to https://dash.cloudflare.com/?to=/:account/turnstile
    2. Create a new site or use an existing one
    3. Copy the **Secret Key** (not the Site Key)
    4. Set this as a **Secret** (not a plain variable) in Pages

- **Variable name:** `VITE_TURNSTILE_SITEKEY` (for build-time)
  - **Value:** Your Cloudflare Turnstile site key (the public one)
  - **Note:** This needs to be available at build time, so you may need to set it in GitHub Actions secrets if deploying via CI/CD

### 3. Set D1 Database Binding

The D1 database binding should be configured automatically, but verify it:

1. Go to **Settings** → **Functions** → **D1 Database bindings**
2. Ensure you have:
   - **Binding name:** `DB`
   - **Database:** `evd-submissions`
   - **Database ID:** `0a438188-4c54-4381-9b26-6a610e7f30ea`

If the binding is missing:
1. Go to **Workers & Pages** → **D1** in your Cloudflare dashboard
2. Find or create the `evd-submissions` database
3. In Pages settings, add the binding manually

### 4. MailChannels Domain Verification

For MailChannels to work, you need to verify your domain:

1. **Add DNS TXT record:**
   - Go to your domain's DNS settings in Cloudflare
   - Add a TXT record:
     - **Name:** `_mailchannels` (or `@` for root domain)
     - **Value:** Get this from MailChannels verification (usually something like `v=mc1 ...`)
   
2. **Verify in MailChannels:**
   - Visit: https://mailchannels.zendesk.com/hc/en-us/articles/4565898358413
   - Follow their domain verification process

3. **Important:** The `MAIL_FROM` address must use a verified domain. If `ecovoltdynamics.com` is not verified, emails will fail.

### 5. Testing the Configuration

After setting up:

1. **Test the form submission:**
   - Submit a test form
   - Check Cloudflare Pages logs: **Settings** → **Functions** → **Logs**
   - Look for any error messages

2. **Check D1 Database:**
   - Go to **Workers & Pages** → **D1** → **evd-submissions**
   - Click **Open Console** to query: `SELECT * FROM submissions ORDER BY created_at DESC LIMIT 10;`

3. **Check email delivery:**
   - If email fails, check the Pages logs for error messages
   - Common issues:
     - Domain not verified with MailChannels
     - `MAIL_FROM` using unverified domain
     - MailChannels API rate limits

## Troubleshooting

### Form shows success but no email/D1 entry

1. **Check Pages Function Logs:**
   - Go to **Settings** → **Functions** → **Logs**
   - Look for errors related to D1 or email

2. **Verify environment variables are set:**
   - Ensure variables are set for the correct environment (Production/Preview)
   - Secrets must be marked as "Encrypted" in the dashboard

3. **Check D1 binding:**
   - Verify the `DB` binding exists in Pages settings
   - Ensure the database ID matches

4. **Test email configuration:**
   - Try a simple test: set `MAIL_FROM` to a verified domain
   - Check MailChannels domain verification status

### Common Error Messages

- **"Email not configured"**: `MAIL_FROM` or `MAIL_TO` not set
- **"D1 database not available"**: `DB` binding not configured
- **"Email failed"**: Domain not verified or MailChannels issue
- **"D1 insert failed"**: Database permissions or binding issue

## Quick Setup Checklist

- [ ] Set `MAIL_FROM` environment variable (verified domain)
- [ ] Set `MAIL_TO` environment variable
- [ ] Set `TURNSTILE_SECRET` as a secret
- [ ] Set `VITE_TURNSTILE_SITEKEY` (for build)
- [ ] Verify D1 database binding `DB` exists
- [ ] Verify domain with MailChannels
- [ ] Test form submission
- [ ] Check D1 database for entries
- [ ] Verify email delivery

