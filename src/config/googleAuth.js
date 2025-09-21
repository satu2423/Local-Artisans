// Google OAuth Configuration
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your_google_client_id_here';

// Google OAuth Scopes
export const GOOGLE_SCOPES = [
  'openid',
  'email',
  'profile'
].join(' ');

// Get API URL from environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Google OAuth Configuration
export const GOOGLE_CONFIG = {
  client_id: GOOGLE_CLIENT_ID,
  scope: GOOGLE_SCOPES,
  response_type: 'code',
  redirect_uri: 'http://localhost:3000/auth/google/callback', // Must match Google Cloud Console
  access_type: 'offline',
  prompt: 'consent'
};

// Generate Google OAuth URL
export const getGoogleAuthUrl = () => {
  const params = new URLSearchParams(GOOGLE_CONFIG);
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

// Handle Google OAuth callback
export const handleGoogleCallback = async (code) => {
  try {
    const response = await fetch(`${API_URL}/api/google/exchange-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to authenticate with Google');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Google OAuth error:', error);
    throw error;
  }
};

// On login button click
export const handleLogin = () => {
  window.location.href = getGoogleAuthUrl();
};


