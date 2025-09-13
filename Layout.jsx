import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './src/contexts/AuthContext';
import { CartProvider } from './src/contexts/CartContext';
import { ChatProvider } from './src/contexts/ChatContext';
import Navigation from './src/components/Navigation';
import Home from './Pages/Home';
import Marketplace from './Pages/Marketplace';
import Product from './Pages/Product';
import Upload from './Pages/Upload';
import Assistant from './Pages/Assistant';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import GoogleCallback from './Pages/GoogleCallback';
import Cart from './Pages/Cart';
import Chat from './Pages/Chat';

function Layout() {
  return (
    <AuthProvider>
      <CartProvider>
        <ChatProvider>
          <Router
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}
          >
            <div className="min-h-screen bg-gray-50">
              <Navigation />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/product/:id" element={<Product />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/assistant" element={<Assistant />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/chat/:chatId" element={<Chat />} />
                <Route path="/auth/google/callback" element={<GoogleCallback />} />
              </Routes>
            </div>
          </Router>
        </ChatProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default Layout;
