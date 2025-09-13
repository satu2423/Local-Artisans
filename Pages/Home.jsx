import React, { useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Users, Globe, Lock } from 'lucide-react';
import { useAuth } from '../src/contexts/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Handle OAuth callback at root path
  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    
    if (code || error) {
      // Redirect to callback handler
      navigate('/auth/google/callback?' + searchParams.toString());
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 to-amber-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Discover <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Local Artisans</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect with talented craftspeople in your community and discover unique, handcrafted treasures that tell a story.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <>
                  <Link
                    to="/marketplace"
                    className="inline-flex items-center px-8 py-4 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-colors"
                  >
                    Explore Marketplace
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/upload"
                    className="inline-flex items-center px-8 py-4 border-2 border-orange-500 text-orange-500 font-semibold rounded-full hover:bg-orange-50 transition-colors"
                  >
                    Sell Your Crafts
                  </Link>
                  <Link
                    to="/assistant"
                    className="inline-flex items-center px-8 py-4 border-2 border-blue-500 text-blue-500 font-semibold rounded-full hover:bg-blue-50 transition-colors"
                  >
                    AI Assistant
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="inline-flex items-center px-8 py-4 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-colors"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center px-8 py-4 border-2 border-orange-500 text-orange-500 font-semibold rounded-full hover:bg-orange-50 transition-colors"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Local Artisans?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Support local communities while discovering authentic, high-quality handcrafted items.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-center p-6"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Unique Quality</h3>
              <p className="text-gray-600">
                Every piece is one-of-a-kind, crafted with passion and attention to detail.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center p-6"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Support Local</h3>
              <p className="text-gray-600">
                Help sustain local communities and preserve traditional crafting techniques.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-center p-6"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Reach</h3>
              <p className="text-gray-600">
                Discover artisans from around the world while supporting local economies.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {user ? (
              <>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Welcome back, {user.name}!
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  Continue exploring our marketplace and discover amazing handcrafted items.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/marketplace"
                    className="inline-flex items-center px-8 py-4 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-colors"
                  >
                    Browse Marketplace
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/upload"
                    className="inline-flex items-center px-8 py-4 border-2 border-orange-500 text-orange-500 font-semibold rounded-full hover:bg-orange-50 transition-colors"
                  >
                    Upload Your Work
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ready to Start Your Journey?
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  Join our community of artisans and art lovers today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/signup"
                    className="inline-flex items-center px-8 py-4 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-colors"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <div className="flex items-center text-gray-400">
                    <Lock className="h-5 w-5 mr-2" />
                    <span>Sign in to access all features</span>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
