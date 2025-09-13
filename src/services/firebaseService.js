import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../Firebasesdk.js';

class FirebaseService {
  constructor() {
    this.productsCollection = 'products';
  }

  // Add a new product to Firestore
  async addProduct(productData) {
    try {
      const productWithTimestamp = {
        ...productData,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, this.productsCollection), productWithTimestamp);
      console.log('Product added with ID: ', docRef.id);
      return { id: docRef.id, ...productData };
    } catch (error) {
      console.error('Error adding product: ', error);
      throw error;
    }
  }

  // Get all products from Firestore
  async getAllProducts(sortBy = 'created_at') {
    try {
      const q = query(
        collection(db, this.productsCollection),
        orderBy(sortBy, 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const products = [];
      
      querySnapshot.forEach((doc) => {
        products.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return products;
    } catch (error) {
      console.error('Error getting products: ', error);
      throw error;
    }
  }

  // Get a single product by ID
  async getProductById(productId) {
    try {
      const docRef = doc(db, this.productsCollection, productId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      } else {
        throw new Error('Product not found');
      }
    } catch (error) {
      console.error('Error getting product: ', error);
      throw error;
    }
  }

  // Update a product
  async updateProduct(productId, updateData) {
    try {
      const productRef = doc(db, this.productsCollection, productId);
      const productWithTimestamp = {
        ...updateData,
        updated_at: serverTimestamp()
      };
      
      await updateDoc(productRef, productWithTimestamp);
      console.log('Product updated successfully');
      return { id: productId, ...updateData };
    } catch (error) {
      console.error('Error updating product: ', error);
      throw error;
    }
  }

  // Delete a product
  async deleteProduct(productId) {
    try {
      await deleteDoc(doc(db, this.productsCollection, productId));
      console.log('Product deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting product: ', error);
      throw error;
    }
  }

  // Get products by category
  async getProductsByCategory(category) {
    try {
      const q = query(
        collection(db, this.productsCollection),
        where('category', '==', category),
        orderBy('created_at', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const products = [];
      
      querySnapshot.forEach((doc) => {
        products.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return products;
    } catch (error) {
      console.error('Error getting products by category: ', error);
      throw error;
    }
  }

  // Get products by artisan
  async getProductsByArtisan(artisanId) {
    try {
      const q = query(
        collection(db, this.productsCollection),
        where('artisan_id', '==', artisanId),
        orderBy('created_at', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const products = [];
      
      querySnapshot.forEach((doc) => {
        products.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return products;
    } catch (error) {
      console.error('Error getting products by artisan: ', error);
      throw error;
    }
  }

  // Search products
  async searchProducts(searchTerm) {
    try {
      // Note: Firestore doesn't support full-text search natively
      // This is a basic implementation - for production, consider using Algolia or similar
      const allProducts = await this.getAllProducts();
      
      const filteredProducts = allProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.artisan_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      return filteredProducts;
    } catch (error) {
      console.error('Error searching products: ', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const firebaseService = new FirebaseService();
export default firebaseService;
