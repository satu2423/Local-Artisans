import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../src/contexts/AuthContext';

// Function to get real user info from Google using the authorization code
const getGoogleUserInfo = async (code) => {
  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: '895087918866-t9052h3pusqen11ri1eh0csqfa4bc9qe.apps.googleusercontent.com',
        client_secret: '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', // Your actual client secret
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:3000/auth/google/callback' // Must match Google Cloud Console
      })
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Token exchange failed:', errorData);
      throw new Error('Failed to exchange authorization code for access token');
    }

    const tokenData = await tokenResponse.json();
    const { access_token } = tokenData;

    // Get user info from Google using the access token
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });

    if (!userResponse.ok) {
      throw new Error('Failed to get user info from Google');
    }

    const googleUserData = await userResponse.json();
    
    // Format user data for our app
    const userInfo = {
      id: googleUserData.id,
      email: googleUserData.email,
      name: googleUserData.name,
      displayName: googleUserData.name,
      given_name: googleUserData.given_name,
      family_name: googleUserData.family_name,
      picture: googleUserData.picture,
      provider: 'google',
      uid: googleUserData.id,
      verified_email: googleUserData.verified_email,
      role: 'customer' // Default role for new users
    };
    
    return userInfo;
  } catch (error) {
    console.error('Error getting user info:', error);
    throw error;
  }
};

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleGoogleCallback } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        
        if (error) {
          console.error('Google OAuth error:', error);
          navigate('/login?error=' + encodeURIComponent(error));
          return;
        }
        
        if (code) {
          // Get user information from Google
          const userInfo = await getGoogleUserInfo(code);
          
          // Use AuthContext to handle the callback properly
          const result = await handleGoogleCallback(userInfo);
          
          if (result.success) {
            // Redirect to marketplace after successful authentication
            navigate('/marketplace');
          } else {
            throw new Error(result.error || 'Authentication failed');
          }
        } else {
          // No code received
          navigate('/login?error=' + encodeURIComponent('No authorization code received'));
        }
      } catch (error) {
        console.error('Callback error:', error);
        navigate('/login?error=' + encodeURIComponent('Failed to authenticate with Google'));
      }
    };

    handleCallback();
  }, [searchParams, navigate, handleGoogleCallback]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Signing you in...</p>
      </div>
    </div>
  );
}
