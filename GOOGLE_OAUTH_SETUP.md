# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for the Local Artisans Place app.

## Prerequisites

- A Google account
- Access to Google Cloud Console

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: "Local Artisans Place"
4. Click "Create"

## Step 2: Enable Google+ API

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google+ API" and enable it
3. Also enable "Google OAuth2 API"

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `http://localhost:3000/auth/google/callback`
   - `http://localhost:3000` (for development)
5. Click "Create"
6. Copy the Client ID

## Step 4: Configure Environment Variables

1. Create a `.env` file in your project root
2. Add your Google Client ID:

```env
VITE_GOOGLE_CLIENT_ID=your-actual-client-id-here
```

## Step 5: Test the Integration

1. Run the development server: `npm run dev`
2. Navigate to `/login`
3. Click "Continue with Google"
4. You should see a mock Google login (for demo purposes)

## Production Setup

For production, you'll need to:

1. Add your production domain to authorized redirect URIs
2. Update the environment variables
3. Implement a proper backend to handle OAuth callbacks
4. Replace the mock authentication with real Google OAuth flow

## Current Implementation

The current implementation uses mock Google authentication for demonstration purposes. To implement real Google OAuth:

1. Replace `mockGoogleAuth()` in `src/config/googleAuth.js` with actual OAuth flow
2. Implement backend endpoints to handle OAuth callbacks
3. Store user sessions securely
4. Add proper error handling

## Troubleshooting

- **"Invalid client" error**: Check your Client ID
- **"Redirect URI mismatch"**: Ensure your redirect URI is exactly as configured
- **CORS errors**: Make sure your domain is authorized in Google Console

## Security Notes

- Never commit your `.env` file to version control
- Use environment variables for all sensitive data
- Implement proper session management
- Add CSRF protection for production use
