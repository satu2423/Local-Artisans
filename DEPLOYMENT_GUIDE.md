# 🚀 LocalArtisans_Place Deployment Guide

## 🔐 Security First - API Keys Protected

✅ **Your API keys are now secure!** All hardcoded API keys have been removed from the codebase.

## 🌐 Best Deployment Options

### 1. **Vercel (Recommended)**
Perfect for React + Node.js applications with real-time features.

**Pros:**
- ✅ Free tier with generous limits
- ✅ Automatic HTTPS and CDN
- ✅ Easy GitHub integration
- ✅ Built-in environment variable management
- ✅ Supports Socket.io for real-time chat

### 2. **Railway**
Great for full-stack applications with databases.

**Pros:**
- ✅ Excellent for Express.js + React setup
- ✅ Built-in database support
- ✅ Real-time features support
- ✅ Simple deployment process

### 3. **Render**
Good alternative with free tier.

## 📋 Pre-Deployment Checklist

### Step 1: Get Your API Keys
1. **Google OAuth Credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 credentials
   - Get your Client ID and Client Secret

2. **Google Gemini API:**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key

3. **Firebase:**
   - Your Firebase config is already set up in `Firebasesdk.js`
   - No additional setup needed

### Step 2: Environment Variables Setup
Copy `env.template` to `.env` and fill in your values:

```bash
# Copy the template
cp env.template .env

# Edit .env with your actual values
VITE_GOOGLE_CLIENT_ID=your_actual_google_client_id
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret
VITE_GEMINI_API_KEY=your_actual_gemini_api_key
```

## 🚀 Deployment Instructions

### Option 1: Deploy to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables in Vercel Dashboard:**
   - Go to your project settings
   - Add these environment variables:
     - `VITE_GOOGLE_CLIENT_ID`
     - `GOOGLE_CLIENT_SECRET`
     - `VITE_GEMINI_API_KEY`
     - `VITE_API_URL` (set to your Vercel backend URL)

### Option 2: Deploy to Railway

1. **Connect GitHub Repository:**
   - Go to [Railway.app](https://railway.app)
   - Connect your GitHub account
   - Select your repository

2. **Set Environment Variables:**
   - Add all environment variables from your `.env` file

3. **Deploy:**
   - Railway will automatically build and deploy

### Option 3: Deploy to Render

1. **Create New Web Service:**
   - Go to [Render.com](https://render.com)
   - Connect your GitHub repository

2. **Configure Build:**
   - Build Command: `npm run build`
   - Start Command: `npm start`

3. **Set Environment Variables:**
   - Add all environment variables

## 🔧 Post-Deployment Configuration

### Update Google OAuth Settings
1. Go to Google Cloud Console
2. Update authorized redirect URIs:
   - Add your production domain: `https://your-app.vercel.app/auth/google/callback`

### Update CORS Settings
The server is already configured to handle production domains.

## 🎯 Recommended Deployment Flow

1. **Frontend + Backend on Vercel:**
   - Deploy both frontend and backend as Vercel functions
   - Use environment variables for all sensitive data

2. **Database:**
   - Keep using Firebase (already configured)
   - No additional setup needed

3. **Real-time Features:**
   - Socket.io will work on Vercel with proper configuration

## 🛡️ Security Best Practices

✅ **Never commit `.env` files**
✅ **Use environment variables for all API keys**
✅ **Enable HTTPS in production**
✅ **Use strong, unique API keys**
✅ **Regularly rotate API keys**

## 📞 Support

If you encounter any issues:
1. Check the deployment logs
2. Verify environment variables are set correctly
3. Ensure all API keys are valid
4. Check CORS settings for your domain

---

**Your LocalArtisans_Place is ready for deployment! 🎉**
