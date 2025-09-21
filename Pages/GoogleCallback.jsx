import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../src/contexts/AuthContext';

// Function to get user info from Google via our backend
const getGoogleUserInfo = async (code) => {
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    // Use our backend to exchange the code for user info
    const response = await fetch(`${API_URL}/api/google/exchange-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Token exchange failed:', errorData);
      throw new Error(errorData.error || 'Failed to exchange authorization code for access token');
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to get user info from Google');
    }

    // Format user data for our app
    const userInfo = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      displayName: data.user.displayName || data.user.name,
      given_name: data.user.given_name,
      family_name: data.user.family_name,
      picture: data.user.picture,
      provider: 'google',
      uid: data.user.uid || data.user.id,
      verified_email: data.user.verified_email,
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
