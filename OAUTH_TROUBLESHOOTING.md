# 🚨 OAuth Troubleshooting Guide

## Current Problem
You're getting `Error 400: redirect_uri_mismatch` both locally and online, even after updating Google Cloud Console.

## 🔍 Debug Steps

### Step 1: Use the Debug Tool
1. Open `debug-oauth.html` in your browser
2. Click "Test OAuth URL" to see exactly what URLs your app is generating
3. Compare these with what you have in Google Cloud Console

### Step 2: Verify Google Cloud Console Settings

**Go to**: https://console.cloud.google.com/apis/credentials

**Find your OAuth Client ID**: `895087918866-t9052h3pusqen11ri1eh0csqfa4bc9qe.apps.googleusercontent.com`

**Make sure you have EXACTLY these URLs:**

#### Authorized JavaScript origins:
```
http://localhost:3000
https://localartisans-place.vercel.app
```

#### Authorized redirect URIs:
```
http://localhost:3000/auth/google/callback
https://localartisans-place.vercel.app/auth/google/callback
```

### Step 3: Common Issues

#### Issue 1: Trailing Slash
❌ Wrong: `http://localhost:3000/`
✅ Correct: `http://localhost:3000`

#### Issue 2: HTTPS vs HTTP
❌ Wrong: `https://localhost:3000` (localhost should be HTTP)
✅ Correct: `http://localhost:3000`

#### Issue 3: Wrong Domain
❌ Wrong: `https://localartisans-place-xyz.vercel.app` (random subdomain)
✅ Correct: `https://localartisans-place.vercel.app`

#### Issue 4: Missing Protocol
❌ Wrong: `localhost:3000`
✅ Correct: `http://localhost:3000`

### Step 4: Clear Browser Cache
1. Clear cookies for localhost and your production domain
2. Try in incognito/private mode
3. Wait 5-10 minutes after updating Google Cloud Console

### Step 5: Test Both Environments

#### Local Test:
1. Go to: `http://localhost:3000`
2. Open browser developer tools (F12)
3. Go to Network tab
4. Click "Login with Google"
5. Check what redirect_uri is being sent in the request

#### Production Test:
1. Go to: `https://localartisans-place.vercel.app`
2. Open browser developer tools (F12)
3. Go to Network tab
4. Click "Login with Google"
5. Check what redirect_uri is being sent in the request

## 🎯 Expected URLs

### For Local Development:
- **Origin**: `http://localhost:3000`
- **Redirect URI**: `http://localhost:3000/auth/google/callback`

### For Production:
- **Origin**: `https://localartisans-place.vercel.app`
- **Redirect URI**: `https://localartisans-place.vercel.app/auth/google/callback`

## 🔧 If Still Not Working

1. **Double-check Google Cloud Console**: Make sure URLs match EXACTLY
2. **Wait longer**: Google changes can take up to 15 minutes
3. **Try different browser**: Test in Chrome, Firefox, Edge
4. **Check for typos**: URLs must be exact matches
5. **Verify project**: Make sure you're editing the correct OAuth client

## 📞 Quick Fix Checklist

- [ ] Google Cloud Console updated with exact URLs
- [ ] No trailing slashes in URLs
- [ ] Correct protocol (http for localhost, https for production)
- [ ] Browser cache cleared
- [ ] Waited 10+ minutes after Google Console update
- [ ] Tested in incognito mode
- [ ] Checked browser developer tools for actual URLs being sent

## 🎉 Success Indicators

When working correctly, you should see:
- Google login page loads without errors
- After login, you're redirected back to your app
- No `redirect_uri_mismatch` errors in console
- User successfully authenticated
