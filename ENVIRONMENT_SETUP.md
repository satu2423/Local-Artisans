# Environment Setup for Google OAuth

## Required Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=895087918866-t9052h3pusqen11ri1eh0csqfa4bc9qe.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-actual-google-client-secret-here

# Backend API URL
VITE_API_URL=http://localhost:5000
GOOGLE_REDIRECT_URI=http://localhost:3001/auth/google/callback

# Server Configuration
PORT=5000
```

## Getting Your Google Client Secret

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Go to "APIs & Services" → "Credentials"
4. Find your OAuth 2.0 Client ID
5. Click on it to view details
6. Copy the "Client secret" value
7. Replace `your-actual-google-client-secret-here` in the `.env` file

## Running the Application

1. Install dependencies: `npm install`
2. Start the backend server: `npm run server`
3. In a new terminal, start the frontend: `npm run dev`
4. Or run both together: `npm run dev:full`

## Testing Google OAuth

1. Navigate to `http://localhost:3001/login`
2. Click "Continue with Google"
3. You should be redirected to Google's OAuth consent screen
4. After authorization, you'll be redirected back to the app

## Troubleshooting

- **"Invalid client" error**: Check your Client ID and Client Secret
- **"Redirect URI mismatch"**: Ensure the redirect URI in Google Console matches `http://localhost:3001/auth/google/callback`
- **CORS errors**: Make sure both frontend (port 3001) and backend (port 5000) are running
- **Server not starting**: Check if port 5000 is available or change the PORT in `.env`
