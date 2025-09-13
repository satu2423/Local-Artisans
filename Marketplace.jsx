import React, { useState, useEffect, useCallback } from "react";
import Product from "@/entities/Product"; // <-- Use default import if Product is default exported
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Heart, Sparkles, RefreshCw } from "lucide-react"; // <-- Removed unused imports
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuth } from "../src/contexts/AuthContext";

export default function Marketplace() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [isGeneratingAIData, setIsGeneratingAIData] = useState(false);
  const [aiDataEnabled, setAiDataEnabled] = useState(localStorage.getItem('generateAISampleData') === 'true');

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "pottery", label: "Pottery & Ceramics" },
    { value: "textiles", label: "Textiles & Fabrics" },
    { value: "paintings", label: "Paintings & Art" },
    { value: "jewelry", label: "Jewelry & Accessories" },
    { value: "woodwork", label: "Woodwork & Carving" },
    { value: "metalwork", label: "Metalwork & Smithing" },
    { value: "leather", label: "Leather Goods" },
    { value: "other", label: "Other Crafts" }
  ];

  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "0-25", label: "Under $25" },
    { value: "25-50", label: "$25 - $50" },
    { value: "50-100", label: "$50 - $100" },
    { value: "100+", label: "$100+" }
  ];

  const filterProducts = useCallback(() => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.artisan_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Price filter
    if (priceRange !== "all") {
      let min = 0, max = Infinity;
      if (priceRange.endsWith("+")) {
        min = parseFloat(priceRange.replace("+", ""));
        max = Infinity;
      } else {
        [min, max] = priceRange.split("-").map(Number);
      }
      filtered = filtered.filter(product => product.price >= min && product.price <= max);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, priceRange]); // Dependencies for useCallback

  // Show loading if user is not loaded yet
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await Product.list("-created_date");
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [aiDataEnabled]); // Reload when AI data setting changes

  const handleToggleAIData = async () => {
    if (aiDataEnabled) {
      // Disable AI data
      localStorage.setItem('generateAISampleData', 'false');
      setAiDataEnabled(false);
      setLoading(true);
      // Reload products
      const data = await Product.list("-created_date");
      setProducts(data);
      setLoading(false);
    } else {
      // Enable AI data
      setIsGeneratingAIData(true);
      localStorage.setItem('generateAISampleData', 'true');
      setAiDataEnabled(true);
      setLoading(true);
      // Reload products with AI data
      const data = await Product.list("-created_date");
      setProducts(data);
      setLoading(false);
      setIsGeneratingAIData(false);
    }
  };

  useEffect(() => {
    // This effect runs whenever filterProducts itself changes (due to its useCallback dependencies)
    filterProducts();
  }, [filterProducts]); // Dependency on the memoized filterProducts function

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
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Artisan <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Marketplace</span>
              </h1>
              <p className="text-lg text-gray-600">
                Discover authentic handcrafted treasures from talented artisans worldwide
              </p>
            </div>
            
            {/* AI Data Toggle */}
            <div className="mt-4 md:mt-0">
              <Button
                onClick={handleToggleAIData}
                disabled={isGeneratingAIData}
                variant={aiDataEnabled ? "default" : "outline"}
                className={`${aiDataEnabled 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white' 
                  : 'border-purple-300 text-purple-600 hover:bg-purple-50'
                } transition-all duration-200`}
              >
                {isGeneratingAIData ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    {aiDataEnabled ? 'AI Data Enabled' : 'Enable AI Data'}
                  </>
                )}
              </Button>
              {aiDataEnabled && (
                <p className="text-xs text-purple-600 mt-1 text-center">
                  Powered by AI-generated sample data
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by product, artisan, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-full border-gray-300 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
              className="w-full lg:w-auto"
            >
              <SelectTrigger className="rounded-full border-gray-300">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <span className={getCategoryColor(category.value)}>
                      {category.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={priceRange}
              onValueChange={setPriceRange}
              className="w-full lg:w-auto"
            >
              <SelectTrigger className="rounded-full border-gray-300">
                <SelectValue placeholder="Select a price range" />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-10">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                No products found
              </h2>
              <p className="text-gray-600">
                Try adjusting your search or filter options
              </p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <Link
                to={createPageUrl("product", product)}
                key={product.id}
                className="group block rounded-lg overflow-hidden shadow-lg bg-white"
              >
                <div className="relative pb-3/4">
                  <motion.img
                    src={product.images[0]?.url}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                    layoutId={`image-${product.id}`}
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Badge className={`rounded-full text-xs font-semibold py-1 px-3 ${getCategoryColor(product.category)}`}>
                        {product.category}
                      </Badge>
                      <span className="text-gray-500 text-xs">
                        {product.location}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-orange-500 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      By {product.artisan_name}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                      </span>
                      <Button variant="outline" size="sm" className="rounded-full">
                        <Heart className="h-5 w-5 text-gray-400" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Link>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
}
