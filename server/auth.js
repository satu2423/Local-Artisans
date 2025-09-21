import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID || 'your_google_client_id_here';
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret-here';

// Simple redirect URI - matches Google Cloud Console exactly
const getRedirectUri = (req) => {
  const origin = req.get('origin') || req.get('referer')?.split('/').slice(0, 3).join('/');
  console.log('Request origin:', origin);
  
  // Use exact URLs that match Google Cloud Console
  if (origin && origin.includes('vercel.app')) {
    return 'https://localartisans-place.vercel.app/auth/google/callback';
  } else if (origin && origin.includes('localhost:3000')) {
    return 'http://localhost:3000/auth/google/callback';
  }
  
  // Default fallback
  return 'http://localhost:3000/auth/google/callback';
};

// Debug logging
console.log('OAuth Configuration:');
console.log('CLIENT_ID:', CLIENT_ID);
console.log('CLIENT_SECRET:', CLIENT_SECRET ? '***' + CLIENT_SECRET.slice(-4) : 'NOT SET');

router.post('/google', async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Missing code' });

  try {
    const redirectUri = getRedirectUri(req);
    const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, redirectUri);
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // Get user info
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // TODO: Save user info to DB and create session/JWT as needed

    res.json({
      user: {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      },
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    });
  } catch (err) {
    console.error('Google OAuth error:', err);
    res.status(500).json({ error: 'Failed to authenticate with Google' });
  }
});

// Add route to handle the exchange-code endpoint for compatibility
router.post('/google/exchange-code', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    const redirectUri = getRedirectUri(req);
    console.log('Attempting to exchange code for token...');
    console.log('Client ID:', CLIENT_ID);
    console.log('Redirect URI:', redirectUri);

    // Exchange code for access token
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri
    });

    const { access_token } = tokenResponse.data;

    // Get user info from Google
    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    const userInfo = {
      id: userResponse.data.id,
      email: userResponse.data.email,
      name: userResponse.data.name,
      displayName: userResponse.data.name,
      given_name: userResponse.data.given_name,
      family_name: userResponse.data.family_name,
      picture: userResponse.data.picture,
      provider: 'google',
      uid: userResponse.data.id,
      verified_email: userResponse.data.verified_email
    };

    console.log('Successfully authenticated user:', userInfo.email);
    res.json({ success: true, user: userInfo });
  } catch (error) {
    console.error('Error exchanging code:', error.response?.data || error.message);
    
    // Handle specific OAuth errors
    if (error.response?.data?.error === 'invalid_grant') {
      return res.status(400).json({ 
        error: 'Authorization code expired or invalid. Please try logging in again.',
        code: 'INVALID_GRANT'
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to exchange authorization code',
      details: error.response?.data || error.message
    });
  }
});

export default router;