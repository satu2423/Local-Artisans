import { storage } from '../../Firebasesdk.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * Convert File to base64 data URI
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - Base64 data URI
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

/**
 * Upload image to Firebase Storage and get download URL
 * @param {File} file - The image file to upload
 * @param {string} productId - Product ID for organizing files
 * @param {number} imageIndex - Index of the image (for multiple images)
 * @returns {Promise<string>} - Download URL from Firebase Storage
 */
export const uploadImageToStorage = async (file, productId, imageIndex = 0) => {
  try {
    const fileName = `products/${productId}/image_${imageIndex}_${Date.now()}.${file.name.split('.').pop()}`;
    const storageRef = ref(storage, fileName);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log('✅ Image uploaded to Firebase Storage:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('❌ Error uploading image to Firebase Storage:', error);
    throw error;
  }
};

/**
 * Process images for product upload - converts to base64 for persistence
 * @param {Array} images - Array of File objects or image data
 * @param {string} productName - Product name for fallback
 * @returns {Promise<Array>} - Array of processed image objects
 */
export const processImagesForUpload = async (images, productName) => {
  if (!images || images.length === 0) {
    // Return default placeholder
    const svgData = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="#f3f4f6"/><text x="200" y="150" font-family="Arial, sans-serif" font-size="24" fill="#9ca3af" text-anchor="middle" dominant-baseline="middle">${productName || 'Product'}</text></svg>`;
    return [{
      url: `data:image/svg+xml;base64,${btoa(svgData)}`,
      alt: `${productName} - Product Image`,
      isPlaceholder: true
    }];
  }

  const processedImages = [];

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    
    if (image instanceof File) {
      try {
        // Convert File to base64 for persistence
        const base64Data = await fileToBase64(image);
        processedImages.push({
          url: base64Data,
          alt: `${productName} - Image ${i + 1}`,
          isPlaceholder: false,
          originalName: image.name
        });
      } catch (error) {
        console.error(`Error processing image ${i + 1}:`, error);
        // Add placeholder for failed image
        const svgData = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="#f3f4f6"/><text x="200" y="150" font-family="Arial, sans-serif" font-size="24" fill="#9ca3af" text-anchor="middle" dominant-baseline="middle">${productName || 'Product'}</text></svg>`;
        processedImages.push({
          url: `data:image/svg+xml;base64,${btoa(svgData)}`,
          alt: `${productName} - Image ${i + 1}`,
          isPlaceholder: true
        });
      }
    } else if (image && image.url) {
      // Already processed image
      processedImages.push({
        url: image.url,
        alt: image.alt || `${productName} - Image ${i + 1}`,
        isPlaceholder: image.isPlaceholder || false
      });
    }
  }

  return processedImages;
};

/**
 * Get image URL for display - handles both base64 and external URLs
 * @param {Object} image - Image object with url property
 * @param {string} fallbackName - Fallback name for placeholder
 * @returns {string} - Image URL for display
 */
export const getImageDisplayUrl = (image, fallbackName = 'Product') => {
  if (!image || !image.url) {
    // Return placeholder
    const svgData = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="#f3f4f6"/><text x="200" y="150" font-family="Arial, sans-serif" font-size="24" fill="#9ca3af" text-anchor="middle" dominant-baseline="middle">${fallbackName}</text></svg>`;
    return `data:image/svg+xml;base64,${btoa(svgData)}`;
  }

  // If it's a blob URL (temporary), return placeholder
  if (image.url.startsWith('blob:')) {
    const svgData = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="#f3f4f6"/><text x="200" y="150" font-family="Arial, sans-serif" font-size="24" fill="#9ca3af" text-anchor="middle" dominant-baseline="middle">${fallbackName}</text></svg>`;
    return `data:image/svg+xml;base64,${btoa(svgData)}`;
  }

  // Return the actual URL (base64 or external)
  return image.url;
};

export default {
  fileToBase64,
  uploadImageToStorage,
  processImagesForUpload,
  getImageDisplayUrl
};
