import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../Firebasesdk.js';
import { processImagesForUpload } from './imageService.js';

// Collection name for products
const PRODUCTS_COLLECTION = 'products';

/**
 * Add a new product to Firestore
 * @param {Object} productData - Product data to save
 * @returns {Promise<string>} - Document ID of the created product
 */
export const addProduct = async (productData) => {
  try {
    console.log('Attempting to add product to Firestore:', productData);
    
    // Process images to convert File objects to base64 for persistence
    const processedImages = await processImagesForUpload(productData.images, productData.name);
    console.log('Processed images:', processedImages);
    
    const productWithTimestamp = {
      ...productData,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
      // Ensure numeric fields are properly typed
      price: parseFloat(productData.price) || 0,
      rating: parseFloat(productData.rating) || 0,
      reviewCount: parseInt(productData.reviewCount) || 0,
      // Use processed images (base64 data URIs for persistence)
      images: processedImages,
      materials: Array.isArray(productData.materials) ? productData.materials : []
    };

    // Remove any File objects or other non-serializable data
    const cleanProductData = JSON.parse(JSON.stringify(productWithTimestamp));

    console.log('Product data prepared for Firestore:', cleanProductData);
    
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), cleanProductData);
    console.log('✅ Product added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error adding product to Firestore:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    throw new Error(`Firestore error: ${error.message} (Code: ${error.code})`);
  }
};

/**
 * Get all products from Firestore
 * @param {string} sortBy - Field to sort by (default: 'created_at')
 * @param {number} limitCount - Maximum number of products to fetch
 * @returns {Promise<Array>} - Array of products
 */
export const getAllProducts = async (sortBy = 'created_at', limitCount = 50) => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      orderBy(sortBy, 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const products = [];
    
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamps to readable dates
        created_at: doc.data().created_at?.toDate?.() || new Date(),
        updated_at: doc.data().updated_at?.toDate?.() || new Date()
      });
    });
    
    console.log('Fetched products from Firestore:', products.length);
    return products;
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

/**
 * Get a single product by ID
 * @param {string} productId - Product document ID
 * @returns {Promise<Object|null>} - Product data or null if not found
 */
export const getProductById = async (productId) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const productData = {
        id: docSnap.id,
        ...docSnap.data(),
        created_at: docSnap.data().created_at?.toDate?.() || new Date(),
        updated_at: docSnap.data().updated_at?.toDate?.() || new Date()
      };
      return productData;
    } else {
      console.log('No product found with ID:', productId);
      return null;
    }
  } catch (error) {
    console.error('Error getting product by ID:', error);
    throw error;
  }
};

/**
 * Update a product in Firestore
 * @param {string} productId - Product document ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<void>}
 */
export const updateProduct = async (productId, updateData) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    const updateWithTimestamp = {
      ...updateData,
      updated_at: serverTimestamp()
    };
    
    await updateDoc(docRef, updateWithTimestamp);
    console.log('Product updated:', productId);
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

/**
 * Delete a product from Firestore
 * @param {string} productId - Product document ID
 * @returns {Promise<void>}
 */
export const deleteProduct = async (productId) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(docRef);
    console.log('Product deleted:', productId);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

/**
 * Get products by category
 * @param {string} category - Product category
 * @returns {Promise<Array>} - Array of products in the category
 */
export const getProductsByCategory = async (category) => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where('category', '==', category),
      orderBy('created_at', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const products = [];
    
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate?.() || new Date(),
        updated_at: doc.data().updated_at?.toDate?.() || new Date()
      });
    });
    
    return products;
  } catch (error) {
    console.error('Error getting products by category:', error);
    throw error;
  }
};

/**
 * Get products by artisan
 * @param {string} artisanId - Artisan user ID
 * @returns {Promise<Array>} - Array of products by the artisan
 */
export const getProductsByArtisan = async (artisanId) => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where('artisan_id', '==', artisanId),
      orderBy('created_at', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const products = [];
    
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at?.toDate?.() || new Date(),
        updated_at: doc.data().updated_at?.toDate?.() || new Date()
      });
    });
    
    return products;
  } catch (error) {
    console.error('Error getting products by artisan:', error);
    throw error;
  }
};

/**
 * Search products by name or description
 * @param {string} searchTerm - Search term
 * @returns {Promise<Array>} - Array of matching products
 */
export const searchProducts = async (searchTerm) => {
  try {
    // Note: Firestore doesn't support full-text search natively
    // This is a simple implementation that searches in name and description
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      orderBy('created_at', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const products = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const searchLower = searchTerm.toLowerCase();
      
      if (
        data.name?.toLowerCase().includes(searchLower) ||
        data.description?.toLowerCase().includes(searchLower) ||
        data.category?.toLowerCase().includes(searchLower)
      ) {
        products.push({
          id: doc.id,
          ...data,
          created_at: data.created_at?.toDate?.() || new Date(),
          updated_at: data.updated_at?.toDate?.() || new Date()
        });
      }
    });
    
    return products;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

// Export all functions as default object
export default {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getProductsByArtisan,
  searchProducts
};
