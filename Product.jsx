import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Share2, Star, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    // Mock data - in a real app, this would fetch from an API
    const mockProduct = {
      id: id,
      name: "Handcrafted Ceramic Vase",
      artisan_name: "Maria Rodriguez",
      location: "Toledo, Spain",
      category: "pottery",
      price: 89.99,
      description: "A beautiful hand-thrown ceramic vase with intricate glazing patterns. Each piece is unique and tells a story of traditional Spanish pottery techniques passed down through generations.",
      images: [
        { url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
        { url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" },
        { url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop" }
      ],
      rating: 4.8,
      reviewCount: 24,
      materials: ["Clay", "Natural Glaze", "Wood Fired"],
      dimensions: "12\" H x 8\" W x 8\" D",
      weight: "2.5 lbs",
      shipping: "Free shipping worldwide",
      returnPolicy: "30-day return policy"
    };
    
    setTimeout(() => {
      setProduct(mockProduct);
      setLoading(false);
    }, 1000);
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
                  src={product.images[selectedImage]?.url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
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
                      src={image.url}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
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
                  <p className="text-gray-600">{product.materials.join(', ')}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Dimensions:</span>
                  <p className="text-gray-600">{product.dimensions}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Weight:</span>
                  <p className="text-gray-600">{product.weight}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Shipping:</span>
                  <p className="text-gray-600">{product.shipping}</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-bold text-gray-900">${product.price}</span>
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
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3">
                  Add to Cart
                </Button>
                <Button variant="outline" className="w-full">
                  Contact Artisan
                </Button>
              </div>
              
              <p className="text-sm text-gray-500 text-center mt-4">
                {product.returnPolicy}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
