import React, { useEffect } from "react";
import { handleGoogleCallback } from "@/config/googleAuth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function GoogleCallback() {
  const navigate = useNavigate();
  const { handleGoogleCallback: handleAuthCallback } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const error = urlParams.get("error");
    
    if (error) {
      console.error("OAuth error:", error);
      navigate("/login?error=oauth_error");
      return;
    }
    
    if (code) {
      handleGoogleCallback(code)
        .then((response) => {
          // Handle the response from the backend
          if (response.user) {
            handleAuthCallback(response.user);
            navigate("/marketplace"); // Redirect to marketplace after successful login
          } else {
            throw new Error("No user data received");
          }
        })
        .catch((error) => {
          console.error("Google OAuth error:", error);
          navigate("/login?error=auth_failed");
        });
    } else {
      navigate("/login");
    }
  }, [navigate, handleAuthCallback]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Signing you in...</p>
      </div>
    </div>
  );
}