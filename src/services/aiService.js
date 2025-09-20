// AI Service for generating product videos and sample data using Google Gemini
export class AIService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'your-gemini-api-key';
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
    this.model = 'gemini-1.5-flash'; // Using the free tier model
  }

  // Generate product video script based on product details
  async generateVideoScript(productData) {
    try {
      const prompt = `Create a compelling video script for a handcrafted product. The script should be engaging, educational, and showcase the artisan's skill and story.

Product Details:
- Name: ${productData.name}
- Category: ${productData.category}
- Description: ${productData.description}
- Materials: ${productData.materials || 'Not specified'}
- Artisan: ${productData.artisan_name}
- Location: ${productData.location}

Create a 60-90 second video script that includes:
1. Introduction to the artisan and their craft
2. The making process (step-by-step)
3. The final product showcase
4. The story behind the creation

Format the response as a structured script with timestamps and narration.`;

      const response = await fetch(`${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a creative video script writer specializing in artisan and craft content. Create engaging, educational scripts that tell compelling stories.

${prompt}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
            topP: 0.8,
            topK: 10
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate video script');
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error generating video script:', error);
      // Return a fallback script if API fails
      return this.getFallbackVideoScript(productData);
    }
  }

  // Generate product images using AI (Note: Gemini doesn't have image generation, using fallback)
  async generateProductImages(productData, count = 3) {
    try {
      // Gemini doesn't have image generation capabilities yet
      // Using a creative approach with Gemini to generate image descriptions
      // and then using those descriptions with a free image service
      
      const prompt = `Generate detailed descriptions for ${count} professional product photography images for a handcrafted ${productData.category} item.

Product: ${productData.name} - ${productData.description}
Materials: ${productData.materials || 'traditional materials'}

Create ${count} different image descriptions for:
1. Main product shot with clean background
2. Detail shot showing craftsmanship  
3. Lifestyle/context shot showing the product in use

Each description should be detailed enough for an AI image generator, focusing on:
- Professional e-commerce photography style
- Natural lighting and clean composition
- Artisan craft aesthetic
- Specific visual elements and composition

Format as a numbered list with detailed descriptions.`;

      const response = await fetch(`${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`, {
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
            temperature: 0.8,
            maxOutputTokens: 800,
            topP: 0.9,
            topK: 20
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate image descriptions');
      }

      const data = await response.json();
      const descriptions = data.candidates[0].content.parts[0].text;
      
      // For now, return fallback images with the generated descriptions
      // In a real implementation, you could use these descriptions with other image generation services
      console.log('Generated image descriptions:', descriptions);
      
      return this.getFallbackImages(productData, count);
    } catch (error) {
      console.error('Error generating images:', error);
      // Return fallback images
      return this.getFallbackImages(productData, count);
    }
  }

  // Generate sample marketplace data
  async generateSampleProducts(count = 10) {
    try {
      const prompt = `Generate ${count} diverse, realistic handcrafted products for an artisan marketplace. 
      Each product should have:
      - Unique name and description
      - Realistic artisan name and location
      - Appropriate category (pottery, textiles, paintings, jewelry, woodwork, metalwork, leather, other)
      - Realistic price ($25-$300)
      - Materials and dimensions
      - Brief artisan story
      
      Make them diverse in categories, locations, and price ranges. Include both traditional and contemporary styles.
      
      Format the response as a JSON array of objects with these exact fields:
      - id (string)
      - name (string)
      - artisan_name (string)
      - location (string)
      - category (string)
      - price (number)
      - description (string)
      - materials (string)
      - dimensions (string)
      - rating (number between 4.0-5.0)
      - reviewCount (number between 10-50)
      - created_date (ISO string)`;

      const response = await fetch(`${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a creative product catalog generator for an artisan marketplace. Create diverse, realistic, and appealing handcrafted products.

${prompt}`
            }]
          }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 2000,
            topP: 0.9,
            topK: 20
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate sample products');
      }

      const data = await response.json();
      const generatedText = data.candidates[0].content.parts[0].text;
      
      // Parse the generated text into structured product data
      return this.parseGeneratedProducts(generatedText);
    } catch (error) {
      console.error('Error generating sample products:', error);
      return this.getFallbackSampleProducts(count);
    }
  }

  // Fallback methods when AI services are unavailable
  getFallbackVideoScript(productData) {
    return `[0:00-0:15] Introduction
"Meet ${productData.artisan_name}, a skilled artisan from ${productData.location} who has dedicated their life to the ancient craft of ${productData.category}."

[0:15-0:45] Making Process
"Watch as ${productData.artisan_name} carefully selects the finest materials and begins the meticulous process of creating this ${productData.name}. Each step is performed with precision and passion, passed down through generations."

[0:45-1:15] Final Showcase
"The result is a stunning piece that embodies both traditional techniques and contemporary beauty. This ${productData.name} is more than just an object - it's a story, a connection to the artisan's heritage and skill."

[1:15-1:30] Conclusion
"Bring home a piece of authentic craftsmanship. Each item is unique, made with love and attention to detail that only comes from true mastery of the craft."`;
  }

  getFallbackImages(productData, count) {
    const fallbackImages = [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
    ];
    
    return fallbackImages.slice(0, count).map(url => ({
      url,
      alt: `${productData.name} - Product Image`
    }));
  }

  getFallbackSampleProducts(count) {
    const categories = ['pottery', 'textiles', 'paintings', 'jewelry', 'woodwork', 'metalwork', 'leather', 'other'];
    const locations = ['Tokyo, Japan', 'Florence, Italy', 'Marrakech, Morocco', 'Santa Fe, USA', 'Delhi, India', 'Barcelona, Spain'];
    const artisans = ['Maria Santos', 'Ahmed Hassan', 'Yuki Nakamura', 'Giuseppe Rossi', 'Priya Sharma', 'Erik Johansson'];
    
    return Array.from({ length: count }, (_, i) => ({
      id: `sample-${i + 1}`,
      name: `Handcrafted ${categories[i % categories.length]} Item ${i + 1}`,
      artisan_name: artisans[i % artisans.length],
      location: locations[i % locations.length],
      category: categories[i % categories.length],
      price: Math.floor(Math.random() * 275) + 25,
      description: `A beautiful handcrafted ${categories[i % categories.length]} piece made with traditional techniques and modern sensibility.`,
      materials: 'Traditional materials, hand-selected for quality',
      dimensions: 'Various sizes available',
      images: this.getFallbackImages({ name: `Sample Product ${i + 1}` }, 1),
      rating: 4.5 + Math.random() * 0.5,
      reviewCount: Math.floor(Math.random() * 50) + 10,
      created_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    }));
  }

  parseGeneratedProducts(text) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const products = JSON.parse(jsonMatch[0]);
        
        // Add required fields and images
        return products.map((product, index) => ({
          ...product,
          id: product.id || `ai-generated-${index + 1}`,
          images: this.getFallbackImages({ name: product.name }, 1),
          created_date: product.created_date || new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        }));
      }
      
      // If no JSON found, return fallback data
      return this.getFallbackSampleProducts(10);
    } catch (error) {
      console.error('Error parsing generated products:', error);
      return this.getFallbackSampleProducts(10);
    }
  }

  // Get real product data from the marketplace
  async getRealProductData() {
    try {
      // Import the Product class dynamically to avoid circular dependencies
      const { default: Product } = await import('../entities/Product.js');
      const products = await Product.list('created_at');
      
      // Return a limited set of products for the AI context (first 10)
      return products.slice(0, 10).map(product => ({
        name: product.name,
        artisan_name: product.artisan_name,
        category: product.category,
        price: product.price,
        description: product.description,
        location: product.location
      }));
    } catch (error) {
      console.error('Error fetching real product data for AI:', error);
      return [];
    }
  }

  // Generate chatbot response for marketplace assistant
  async generateChatbotResponse(userInput, conversationHistory = []) {
    try {
      // Get real product data to provide accurate information
      const realProducts = await this.getRealProductData();
      
      // Enhanced prompt with real product context
      const prompt = `You are "Artie," the friendly and knowledgeable AI assistant for Local Artisans Place, a premium marketplace connecting customers with authentic handcrafted items from skilled artisans worldwide.

PERSONALITY & TONE:
- Warm, enthusiastic, and genuinely passionate about craftsmanship
- Knowledgeable about various art forms and traditional techniques
- Encouraging and supportive of both artisans and customers
- Conversational but informative, like talking to a craft expert friend

YOUR EXPERTISE:
- Traditional and contemporary crafting techniques
- Artisan stories and cultural heritage
- Product recommendations and styling advice
- Marketplace navigation and features
- Quality assessment and material knowledge

REAL PRODUCT DATA FROM OUR MARKETPLACE:
${realProducts.length > 0 ? realProducts.map(product => 
  `- ${product.name} by ${product.artisan_name} (${product.category}) - ₹${product.price} - ${product.description}`
).join('\n') : 'No products currently available in our marketplace.'}

CONVERSATION CONTEXT:
${conversationHistory.length > 0 ? conversationHistory.slice(-4).map(msg => 
  `${msg.type === 'user' ? 'User' : 'Artie'}: ${msg.content}`
).join('\n') : 'This is the start of our conversation.'}

CURRENT USER QUESTION: "${userInput}"

RESPONSE GUIDELINES:
1. Always acknowledge the user's question with enthusiasm
2. Provide specific, actionable information based on our REAL products
3. Reference actual products from our marketplace when relevant
4. Include specific artisan names and product details when appropriate
5. Encourage exploration of our actual inventory
6. Keep responses between 2-4 sentences for readability
7. End with a helpful follow-up question or suggestion

MARKETPLACE CONTEXT:
- Categories: pottery, ceramics, textiles, paintings, jewelry, woodwork, metalwork, leather goods, glasswork, basketry, and more
- Price range: ₹25-₹500+ (premium pieces can go higher)
- Features: Direct artisan chat, worldwide shipping, authentic certification, artisan stories, custom orders
- Quality: All items are handcrafted, unique, and made with traditional techniques
- Community: Supporting local artisans and preserving cultural heritage

IMPORTANT: Always base your recommendations on the REAL products listed above. If a user asks about specific items, refer to the actual products in our marketplace. If they ask about categories, mention the real artisans and products we have available.

Remember: You're not just answering questions - you're inspiring people to discover the beauty of handcrafted art and connect with the talented artisans who create it.`;

      const response = await fetch(`${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`, {
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
            temperature: 0.8, // Increased for more creative responses
            maxOutputTokens: 600, // Increased for more detailed responses
            topP: 0.9, // Increased for more diverse responses
            topK: 20 // Increased for more variety
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response format from API');
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error generating chatbot response:', error);
      // Return a more intelligent fallback based on the input
      return this.getIntelligentFallback(userInput);
    }
  }

  // Generate artisan-specific response for customer inquiries
  async generateArtisanResponse(prompt) {
    try {
      const response = await fetch(`${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`, {
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
            maxOutputTokens: 400,
            topP: 0.8,
            topK: 20
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response format from API');
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error generating artisan response:', error);
      // Return a fallback response
      return "Thank you for your message! I'm passionate about my craft and would love to answer your questions. Please let me know what specific information you'd like about my work.";
    }
  }

  // Enhanced fallback responses based on user input analysis
  async getIntelligentFallback(userInput) {
    const input = userInput.toLowerCase();
    
    // Get real product data for fallback responses
    const realProducts = await this.getRealProductData();
    const potteryProducts = realProducts.filter(p => p.category === 'pottery');
    const jewelryProducts = realProducts.filter(p => p.category === 'jewelry');
    const woodworkProducts = realProducts.filter(p => p.category === 'woodwork');
    const textileProducts = realProducts.filter(p => p.category === 'textiles');
    
    // Product category queries with real data
    if (input.includes('pottery') || input.includes('ceramic') || input.includes('clay')) {
      if (potteryProducts.length > 0) {
        const product = potteryProducts[0];
        return `I'd love to help you explore our pottery collection! We have amazing pieces like "${product.name}" by ${product.artisan_name} for ₹${product.price}. Our potters use traditional techniques like wheel throwing, hand-building, and various glazing methods. Would you like to see more pottery pieces or learn about specific techniques?`;
      }
      return "I'd love to help you explore our pottery collection! We have incredible artisans creating everything from functional dinnerware to decorative sculptures. Our potters use traditional techniques like wheel throwing, hand-building, and various glazing methods. Would you like to see pieces from a specific region or style?";
    }
    
    if (input.includes('jewelry') || input.includes('necklace') || input.includes('ring') || input.includes('bracelet')) {
      if (jewelryProducts.length > 0) {
        const product = jewelryProducts[0];
        return `Our jewelry collection is absolutely stunning! We have beautiful pieces like "${product.name}" by ${product.artisan_name} for ₹${product.price}. Our artisans work with precious metals, gemstones, and unique materials. From delicate wire work to bold statement pieces, each piece tells a story. Are you looking for something specific - perhaps a particular metal, stone, or style?`;
      }
      return "Our jewelry collection is absolutely stunning! We feature artisans who work with precious metals, gemstones, and unique materials. From delicate wire work to bold statement pieces, each piece tells a story. Are you looking for something specific - perhaps a particular metal, stone, or style?";
    }
    
    if (input.includes('wood') || input.includes('woodwork') || input.includes('furniture') || input.includes('carving')) {
      if (woodworkProducts.length > 0) {
        const product = woodworkProducts[0];
        return `Woodworking is one of our most beloved categories! We have amazing pieces like "${product.name}" by ${product.artisan_name} for ₹${product.price}. Our artisans create everything from functional furniture to intricate carvings using both traditional and modern techniques. Each piece showcases the natural beauty of wood grain and expert craftsmanship. What type of woodwork interests you most?`;
      }
      return "Woodworking is one of our most beloved categories! Our artisans create everything from functional furniture to intricate carvings using both traditional and modern techniques. Each piece showcases the natural beauty of wood grain and expert craftsmanship. What type of woodwork interests you most?";
    }
    
    if (input.includes('textile') || input.includes('fabric') || input.includes('weaving') || input.includes('embroidery')) {
      if (textileProducts.length > 0) {
        const product = textileProducts[0];
        return `Our textile artisans are incredibly talented! We have beautiful pieces like "${product.name}" by ${product.artisan_name} for ₹${product.price}. They create beautiful woven fabrics, embroidered pieces, and traditional clothing using age-old techniques. Each piece reflects cultural heritage and artistic vision. Are you interested in home textiles, clothing, or decorative pieces?`;
      }
      return "Our textile artisans are incredibly talented! They create beautiful woven fabrics, embroidered pieces, and traditional clothing using age-old techniques. Each piece reflects cultural heritage and artistic vision. Are you interested in home textiles, clothing, or decorative pieces?";
    }
    
    // Price and shopping queries
    if (input.includes('price') || input.includes('cost') || input.includes('expensive') || input.includes('budget')) {
      if (realProducts.length > 0) {
        const minPrice = Math.min(...realProducts.map(p => p.price));
        const maxPrice = Math.max(...realProducts.map(p => p.price));
        return `Great question about pricing! Our handcrafted items range from ₹${minPrice} for smaller pieces to ₹${maxPrice}+ for complex, time-intensive works. Prices reflect the artisan's skill, materials used, and time invested. Many artisans also offer payment plans for larger items. What's your budget range?`;
      }
      return "Great question about pricing! Our handcrafted items range from ₹25 for smaller pieces to ₹500+ for complex, time-intensive works. Prices reflect the artisan's skill, materials used, and time invested. Many artisans also offer payment plans for larger items. What's your budget range?";
    }
    
    if (input.includes('shipping') || input.includes('delivery') || input.includes('ship')) {
      return "Most of our artisans offer worldwide shipping with careful packaging to protect your treasures! Shipping costs vary by location and item size, but many offer free shipping on orders over ₹1000. Delivery typically takes 5-14 business days. Would you like me to check shipping options for a specific item?";
    }
    
    // Artisan and craft queries
    if (input.includes('artisan') || input.includes('maker') || input.includes('craftsman') || input.includes('artist')) {
      if (realProducts.length > 0) {
        const uniqueArtisans = [...new Set(realProducts.map(p => p.artisan_name))];
        const artisanList = uniqueArtisans.slice(0, 3).join(', ');
        return `Our artisans are the heart of our marketplace! We have talented creators like ${artisanList}${uniqueArtisans.length > 3 ? ' and more' : ''}. Each one is carefully selected for their skill, authenticity, and commitment to traditional techniques. They come from diverse backgrounds and cultures, bringing unique stories and expertise. Would you like to learn about artisans in a specific craft or region?`;
      }
      return "Our artisans are the heart of our marketplace! Each one is carefully selected for their skill, authenticity, and commitment to traditional techniques. They come from diverse backgrounds and cultures, bringing unique stories and expertise. Would you like to learn about artisans in a specific craft or region?";
    }
    
    if (input.includes('technique') || input.includes('how') || input.includes('made') || input.includes('process')) {
      return "I love talking about crafting techniques! Our artisans use traditional methods passed down through generations, combined with modern innovations. Each craft has its own fascinating process - from pottery wheel throwing to metal forging to textile weaving. Which craft's techniques would you like to learn about?";
    }
    
    // General help and support
    if (input.includes('help') || input.includes('support') || input.includes('assist')) {
      return "I'm here to help you discover amazing handcrafted treasures! I can assist with finding specific products, learning about artisans, understanding pricing, shipping information, or any marketplace questions. What would you like to explore today?";
    }
    
    if (input.includes('recommend') || input.includes('suggest') || input.includes('find')) {
      return "I'd be happy to help you find the perfect piece! To give you the best recommendations, could you tell me more about what you're looking for? Are you interested in a specific category, style, or do you have a particular use in mind?";
    }
    
    // Default response for unrecognized queries
    return "That's a fascinating question! While I might not have all the details about that specific topic, I'm here to help you explore our amazing collection of handcrafted items. Our artisans create everything from pottery and jewelry to woodwork and textiles. What type of handcrafted items are you most interested in discovering?";
  }

  // Generate video from script (this would integrate with video generation services)
  async generateVideoFromScript(script, productData) {
    try {
      // This would integrate with services like:
      // - RunwayML
      // - D-ID
      // - Synthesia
      // - Custom video generation pipeline
      
      console.log('Generating video from script:', script);
      console.log('Product data:', productData);
      
      // For now, return a mock video URL
      return {
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        thumbnailUrl: productData.images[0]?.url || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
        duration: '90s',
        status: 'generated'
      };
    } catch (error) {
      console.error('Error generating video:', error);
      throw error;
    }
  }
}

export const aiService = new AIService();
