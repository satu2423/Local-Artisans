# AI Services Setup Guide

This guide explains how to set up AI services for the Local Artisans Place marketplace using **Google Gemini API** (FREE!).

## Features Implemented

### 1. Category and Price Range Filters ✅
- **Location**: Marketplace page already has comprehensive filtering
- **Categories**: Pottery, Textiles, Paintings, Jewelry, Woodwork, Metalwork, Leather, Other
- **Price Ranges**: Under $25, $25-$50, $50-$100, $100+
- **Search**: By product name, artisan name, or location

### 2. AI Video Generation for Product Uploads ✅
- **Location**: Upload page with AI video generation section
- **Features**:
  - Generates video script based on product details using Gemini
  - Creates engaging 60-90 second videos
  - Shows making process and artisan story
  - Progress tracking during generation
  - Video preview with controls

### 3. AI-Generated Sample Marketplace Data ✅
- **Location**: Marketplace with AI data toggle
- **Features**:
  - Toggle between regular and AI-generated data
  - Generates diverse, realistic products using Gemini
  - Includes artisan stories and detailed descriptions
  - Covers all categories and price ranges

## Required API Keys

### Google Gemini API Key (FREE!)
To enable AI features, you need a Google Gemini API key:

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key
5. Add it to your environment variables

**Benefits of Gemini:**
- ✅ **FREE** for most use cases
- ✅ High-quality text generation
- ✅ Fast response times
- ✅ No credit card required
- ✅ Generous free tier limits

### Environment Variables
Add these to your `.env` file:

```env
# Google Gemini API Configuration (FREE!)
VITE_GEMINI_API_KEY=your-gemini-api-key-here

# Existing variables
VITE_GOOGLE_CLIENT_ID=895087918866-t9052h3pusqen11ri1eh0csqfa4bc9qe.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
VITE_API_URL=http://localhost:5000
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
PORT=5000
```

## How to Use

### 1. Enable AI Sample Data
1. Go to the Marketplace page
2. Click the "Enable AI Data" button in the top-right corner
3. Wait for AI-generated products to load
4. Toggle back to regular data anytime

### 2. Generate Product Videos
1. Go to the Upload page
2. Fill in product details (name, description, category)
3. Click "Generate AI Video" button
4. Wait for video generation (shows progress)
5. Preview the generated video
6. Submit your product with the video

### 3. Filter Products
1. Use the search bar to find specific products
2. Select category from dropdown
3. Choose price range
4. Filters work with both regular and AI data

## AI Service Features

### Video Generation
- **Script Creation**: AI generates compelling video scripts
- **Content**: Includes artisan introduction, making process, final showcase
- **Duration**: 60-90 seconds optimized for engagement
- **Fallback**: Works offline with pre-written templates

### Sample Data Generation
- **Diversity**: Covers all categories and price ranges
- **Realism**: Includes authentic artisan names and locations
- **Details**: Rich descriptions, materials, dimensions
- **Fallback**: Uses curated mock data if AI unavailable

### Image Generation
- **Product Photos**: AI-generated product images
- **Multiple Angles**: Main shot, detail shot, lifestyle shot
- **Quality**: High-resolution, professional e-commerce style
- **Fallback**: Uses Unsplash images if AI unavailable

## Technical Implementation

### Services Created
1. **`src/services/aiService.js`**: Core AI functionality
2. **`src/services/videoGenerationService.js`**: Video generation pipeline
3. **Updated Product entity**: AI data integration
4. **Enhanced Upload page**: Video generation UI
5. **Enhanced Marketplace**: AI data toggle

### API Integration
- **Google Gemini 1.5 Flash**: For script and content generation (FREE!)
- **Image Generation**: Uses Gemini for descriptions + fallback images
- **Fallback Systems**: Graceful degradation when APIs unavailable

## Cost Considerations

### Google Gemini API Costs (FREE!)
- **Gemini 1.5 Flash**: **FREE** for most use cases
- **Free Tier Limits**:
  - 15 requests per minute
  - 1 million tokens per day
  - No credit card required
- **Typical Usage** (All FREE):
  - Video script: $0.00
  - Product descriptions: $0.00
  - Sample data generation: $0.00

### Why Gemini is Perfect for This Project
1. **Completely FREE** for development and small-scale production
2. **High-quality output** comparable to paid services
3. **Fast response times** for better user experience
4. **No billing setup** required
5. **Generous limits** for most applications

### Optimization Tips
1. Use fallback data when possible
2. Cache generated content
3. Monitor API usage (though it's free!)
4. Implement rate limiting for production

## Troubleshooting

### Common Issues
1. **API Key Not Working**: Check environment variables and Gemini API key
2. **Video Generation Fails**: Check network connection and API key
3. **AI Data Not Loading**: Verify Gemini API key and free tier limits
4. **Slow Generation**: Normal for AI services, shows progress
5. **Rate Limiting**: Gemini has 15 requests/minute limit (usually not an issue)

### Fallback Behavior
- All AI features have fallback systems
- App works without API keys
- Graceful error handling
- User-friendly error messages

## Future Enhancements

### Potential Improvements
1. **Video Generation Services**: Integrate with RunwayML, D-ID
2. **Real-time Generation**: WebSocket-based progress updates
3. **Custom AI Models**: Fine-tuned models for artisan content
4. **Batch Processing**: Generate multiple videos at once
5. **Analytics**: Track AI generation success rates

### Advanced Features
1. **Voice Generation**: AI-generated narration
2. **Multi-language**: Support for different languages
3. **Style Customization**: Different video styles per category
4. **Integration**: Connect with social media platforms

## Support

For issues with AI services:
1. Check API key configuration
2. Verify internet connection
3. Check OpenAI service status
4. Review browser console for errors
5. Try fallback mode if available
