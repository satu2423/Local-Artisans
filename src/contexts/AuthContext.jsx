import React, { createContext, useContext, useState, useEffect } from 'react';
import { getGoogleAuthUrl } from '../config/googleAuth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      // Ensure user has uid and role fields
      if (!userData.uid) {
        userData.uid = userData.id;
      }
      if (!userData.role) {
        userData.role = 'customer'; // Default role
      }
      setUser(userData);
      // Update localStorage with the corrected user data
      localStorage.setItem('user', JSON.stringify(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Mock login - in a real app, this would call your API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        id: '1',
        uid: '1',
        email: email,
        name: 'Demo User',
        picture: 'https://via.placeholder.com/150',
        provider: 'email',
        role: 'customer'
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password, role = 'customer') => {
    setLoading(true);
    try {
      // Mock signup - in a real app, this would call your API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        id: Date.now().toString(),
        uid: Date.now().toString(),
        email: email,
        name: name,
        picture: 'https://via.placeholder.com/150',
        provider: 'email',
        role: role
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      // Redirect to Google OAuth
      window.location.href = getGoogleAuthUrl();
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const handleGoogleCallback = async (userData) => {
    try {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const logout = (navigate) => {
    // Clear user state
    setUser(null);
    localStorage.removeItem('user');
    
    // Clear all other localStorage data
    localStorage.removeItem('cart');
    localStorage.removeItem('chats');
    localStorage.removeItem('chatMessages');
    localStorage.removeItem('artisanChats');
    
    // Clear any other cached data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userPreferences');
    
    // Clear session storage as well
    sessionStorage.clear();
    
    // Force a page reload to clear all contexts and state
    window.location.href = '/';
  };

  const value = {
    user,
    login,
    signup,
    loginWithGoogle,
    handleGoogleCallback,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
