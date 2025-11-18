# Fix: Move VITE_TURNSTILE_SITEKEY from Environment Secret to Repository Secret

## The Problem

Your `VITE_TURNSTILE_SITEKEY` is currently set as an **Environment Secret**, but the workflow is trying to access it as a **Repository Secret**.

Environment secrets are only available when a workflow explicitly references an environment. Repository secrets are available to all workflows.

## The Solution

You need to move the secret from Environment Secrets to Repository Secrets:

### Step 1: Copy the Secret Value

1. Go to: https://github.com/kanyunj/eco-volt-site/settings/environments
2. Click on the environment that has `VITE_TURNSTILE_SITEKEY`
3. Find `VITE_TURNSTILE_SITEKEY` in the Environment secrets table
4. Click the pencil icon to edit it
5. Copy the value (you'll need to re-enter it since secrets are hidden)

### Step 2: Add as Repository Secret

1. Go to: https://github.com/kanyunj/eco-volt-site/settings/secrets/actions
2. Click **"New repository secret"**
3. Name: `VITE_TURNSTILE_SITEKEY`
4. Value: Paste the value you copied (or use: `0x4AAAAAACBWpaQI-gMrbI2S` from your Turnstile dashboard)
5. Click **"Add secret"**

### Step 3: Remove from Environment Secrets (Optional)

1. Go back to the environment settings
2. Delete `VITE_TURNSTILE_SITEKEY` from Environment secrets (to avoid confusion)

### Step 4: Verify

1. Go to: https://github.com/kanyunj/eco-volt-site/actions
2. Trigger a new workflow run (or wait for next push)
3. Check the "Build project" step
4. You should see: `✅ VITE_TURNSTILE_SITEKEY is set and will be included in build`

## Your Turnstile Site Key

Based on your Turnstile dashboard, your site key is:
`0x4AAAAAACBWpaQI-gMrbI2S`

Make sure this exact value is set as a **Repository Secret** (not Environment Secret).

