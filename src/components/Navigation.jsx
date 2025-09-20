import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, ShoppingBag, Upload, MessageCircle, User, LogOut, ShoppingCart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useChat } from '../contexts/ChatContext';
import CartIcon from './CartIcon';
import ChatIcon from './ChatIcon';
import GooeyNav from './GooeyNav';
import Dock from './Dock';

export default function Navigation() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { getTotalUnreadCount } = useChat();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', path: '/', icon: null, requiresAuth: false },
    { name: 'Marketplace', path: '/marketplace', icon: ShoppingBag, requiresAuth: true },
    { name: 'Upload', path: '/upload', icon: Upload, requiresAuth: true },
    { name: 'Assistant', path: '/assistant', icon: MessageCircle, requiresAuth: true },
  ];

  const isActive = (path) => location.pathname === path;

  // Create dock items for authenticated users
  const dockItems = user ? [
    {
      icon: (
        <div className="relative">
          <MessageCircle className="h-5 w-5 text-gray-600 hover:text-orange-500 transition-colors" />
          {getTotalUnreadCount() > 0 && (
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
              {getTotalUnreadCount() > 99 ? '99+' : getTotalUnreadCount()}
            </span>
          )}
        </div>
      ),
      label: 'Chat with Artisans',
      onClick: () => navigate('/chat')
    },
    {
      icon: (
        <div className="relative">
          <ShoppingCart className="h-5 w-5 text-gray-600 hover:text-orange-500 transition-colors" />
          {cart.totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
              {cart.totalItems > 99 ? '99+' : cart.totalItems}
            </span>
          )}
        </div>
      ),
      label: 'Shopping Cart',
      onClick: () => navigate('/cart')
    },
    {
      icon: <LogOut className="h-5 w-5 text-gray-600 hover:text-orange-500 transition-colors" />,
      label: 'Logout',
      onClick: () => logout(navigate)
    }
  ] : [];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LA</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Local Artisans</span>
          </Link>

          {/* Desktop Navigation with GooeyNav */}
          <div className="hidden md:flex items-center">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-full p-1">
              <GooeyNav
                items={navItems
                  .filter(item => !item.requiresAuth || user)
                  .map(item => ({
                    label: item.name,
                    path: item.path
                  }))}
                colors={[1, 2, 3, 1, 2, 3, 1, 4]}
                initialActiveIndex={navItems.findIndex(item => isActive(item.path))}
              />
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <img
                    src={user.picture || 'https://via.placeholder.com/32'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                </div>
                <Dock 
                  items={dockItems}
                  className="dock-custom"
                  magnification={50}
                  baseItemSize={40}
                  panelHeight={40}
                />
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-orange-600 focus:outline-none focus:text-orange-600"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              {navItems.map((item) => {
                // Only show items that don't require auth or if user is authenticated
                if (item.requiresAuth && !user) return null;
                
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive(item.path)
                        ? 'text-orange-600 bg-orange-50'
                        : 'text-gray-700 hover:text-orange-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.icon && <item.icon className="h-5 w-5" />}
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              <div className="pt-4 pb-2 border-t">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 px-3 py-2">
                      <img
                        src={user.picture || 'https://via.placeholder.com/32'}
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-base font-medium text-gray-700">
                        {user.name}
                      </span>
                    </div>
                    <Link
                      to="/chat"
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <ChatIcon />
                      <span>Chat with Artisans</span>
                    </Link>
                    <Link
                      to="/cart"
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <CartIcon />
                      <span>Shopping Cart</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout(navigate);
                        setIsOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsOpen(false)}
                      className="block mt-2 px-3 py-2 rounded-md text-base font-medium bg-orange-500 text-white hover:bg-orange-600"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
