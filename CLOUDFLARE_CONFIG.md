# Cloudflare Pages Configuration Guide

## Required Environment Variables

For the contact form to work properly, you need to configure the following in your Cloudflare Pages dashboard:

### 1. Navigate to Cloudflare Pages Settings
- Go to: https://dash.cloudflare.com/eb8aad565e3bfef48fdeade9d8b2c3ea/pages/view/evd-site
- Click on **Settings** → **Environment variables**

### 2. Set Production Environment Variables

Add these variables for the **Production** environment:

#### Email Configuration (Required for form submissions)
- **Variable name:** `EMAILIT_API_KEY`
  - **Value:** Your EmailIt API key (starts with `em_`)
  - **How to get it:**
    1. Log in to your EmailIt dashboard
    2. Navigate to **Credentials** section
    3. Create a new credential of type 'API' if you haven't already
    4. Copy the API key
    5. Set this as a **Secret** (not a plain variable) in Pages
  - **Documentation:** https://docs.emailit.com/credentials

- **Variable name:** `MAIL_FROM`
  - **Value:** An email address from your verified sending domain (e.g., `no-reply@ecovoltdynamics.com`)
  - **Note:** The domain must be verified as a sending domain in EmailIt. See EmailIt setup below.

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

### 4. EmailIt Sending Domain Setup

For EmailIt to work, you need to set up a verified sending domain:

1. **Create a Sending Domain in EmailIt:**
   - Log in to your EmailIt dashboard
   - Navigate to **Sending Domains** section
   - Click **Add Domain** or **Create Domain**
   - Enter your domain (e.g., `ecovoltdynamics.com`)
   
2. **Verify the Domain:**
   - EmailIt will provide DNS records to add to your domain
   - Go to your domain's DNS settings in Cloudflare
   - Add the required DNS records (typically SPF, DKIM, and DMARC records)
   - Wait for DNS propagation (usually a few minutes)
   - Return to EmailIt and verify the domain
   
3. **Important:** The `MAIL_FROM` address must use a verified sending domain. If `ecovoltdynamics.com` is not verified, emails will fail.

**Documentation:**
- EmailIt Sending Domains Guide: https://docs.emailit.com/guides/creating-sending-domain
- EmailIt API Documentation: https://docs.emailit.com/emails

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
     - Domain not verified as sending domain in EmailIt
     - `MAIL_FROM` using unverified domain
     - `EMAILIT_API_KEY` not set or incorrect
     - EmailIt API rate limits (check your subscription limits)

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
   - Verify `EMAILIT_API_KEY` is set correctly
   - Ensure `MAIL_FROM` uses a verified sending domain in EmailIt
   - Check EmailIt dashboard for sending domain status

### Common Error Messages

- **"EmailIt API key not configured"**: `EMAILIT_API_KEY` not set or missing
- **"Email not configured"**: `MAIL_FROM` or `MAIL_TO` not set
- **"D1 database not available"**: `DB` binding not configured
- **"Email failed"** or **"EmailIt API error"**: 
  - Domain not verified as sending domain in EmailIt
  - Invalid API key
  - API rate limit exceeded
  - Check Pages logs for specific error details
- **"D1 insert failed"**: Database permissions or binding issue

## Quick Setup Checklist

- [ ] Set `EMAILIT_API_KEY` as a secret (get from EmailIt dashboard)
- [ ] Set `MAIL_FROM` environment variable (must match verified sending domain)
- [ ] Set `MAIL_TO` environment variable
- [ ] Set `TURNSTILE_SECRET` as a secret
- [ ] Set `VITE_TURNSTILE_SITEKEY` (for build)
- [ ] Verify D1 database binding `DB` exists
- [ ] Create and verify sending domain in EmailIt dashboard
- [ ] Add required DNS records for EmailIt domain verification
- [ ] Test form submission
- [ ] Check D1 database for entries
- [ ] Verify email delivery

