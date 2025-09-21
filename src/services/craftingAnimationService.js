/**
 * Crafting Animation Service
 * Uses Gemini AI to generate product-specific crafting animations
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'your_gemini_api_key_here';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

/**
 * Generate crafting animation for a specific product
 * @param {Object} productData - Product information
 * @returns {Promise<Object>} - Animation data with SVG frames
 */
export const generateCraftingAnimation = async (productData) => {
  try {
    console.log('🎬 Generating crafting animation for:', productData.name);
    
    const prompt = createCraftingPrompt(productData);
    
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
        }]
      })
    });

    if (!response.ok) {
      console.warn(`⚠️ Gemini API error: ${response.status} - Using fallback animation`);
      return generateFallbackAnimation(productData);
    }

    const data = await response.json();
    const generatedContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (generatedContent) {
      return parseAnimationResponse(generatedContent, productData);
    } else {
      return generateFallbackAnimation(productData);
    }
    
  } catch (error) {
    console.error('❌ Error generating crafting animation:', error);
    return generateFallbackAnimation(productData);
  }
};

/**
 * Create a detailed prompt for Gemini AI to generate crafting animation
 */
const createCraftingPrompt = (productData) => {
  const productName = productData.name?.toLowerCase() || '';
  const category = productData.category?.toLowerCase() || '';
  const materials = productData.materials || '';
  
  return `Create a step-by-step crafting animation for a ${productName} in the ${category} category. 

Product Details:
- Name: ${productData.name}
- Category: ${productData.category}
- Materials: ${materials}
- Description: ${productData.description}

Please generate a detailed crafting process with 8-12 animation frames showing:
1. Material preparation
2. Initial shaping/forming
3. Detailed crafting steps
4. Finishing touches
5. Final product

For each frame, provide:
- Frame number (1-12)
- Description of the crafting step
- SVG code for the visual representation
- Duration (in seconds)

Format the response as JSON with this structure:
{
  "animation": {
    "title": "Crafting [Product Name]",
    "totalFrames": 12,
    "totalDuration": 15,
    "frames": [
      {
        "frameNumber": 1,
        "title": "Material Preparation",
        "description": "Gathering and preparing materials",
        "duration": 2,
        "svg": "<svg>...</svg>"
      }
    ]
  }
}

Make the SVG animations visually appealing with:
- Realistic materials and tools
- Progressive building/forming
- Smooth transitions between steps
- Professional craftsmanship appearance
- Appropriate colors for the materials used

Focus on the specific crafting techniques for ${category} items.`;
};

/**
 * Parse the Gemini AI response and extract animation data
 */
const parseAnimationResponse = (content, productData) => {
  try {
    // Try to extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const animationData = JSON.parse(jsonMatch[0]);
      return {
        success: true,
        animation: animationData.animation,
        productName: productData.name,
        generatedAt: new Date().toISOString()
      };
    } else {
      throw new Error('No valid JSON found in response');
    }
  } catch (error) {
    console.warn('Failed to parse Gemini response, using fallback:', error);
    return generateFallbackAnimation(productData);
  }
};

/**
 * Generate fallback animation when Gemini AI fails
 */
const generateFallbackAnimation = (productData) => {
  const productName = productData.name?.toLowerCase() || 'product';
  const category = productData.category?.toLowerCase() || 'craft';
  
  console.log('🎨 Generating fallback crafting animation for:', productName);
  
  // Create category-specific fallback animations
  const fallbackAnimations = {
    woodwork: generateWoodworkingAnimation(productName),
    pottery: generatePotteryAnimation(productName),
    textiles: generateTextileAnimation(productName),
    jewelry: generateJewelryAnimation(productName),
    paintings: generatePaintingAnimation(productName),
    default: generateGenericCraftingAnimation(productName)
  };
  
  return fallbackAnimations[category] || fallbackAnimations.default;
};

/**
 * Generate woodworking animation frames
 */
const generateWoodworkingAnimation = (productName) => {
  const frames = [
    {
      frameNumber: 1,
      title: "Selecting Wood",
      description: "Choosing the perfect piece of wood",
      duration: 2,
      svg: createWoodSelectionSVG()
    },
    {
      frameNumber: 2,
      title: "Measuring & Marking",
      description: "Precise measurements and markings",
      duration: 2,
      svg: createMeasuringSVG()
    },
    {
      frameNumber: 3,
      title: "Cutting & Shaping",
      description: "Cutting wood to size and basic shaping",
      duration: 3,
      svg: createCuttingSVG()
    },
    {
      frameNumber: 4,
      title: "Joining & Assembly",
      description: "Joining pieces together",
      duration: 3,
      svg: createJoiningSVG()
    },
    {
      frameNumber: 5,
      title: "Sanding & Smoothing",
      description: "Creating smooth surfaces",
      duration: 2,
      svg: createSandingSVG()
    },
    {
      frameNumber: 6,
      title: "Finishing & Polish",
      description: "Applying finish and polish",
      duration: 2,
      svg: createFinishingSVG()
    }
  ];
  
  return {
    success: true,
    animation: {
      title: `Crafting ${productName}`,
      totalFrames: frames.length,
      totalDuration: frames.reduce((sum, frame) => sum + frame.duration, 0),
      frames: frames
    },
    productName: productName,
    generatedAt: new Date().toISOString(),
    isFallback: true
  };
};

/**
 * Generate pottery animation frames
 */
const generatePotteryAnimation = (productName) => {
  const frames = [
    {
      frameNumber: 1,
      title: "Preparing Clay",
      description: "Wedging and preparing the clay",
      duration: 2,
      svg: createClayPreparationSVG()
    },
    {
      frameNumber: 2,
      title: "Centering on Wheel",
      description: "Centering clay on the pottery wheel",
      duration: 2,
      svg: createCenteringSVG()
    },
    {
      frameNumber: 3,
      title: "Opening & Pulling",
      description: "Opening the clay and pulling walls",
      duration: 3,
      svg: createPullingSVG()
    },
    {
      frameNumber: 4,
      title: "Shaping & Forming",
      description: "Shaping the final form",
      duration: 3,
      svg: createShapingSVG()
    },
    {
      frameNumber: 5,
      title: "Trimming & Detailing",
      description: "Adding final details and trimming",
      duration: 2,
      svg: createTrimmingSVG()
    },
    {
      frameNumber: 6,
      title: "Firing & Glazing",
      description: "Firing in kiln and applying glaze",
      duration: 2,
      svg: createFiringSVG()
    }
  ];
  
  return {
    success: true,
    animation: {
      title: `Crafting ${productName}`,
      totalFrames: frames.length,
      totalDuration: frames.reduce((sum, frame) => sum + frame.duration, 0),
      frames: frames
    },
    productName: productName,
    generatedAt: new Date().toISOString(),
    isFallback: true
  };
};

// SVG Creation Functions
const createWoodSelectionSVG = () => `
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <rect width="400" height="300" fill="#f0f8ff"/>
  <rect x="50" y="100" width="300" height="100" fill="#8B4513" rx="10"/>
  <text x="200" y="50" font-family="Arial, sans-serif" font-size="18" fill="#333" text-anchor="middle">Selecting Wood</text>
  <text x="200" y="250" font-family="Arial, sans-serif" font-size="14" fill="#666" text-anchor="middle">Choosing the perfect piece</text>
</svg>`;

const createMeasuringSVG = () => `
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <rect width="400" height="300" fill="#f0f8ff"/>
  <rect x="50" y="100" width="300" height="100" fill="#8B4513" rx="10"/>
  <line x1="100" y1="80" x2="100" y2="120" stroke="#333" stroke-width="2"/>
  <line x1="300" y1="80" x2="300" y2="120" stroke="#333" stroke-width="2"/>
  <text x="200" y="50" font-family="Arial, sans-serif" font-size="18" fill="#333" text-anchor="middle">Measuring & Marking</text>
  <text x="200" y="250" font-family="Arial, sans-serif" font-size="14" fill="#666" text-anchor="middle">Precise measurements</text>
</svg>`;

const createCuttingSVG = () => `
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <rect width="400" height="300" fill="#f0f8ff"/>
  <rect x="50" y="100" width="300" height="100" fill="#8B4513" rx="10"/>
  <path d="M150,80 L150,120 M200,80 L200,120 M250,80 L250,120" stroke="#333" stroke-width="3"/>
  <text x="200" y="50" font-family="Arial, sans-serif" font-size="18" fill="#333" text-anchor="middle">Cutting & Shaping</text>
  <text x="200" y="250" font-family="Arial, sans-serif" font-size="14" fill="#666" text-anchor="middle">Cutting to size</text>
</svg>`;

const createJoiningSVG = () => `
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <rect width="400" height="300" fill="#f0f8ff"/>
  <rect x="100" y="120" width="80" height="60" fill="#8B4513" rx="5"/>
  <rect x="220" y="120" width="80" height="60" fill="#8B4513" rx="5"/>
  <line x1="180" y1="150" x2="220" y2="150" stroke="#333" stroke-width="3"/>
  <text x="200" y="50" font-family="Arial, sans-serif" font-size="18" fill="#333" text-anchor="middle">Joining & Assembly</text>
  <text x="200" y="250" font-family="Arial, sans-serif" font-size="14" fill="#666" text-anchor="middle">Joining pieces together</text>
</svg>`;

const createSandingSVG = () => `
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <rect width="400" height="300" fill="#f0f8ff"/>
  <rect x="100" y="120" width="200" height="60" fill="#8B4513" rx="5"/>
  <circle cx="150" cy="150" r="20" fill="#ddd" opacity="0.7"/>
  <text x="200" y="50" font-family="Arial, sans-serif" font-size="18" fill="#333" text-anchor="middle">Sanding & Smoothing</text>
  <text x="200" y="250" font-family="Arial, sans-serif" font-size="14" fill="#666" text-anchor="middle">Creating smooth surfaces</text>
</svg>`;

const createFinishingSVG = () => `
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <rect width="400" height="300" fill="#f0f8ff"/>
  <rect x="100" y="120" width="200" height="60" fill="#8B4513" rx="5"/>
  <rect x="100" y="120" width="200" height="60" fill="url(#woodGrain)" rx="5" opacity="0.8"/>
  <defs>
    <pattern id="woodGrain" patternUnits="userSpaceOnUse" width="20" height="20">
      <path d="M0,10 Q10,5 20,10" stroke="#654321" stroke-width="1" fill="none" opacity="0.3"/>
    </pattern>
  </defs>
  <text x="200" y="50" font-family="Arial, sans-serif" font-size="18" fill="#333" text-anchor="middle">Finishing & Polish</text>
  <text x="200" y="250" font-family="Arial, sans-serif" font-size="14" fill="#666" text-anchor="middle">Applying finish</text>
</svg>`;

// Pottery SVG functions
const createClayPreparationSVG = () => `
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <rect width="400" height="300" fill="#f0f8ff"/>
  <circle cx="200" cy="150" r="60" fill="#CD853F"/>
  <text x="200" y="50" font-family="Arial, sans-serif" font-size="18" fill="#333" text-anchor="middle">Preparing Clay</text>
  <text x="200" y="250" font-family="Arial, sans-serif" font-size="14" fill="#666" text-anchor="middle">Wedging clay</text>
</svg>`;

const createCenteringSVG = () => `
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <rect width="400" height="300" fill="#f0f8ff"/>
  <circle cx="200" cy="150" r="80" fill="#8B4513" stroke="#333" stroke-width="2"/>
  <circle cx="200" cy="150" r="50" fill="#CD853F"/>
  <text x="200" y="50" font-family="Arial, sans-serif" font-size="18" fill="#333" text-anchor="middle">Centering on Wheel</text>
  <text x="200" y="250" font-family="Arial, sans-serif" font-size="14" fill="#666" text-anchor="middle">Centering clay</text>
</svg>`;

const createPullingSVG = () => `
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <rect width="400" height="300" fill="#f0f8ff"/>
  <circle cx="200" cy="150" r="80" fill="#8B4513" stroke="#333" stroke-width="2"/>
  <ellipse cx="200" cy="150" rx="40" ry="60" fill="#CD853F"/>
  <text x="200" y="50" font-family="Arial, sans-serif" font-size="18" fill="#333" text-anchor="middle">Opening & Pulling</text>
  <text x="200" y="250" font-family="Arial, sans-serif" font-size="14" fill="#666" text-anchor="middle">Pulling walls</text>
</svg>`;

const createShapingSVG = () => `
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <rect width="400" height="300" fill="#f0f8ff"/>
  <circle cx="200" cy="150" r="80" fill="#8B4513" stroke="#333" stroke-width="2"/>
  <path d="M160,120 Q200,100 240,120 Q240,180 200,200 Q160,180 160,120 Z" fill="#CD853F"/>
  <text x="200" y="50" font-family="Arial, sans-serif" font-size="18" fill="#333" text-anchor="middle">Shaping & Forming</text>
  <text x="200" y="250" font-family="Arial, sans-serif" font-size="14" fill="#666" text-anchor="middle">Shaping the form</text>
</svg>`;

const createTrimmingSVG = () => `
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <rect width="400" height="300" fill="#f0f8ff"/>
  <circle cx="200" cy="150" r="80" fill="#8B4513" stroke="#333" stroke-width="2"/>
  <path d="M160,120 Q200,100 240,120 Q240,180 200,200 Q160,180 160,120 Z" fill="#CD853F"/>
  <line x1="180" y1="140" x2="220" y2="140" stroke="#333" stroke-width="2"/>
  <text x="200" y="50" font-family="Arial, sans-serif" font-size="18" fill="#333" text-anchor="middle">Trimming & Detailing</text>
  <text x="200" y="250" font-family="Arial, sans-serif" font-size="14" fill="#666" text-anchor="middle">Adding details</text>
</svg>`;

const createFiringSVG = () => `
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <rect width="400" height="300" fill="#f0f8ff"/>
  <rect x="150" y="100" width="100" height="100" fill="#8B4513" rx="10"/>
  <path d="M160,120 Q200,100 240,120 Q240,180 200,200 Q160,180 160,120 Z" fill="#CD853F"/>
  <rect x="140" y="90" width="120" height="20" fill="#666" rx="5"/>
  <text x="200" y="50" font-family="Arial, sans-serif" font-size="18" fill="#333" text-anchor="middle">Firing & Glazing</text>
  <text x="200" y="250" font-family="Arial, sans-serif" font-size="14" fill="#666" text-anchor="middle">Kiln firing</text>
</svg>`;

// Generic crafting animation
const generateGenericCraftingAnimation = (productName) => {
  return {
    success: true,
    animation: {
      title: `Crafting ${productName}`,
      totalFrames: 6,
      totalDuration: 12,
      frames: [
        {
          frameNumber: 1,
          title: "Material Preparation",
          description: "Gathering materials",
          duration: 2,
          svg: createGenericFrameSVG(1, "Material Preparation")
        },
        {
          frameNumber: 2,
          title: "Initial Shaping",
          description: "Basic shaping",
          duration: 2,
          svg: createGenericFrameSVG(2, "Initial Shaping")
        },
        {
          frameNumber: 3,
          title: "Detailed Work",
          description: "Adding details",
          duration: 3,
          svg: createGenericFrameSVG(3, "Detailed Work")
        },
        {
          frameNumber: 4,
          title: "Refinement",
          description: "Refining the work",
          duration: 2,
          svg: createGenericFrameSVG(4, "Refinement")
        },
        {
          frameNumber: 5,
          title: "Finishing",
          description: "Final touches",
          duration: 2,
          svg: createGenericFrameSVG(5, "Finishing")
        },
        {
          frameNumber: 6,
          title: "Complete",
          description: "Finished product",
          duration: 1,
          svg: createGenericFrameSVG(6, "Complete")
        }
      ]
    },
    productName: productName,
    generatedAt: new Date().toISOString(),
    isFallback: true
  };
};

const createGenericFrameSVG = (frameNumber, title) => `
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <rect width="400" height="300" fill="#f0f8ff"/>
  <circle cx="200" cy="150" r="${80 - frameNumber * 5}" fill="#8B4513" opacity="${0.2 + frameNumber * 0.1}"/>
  <text x="200" y="50" font-family="Arial, sans-serif" font-size="18" fill="#333" text-anchor="middle">${title}</text>
  <text x="200" y="250" font-family="Arial, sans-serif" font-size="14" fill="#666" text-anchor="middle">Step ${frameNumber}</text>
</svg>`;

// Additional category-specific functions (simplified for brevity)
const generateTextileAnimation = (productName) => generateGenericCraftingAnimation(productName);
const generateJewelryAnimation = (productName) => generateGenericCraftingAnimation(productName);
const generatePaintingAnimation = (productName) => generateGenericCraftingAnimation(productName);

export default {
  generateCraftingAnimation
};

