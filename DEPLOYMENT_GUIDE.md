# 🚀 LocalArtisans_Place Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ **1. Get Your API Keys Ready**
- **Google OAuth**: [Google Cloud Console](https://console.cloud.google.com/)
- **Google Gemini AI**: [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Firebase**: Already configured ✅

### ✅ **2. Application Status**
- ✅ API keys secured (no hardcoded values)
- ✅ Environment variables configured
- ✅ Build scripts ready
- ✅ Vercel configuration added

---

## 🌐 **Deployment Options**

### **Option 1: Vercel (Recommended)**

#### **Step 1: Install Vercel CLI**
```bash
npm i -g vercel
```

#### **Step 2: Login to Vercel**
```bash
vercel login
```

#### **Step 3: Deploy**
```bash
vercel --prod
```

#### **Step 4: Set Environment Variables in Vercel Dashboard**
1. Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
2. Go to **Settings** → **Environment Variables**
3. Add these variables:

```bash
# Frontend Environment Variables
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_API_URL=https://your-app-name.vercel.app
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Backend Environment Variables
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=https://your-app-name.vercel.app/auth/google/callback
PORT=5000
```

---

### **Option 2: Railway**

#### **Step 1: Connect GitHub**
1. Go to [Railway.app](https://railway.app)
2. Connect your GitHub account
3. Select your repository

#### **Step 2: Configure Environment Variables**
Add all environment variables in Railway dashboard

#### **Step 3: Deploy**
Railway will automatically build and deploy

---

### **Option 3: Render**

#### **Step 1: Create New Web Service**
1. Go to [Render.com](https://render.com)
2. Connect GitHub repository

#### **Step 2: Configure Build**
- **Build Command**: `npm run build`
- **Start Command**: `npm start`

#### **Step 3: Set Environment Variables**
Add all environment variables in Render dashboard

---

## 🔧 **Post-Deployment Configuration**

### **1. Update Google OAuth Settings**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Edit your OAuth 2.0 Client ID
4. Update **Authorized redirect URIs**:
   ```
   https://your-app-name.vercel.app/auth/google/callback
   ```
5. Update **Authorized JavaScript origins**:
   ```
   https://your-app-name.vercel.app
   ```

### **2. Test Your Deployment**
1. ✅ **Frontend loads correctly**
2. ✅ **Google OAuth works**
3. ✅ **API endpoints respond**
4. ✅ **Socket.io connections work**
5. ✅ **Cart functionality works**

---

## 🎯 **Quick Deploy with Vercel**

### **One-Command Deploy:**
```bash
# Install Vercel CLI
npm i -g vercel

# Login and deploy
vercel login
vercel --prod
```

### **After Deployment:**
1. **Copy your deployment URL** (e.g., `https://localartisans-place.vercel.app`)
2. **Update Google OAuth settings** with your production URL
3. **Set environment variables** in Vercel dashboard
4. **Test all functionality**

---

## 🛡️ **Security Notes**

- ✅ **API keys are secure** - no hardcoded values
- ✅ **Environment variables** are properly configured
- ✅ **HTTPS enabled** automatically
- ✅ **CORS configured** for production domains

---

## 📞 **Support**

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables are set
3. Test Google OAuth configuration
4. Check browser console for errors

**Your LocalArtisans_Place is ready for deployment! 🎉**