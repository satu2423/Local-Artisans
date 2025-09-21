import express from 'express';
import axios from 'axios';

const router = express.Router();

// Exchange authorization code for access token and user info
router.post('/exchange-code', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    // Exchange code for access token
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.GOOGLE_CLIENT_ID || 'your_google_client_id_here',
      client_secret: process.env.GOOGLE_CLIENT_SECRET || 'your_google_client_secret_here',
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: 'http://localhost:3000/auth/google/callback' // Must match exactly what's in Google Cloud Console
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

    res.json({ success: true, user: userInfo });
  } catch (error) {
    console.error('Error exchanging code:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to exchange authorization code',
      details: error.response?.data || error.message
    });
  }
});

export default router;
