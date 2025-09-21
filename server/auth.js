import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID || 'your_google_client_id_here';
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret-here';
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback';

// Debug logging
console.log('OAuth Configuration:');
console.log('CLIENT_ID:', CLIENT_ID);
console.log('CLIENT_SECRET:', CLIENT_SECRET ? '***' + CLIENT_SECRET.slice(-4) : 'NOT SET');
console.log('REDIRECT_URI:', REDIRECT_URI);

const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

router.post('/google', async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Missing code' });

  try {
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

export default router;