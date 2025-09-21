// Google Gemini AI service for generating product stories
// Using Google's Vertex AI/Gemini API

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'your_gemini_api_key_here';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

/**
 * Generate a compelling product story using Google Gemini AI
 * @param {Object} productData - Product information
 * @returns {Promise<string>} - Generated product story
 */
export const generateProductStory = async (productData) => {
  try {
    console.log('Generating product story with Gemini AI for:', productData.name);
    
    const prompt = createStoryPrompt(productData);
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      console.warn(`⚠️ Gemini API error: ${response.status} ${response.statusText} - Using fallback story`);
      return generateFallbackStory(productData);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const story = data.candidates[0].content.parts[0].text;
      console.log('✅ Generated product story with Gemini AI');
      return story;
    } else {
      console.warn('⚠️ No story generated from Gemini AI - Using fallback story');
      return generateFallbackStory(productData);
    }
  } catch (error) {
    console.error('❌ Error generating product story:', error);
    
    // Fallback to a simple generated story
    return generateFallbackStory(productData);
  }
};

/**
 * Create a detailed prompt for Gemini AI to generate product stories
 * @param {Object} productData - Product information
 * @returns {string} - Formatted prompt for AI
 */
const createStoryPrompt = (productData) => {
  return `You are a master storyteller specializing in artisanal crafts. Create a compelling, emotional story about this handcrafted product that will make customers fall in love with it.

Product Details:
- Name: ${productData.name}
- Description: ${productData.description}
- Category: ${productData.category}
- Price: $${productData.price}
- Materials: ${productData.materials || 'Traditional materials'}
- Artisan: ${productData.artisan_name}
- Location: ${productData.location || 'Local artisan workshop'}

Please write a captivating story (2-3 paragraphs) that includes:
1. The artisan's inspiration and creative process
2. The traditional techniques and cultural significance
3. The unique qualities that make this piece special
4. An emotional connection that makes the customer want to own it

Make it warm, authentic, and inspiring. Focus on the human touch, craftsmanship, and the story behind the creation.`;
};

/**
 * Generate a fallback story if Gemini AI fails
 * @param {Object} productData - Product information
 * @returns {string} - Fallback story
 */
const generateFallbackStory = (productData) => {
  const stories = {
    pottery: `Crafted with love and patience, this beautiful ${productData.name} tells a story of tradition and artistry. Each piece is carefully shaped by skilled hands, using techniques passed down through generations. The artisan ${productData.artisan_name} pours their heart into every creation, ensuring that each item is not just functional, but a work of art that brings warmth and character to any space.`,
    
    textiles: `Woven with care and attention to detail, this exquisite ${productData.name} represents the perfect blend of traditional craftsmanship and modern design. The artisan ${productData.artisan_name} carefully selects each thread, creating patterns that tell stories of culture and heritage. Every stitch is placed with intention, resulting in a piece that's both beautiful and meaningful.`,
    
    paintings: `This stunning ${productData.name} captures the artist's vision and emotion in every brushstroke. Created by ${productData.artisan_name}, this piece represents hours of careful observation and artistic expression. The colors and composition work together to create a visual story that will inspire and delight anyone who views it.`,
    
    jewelry: `Handcrafted with precision and passion, this elegant ${productData.name} is more than just an accessory - it's a statement of personal style and artistic vision. The artisan ${productData.artisan_name} carefully selects each component, ensuring that the final piece is both beautiful and meaningful. This jewelry tells a story of craftsmanship and attention to detail.`,
    
    woodwork: `Carved from carefully selected wood, this magnificent ${productData.name} showcases the natural beauty of the material and the skill of the craftsman. ${productData.artisan_name} brings years of experience to each piece, using traditional techniques to create something truly special. The grain patterns and natural variations make each item unique.`,
    
    metalwork: `Forged with skill and determination, this impressive ${productData.name} represents the perfect marriage of strength and beauty. The artisan ${productData.artisan_name} works with fire and metal, transforming raw materials into something extraordinary. Each piece is a testament to the power of human creativity and craftsmanship.`,
    
    leather: `Crafted from premium leather, this exceptional ${productData.name} combines durability with timeless style. The artisan ${productData.artisan_name} carefully cuts, shapes, and finishes each piece, ensuring that it will age beautifully over time. This is more than just an item - it's an investment in quality and craftsmanship.`,
    
    other: `Created with passion and dedication, this unique ${productData.name} represents the artisan's creative vision and technical skill. ${productData.artisan_name} brings their own style and expertise to every piece, ensuring that each creation is truly one-of-a-kind. This item tells a story of creativity, skill, and personal expression.`
  };
  
  return stories[productData.category] || stories.other;
};

/**
 * Generate a short product description for cards
 * @param {Object} productData - Product information
 * @returns {Promise<string>} - Short description
 */
export const generateProductDescription = async (productData) => {
  try {
    const prompt = `Create a short, compelling description (1-2 sentences) for this product: ${productData.name} - ${productData.description}. Category: ${productData.category}. Make it engaging and highlight what makes it special.`;
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 100,
        }
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      }
    }
  } catch (error) {
    console.error('Error generating description:', error);
  }
  
  // Fallback
  return `A beautiful handcrafted ${productData.name} created with care and attention to detail by ${productData.artisan_name}.`;
};

export default {
  generateProductStory,
  generateProductDescription
};
