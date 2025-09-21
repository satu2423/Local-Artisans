# 🚨 URGENT: Fix Google OAuth Errors

## Current Problem
You're getting these errors in your terminal:
- `Error exchanging code: { error: 'invalid_grant', error_description: 'Bad Request' }`
- `Error exchanging code: { error: 'redirect_uri_mismatch', error_description: 'Bad Request' }`

## Root Cause
Your Google Cloud Console OAuth settings don't include the correct redirect URIs.

## IMMEDIATE FIX REQUIRED

### Step 1: Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/apis/credentials
2. Find your OAuth 2.0 Client ID: `895087918866-t9052h3pusqen11ri1eh0csqfa4bc9qe.apps.googleusercontent.com`
3. Click the **pencil icon** to edit it

### Step 2: Update Authorized JavaScript origins
Add these EXACT URLs:
```
http://localhost:3000
https://localartisans-place.vercel.app
```

### Step 3: Update Authorized redirect URIs
Add these EXACT URLs:
```
http://localhost:3000/auth/google/callback
https://localartisans-place.vercel.app/auth/google/callback
```

### Step 4: Save Changes
Click **"Save"** at the bottom

### Step 5: Wait 5-10 minutes
Google OAuth changes can take a few minutes to propagate.

## Test After Update

### Local Development:
1. Visit: http://localhost:3000
2. Try Google login
3. Should work without errors

### Production:
1. Visit: https://localartisans-place.vercel.app
2. Try Google login
3. Should work without errors

## Current Status
- ✅ **App Deployed**: https://localartisans-place.vercel.app
- ✅ **Local Environment**: Configured correctly
- ✅ **Servers Running**: Both frontend and backend
- ❌ **Google OAuth**: Needs Console settings update

## Why This Happens
The `invalid_grant` error occurs when:
1. The redirect URI doesn't match what's configured in Google Cloud Console
2. The authorization code has expired or been used already
3. The client ID/secret don't match

The `redirect_uri_mismatch` error occurs when:
1. The redirect URI in your request doesn't exactly match what's in Google Cloud Console
2. Missing or incorrect URLs in the authorized redirect URIs list

## After Fixing
Once you update the Google Cloud Console settings, the OAuth errors should disappear and Google login will work properly on both local and production environments.
