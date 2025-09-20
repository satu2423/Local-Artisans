import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Share2, Star, MapPin, User, Sparkles, BookOpen, ShoppingCart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProductEntity from '../src/entities/Product';
import { generateProductStory } from '../src/services/geminiStoryService';
import { getImageDisplayUrl } from '../src/services/imageService';
import CraftingAnimation from '../src/components/CraftingAnimation';
import { useCart } from '../src/contexts/CartContext';
import { useChat } from '../src/contexts/ChatContext';
import { useAuth } from '../src/contexts/AuthContext';

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [aiStory, setAiStory] = useState('');
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [showStory, setShowStory] = useState(false);
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { startChat } = useChat();
  const { user } = useAuth();

  const handleContactArtisan = () => {
    if (!user) {
      alert('Please log in to contact artisans');
      return;
    }

    const artisanData = {
      artisanId: product.artisan_id,
      artisanName: product.artisan_name,
      artisanImage: user.picture // Using user's image as placeholder
    };

    const productData = {
      id: product.id,
      name: product.name,
      images: product.images
    };

    const chatId = startChat(artisanData, productData);
    // Navigate to chat using React Router
    navigate(`/chat/${chatId}`);
  };

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const productData = await ProductEntity.getById(id);
        if (productData) {
          setProduct(productData);
          // Automatically generate AI story when product loads
          try {
            const story = await generateProductStory(productData);
            setAiStory(story);
            setShowStory(true);
          } catch (error) {
            console.warn('Story generation failed, using fallback:', error.message);
            // The service now handles fallbacks internally, so this shouldn't happen
            // But just in case, we'll set a basic story
            setAiStory(`This beautiful ${productData.name} was crafted with care and attention to detail by ${productData.artisan_name}. Each piece tells a story of traditional craftsmanship and artistic vision.`);
            setShowStory(true);
          }
        }
      } catch (error) {
        console.error('Failed to load product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  const getCategoryColor = (category) => {
    const colors = {
      pottery: "bg-orange-100 text-orange-800",
      textiles: "bg-purple-100 text-purple-800",
      paintings: "bg-blue-100 text-blue-800",
      jewelry: "bg-pink-100 text-pink-800",
      woodwork: "bg-green-100 text-green-800",
      metalwork: "bg-gray-100 text-gray-800",
      leather: "bg-amber-100 text-amber-800",
      other: "bg-slate-100 text-slate-800"
    };
    return colors[category] || colors.other;
  };

  const handleGenerateStory = async () => {
    if (!product) return;
    
    setIsGeneratingStory(true);
    try {
      const story = await generateProductStory(product);
      setAiStory(story);
      setShowStory(true);
    } catch (error) {
      console.error('Failed to generate story:', error);
      alert('Failed to generate story. Please try again.');
    } finally {
      setIsGeneratingStory(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-32"></div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded-xl"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Product not found</h2>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <Link to="/marketplace" className="text-orange-500 hover:text-orange-600">
            Return to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            to="/marketplace"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="space-y-4">
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={getImageDisplayUrl(
                    product.images && product.images.length > 0 ? product.images[selectedImage] : null,
                    product.name
                  )}
                  alt={product.images && product.images.length > 0 && product.images[selectedImage]?.alt 
                    ? product.images[selectedImage].alt 
                    : `${product.name} - Product Image`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = getImageDisplayUrl(null, product.name);
                  }}
                />
              </div>
              {product.images && product.images.length > 0 && (
                <div className="flex space-x-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden ${
                        selectedImage === index ? 'ring-2 ring-orange-500' : ''
                      }`}
                    >
                      <img
                        src={getImageDisplayUrl(image, product.name)}
                        alt={image.alt || `${product.name} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = getImageDisplayUrl(null, product.name);
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
              
              {/* Generated Video Section */}
              {product.hasVideo && product.video && (
                <div className="mt-4">
                  <div className="flex items-center mb-3">
                    <Sparkles className="h-5 w-5 text-purple-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">AI-Generated Product Video</h3>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                    <video
                      controls
                      className="w-full rounded-lg shadow-lg"
                      poster={product.video.thumbnailUrl}
                    >
                      <source src={product.video.formats?.mp4} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    {product.video.metadata && (
                      <div className="mt-3 text-sm text-gray-600">
                        <p><strong>Duration:</strong> {product.video.metadata.duration}</p>
                        <p><strong>Title:</strong> {product.video.metadata.title}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Crafting Animation Section */}
              <div className="mt-6">
                <CraftingAnimation 
                  productData={product}
                  onAnimationComplete={() => console.log('Crafting animation completed')}
                />
              </div>
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`rounded-full text-xs font-semibold py-1 px-3 ${getCategoryColor(product.category)}`}>
                  {product.category}
                </Badge>
                <span className="text-gray-500 text-sm flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {product.location}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
              <p className="text-lg text-gray-600">{product.description}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">By {product.artisan_name}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-gray-700">Materials:</span>
                  <p className="text-gray-600">{product.materials || 'Not specified'}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Dimensions:</span>
                  <p className="text-gray-600">{product.dimensions || 'Not specified'}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Weight:</span>
                  <p className="text-gray-600">{product.weight || 'Not specified'}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Shipping:</span>
                  <p className="text-gray-600">Free shipping worldwide</p>
                </div>
              </div>
            </div>

            {/* AI Generated Story Section */}
            <div className="border-t pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-orange-500" />
                    Product Story
                  </h3>
                  {!showStory && !aiStory && (
                    <div className="flex items-center text-orange-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500 mr-2"></div>
                      <span className="text-sm">Generating story...</span>
                    </div>
                  )}
                  {!showStory && aiStory && (
                    <Button
                      onClick={() => setShowStory(true)}
                      variant="outline"
                      size="sm"
                      className="text-orange-600 border-orange-300 hover:bg-orange-50"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Show Story
                    </Button>
                  )}
                </div>
                
                {showStory && aiStory && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-6 border border-orange-200"
                  >
                    <div className="flex items-center mb-3">
                      <Sparkles className="h-5 w-5 text-orange-500 mr-2" />
                      <span className="text-sm font-medium text-orange-700">AI Generated Story</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {aiStory}
                    </p>
                    <div className="mt-4 pt-4 border-t border-orange-200">
                      <Button
                        onClick={() => setShowStory(false)}
                        variant="outline"
                        size="sm"
                        className="text-orange-600 border-orange-300 hover:bg-orange-50"
                      >
                        Hide Story
                      </Button>
                    </div>
                  </motion.div>
                )}
                
                {!showStory && !aiStory && (
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
                    <p className="text-gray-600 text-sm">
                      AI is creating a compelling story about this product's craftsmanship...
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFavorited(!isFavorited)}
                    className={isFavorited ? 'text-red-500 border-red-500' : ''}
                  >
                    <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button
                  onClick={() => addToCart(product)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg font-semibold"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {isInCart(product.id) ? `Add Another (${getItemQuantity(product.id)} in cart)` : 'Add to Cart'}
                </Button>
                {isInCart(product.id) && (
                  <p className="text-sm text-green-600 text-center">
                    ✓ This item is in your cart
                  </p>
                )}
                <Button 
                  onClick={handleContactArtisan}
                  variant="outline" 
                  className="w-full"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Artisan
                </Button>
              </div>
              
              <p className="text-sm text-gray-500 text-center mt-4">
                30-day return policy
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
