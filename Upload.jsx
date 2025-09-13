import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload as UploadIcon, X, Plus, Image as ImageIcon, ChevronDown, Video, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '../src/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { aiService } from '../src/services/aiService';
import { videoGenerationService } from '../src/services/videoGenerationService';

export default function Upload() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    materials: '',
    dimensions: '',
    weight: '',
    location: ''
  });
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [generatedVideo, setGeneratedVideo] = useState(null);
  const [showVideoPreview, setShowVideoPreview] = useState(false);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Show loading if user is not loaded yet
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const categories = [
    { value: 'pottery', label: 'Pottery & Ceramics' },
    { value: 'textiles', label: 'Textiles & Fabrics' },
    { value: 'paintings', label: 'Paintings & Art' },
    { value: 'jewelry', label: 'Jewelry & Accessories' },
    { value: 'woodwork', label: 'Woodwork & Carving' },
    { value: 'metalwork', label: 'Metalwork & Smithing' },
    { value: 'leather', label: 'Leather Goods' },
    { value: 'other', label: 'Other Crafts' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Date.now() + Math.random()
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    
    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Product data:', formData);
      console.log('Images:', images);
      
      // Generate AI video if requested
      if (generatedVideo) {
        console.log('Generated video:', generatedVideo);
      }
      
      setIsUploading(false);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        category: '',
        price: '',
        materials: '',
        dimensions: '',
        weight: '',
        location: ''
      });
      setImages([]);
      setGeneratedVideo(null);
      setVideoProgress(0);
      
      // Navigate to marketplace
      navigate('/marketplace');
    } catch (error) {
      console.error('Upload failed:', error);
      setIsUploading(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!formData.name || !formData.description || !formData.category) {
      alert('Please fill in the product name, description, and category before generating a video.');
      return;
    }

    setIsGeneratingVideo(true);
    setVideoProgress(0);
    
    try {
      // Initialize video generation service
      videoGenerationService.initialize(aiService);
      
      // Prepare product data for video generation
      const productData = {
        ...formData,
        artisan_name: user.name || 'Artisan',
        id: `temp-${Date.now()}`,
        images: images.map(img => ({ url: img.preview }))
      };
      
      // Generate video with progress updates
      const result = await videoGenerationService.generateProductVideo(
        productData,
        (progress, message) => {
          setVideoProgress(progress);
          console.log(`Video generation progress: ${progress}% - ${message}`);
        }
      );
      
      setGeneratedVideo(result);
      setShowVideoPreview(true);
    } catch (error) {
      console.error('Video generation failed:', error);
      alert('Failed to generate video. Please try again.');
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            List Your <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Handcrafted Item</span>
          </h1>
          <p className="text-lg text-gray-600">
            Share your unique creations with the world and connect with art lovers everywhere.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Product Images */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Product Images *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.preview}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {images.length < 8 && (
                  <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 transition-colors">
                    <UploadIcon className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Add Image</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Upload up to 8 high-quality images. First image will be the main display image.
              </p>
            </div>

            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category *
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white text-left focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <span className={formData.category ? 'text-gray-900' : 'text-gray-500'}>
                      {formData.category 
                        ? categories.find(cat => cat.value === formData.category)?.label 
                        : 'Select category'
                      }
                    </span>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {categories.map((category) => (
                        <button
                          key={category.value}
                          type="button"
                          onClick={() => {
                            handleInputChange('category', category.value);
                            setIsDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-orange-50 hover:text-orange-600 focus:outline-none focus:bg-orange-50 focus:text-orange-600"
                        >
                          {category.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your product, its story, and what makes it special..."
                rows={4}
                required
              />
            </div>

            {/* Pricing */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price ($) *
                </label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>
                <Input
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* Technical Details */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Materials
                </label>
                <Input
                  value={formData.materials}
                  onChange={(e) => handleInputChange('materials', e.target.value)}
                  placeholder="e.g., Oak wood, brass hardware"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Dimensions
                </label>
                <Input
                  value={formData.dimensions}
                  onChange={(e) => handleInputChange('dimensions', e.target.value)}
                  placeholder="e.g., 12&quot; H x 8&quot; W x 8&quot; D"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Weight
                </label>
                <Input
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  placeholder="e.g., 2.5 lbs"
                />
              </div>
            </div>

            {/* AI Video Generation */}
            <div className="pt-6 border-t">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Sparkles className="h-5 w-5 text-purple-500 mr-2" />
                  AI-Powered Product Video
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Generate an engaging video showcasing your product's creation process using AI. This will help customers understand the craftsmanship behind your work.
                </p>
                
                {!generatedVideo && !isGeneratingVideo && (
                  <Button
                    type="button"
                    onClick={handleGenerateVideo}
                    disabled={!formData.name || !formData.description || !formData.category}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-2 px-6 rounded-full"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Generate AI Video
                  </Button>
                )}

                {isGeneratingVideo && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500 mr-2"></div>
                      <span className="text-purple-700 font-medium">Generating video...</span>
                    </div>
                    <div className="w-full bg-purple-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${videoProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-purple-600 text-sm mt-2">{videoProgress}% complete</p>
                  </div>
                )}

                {generatedVideo && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <Video className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-green-700 font-medium">Video Generated Successfully!</span>
                      </div>
                      <Button
                        type="button"
                        onClick={() => setShowVideoPreview(!showVideoPreview)}
                        variant="outline"
                        size="sm"
                        className="text-green-600 border-green-300 hover:bg-green-50"
                      >
                        {showVideoPreview ? 'Hide' : 'Preview'}
                      </Button>
                    </div>
                    
                    {showVideoPreview && (
                      <div className="space-y-3">
                        <video
                          controls
                          className="w-full rounded-lg"
                          poster={generatedVideo.video.thumbnailUrl}
                        >
                          <source src={generatedVideo.video.formats.mp4} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                        <div className="text-sm text-green-600">
                          <p><strong>Duration:</strong> {generatedVideo.video.metadata.duration}</p>
                          <p><strong>Title:</strong> {generatedVideo.video.metadata.title}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t">
              <Button
                type="submit"
                disabled={isUploading || !formData.name || !formData.description || !formData.category || !formData.price}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3"
              >
                {isUploading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </div>
                ) : (
                  'List Your Product'
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
