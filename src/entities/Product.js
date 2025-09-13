import firestoreService from '../services/firestoreService.js';

export default class Product {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.price = data.price;
    this.category = data.category;
    this.artisan_name = data.artisan_name;
    this.artisan_id = data.artisan_id;
    this.location = data.location;
    this.images = data.images || [];
    this.rating = data.rating || 0;
    this.reviewCount = data.reviewCount || 0;
    this.materials = data.materials || '';
    this.dimensions = data.dimensions || '';
    this.weight = data.weight || '';
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.created_date = data.created_date || data.created_at || new Date().toISOString();
  }

  // Get all products from Firestore (real user data only)
  static async list(sortBy = 'created_at') {
    try {
      console.log('Fetching real products from Firestore...');
      
      // Get products from Firestore (real user data)
      const products = await firestoreService.getAllProducts(sortBy);
      console.log('Fetched products from Firestore:', products.length);
      
      // Also check for local products as fallback
      const localProducts = JSON.parse(localStorage.getItem('localProducts') || '[]');
      console.log('Local products:', localProducts.length);
      
      // Combine Firestore and local products
      const allProducts = [...products, ...localProducts];
      
      // Sort combined products by creation date
      const sortedProducts = allProducts.sort((a, b) => {
        const dateA = new Date(a.created_at || a.created_date);
        const dateB = new Date(b.created_at || b.created_date);
        return dateB - dateA; // Most recent first
      });
      
      console.log('Total products to display:', sortedProducts.length);
      return sortedProducts;
    } catch (error) {
      console.error('Error fetching products from Firestore:', error);
      
      // Fallback to local products if Firestore fails
      const localProducts = JSON.parse(localStorage.getItem('localProducts') || '[]');
      console.log('Using local products as fallback:', localProducts.length);
      return localProducts;
    }
  }

  // Get a single product by ID
  static async getById(id) {
    try {
      return await firestoreService.getProductById(id);
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  // Create a new product
  static async create(productData) {
    try {
      return await firestoreService.addProduct(productData);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  // Update a product
  static async update(id, updateData) {
    try {
      return await firestoreService.updateProduct(id, updateData);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  // Delete a product
  static async delete(id) {
    try {
      return await firestoreService.deleteProduct(id);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // Get products by category
  static async getByCategory(category) {
    try {
      return await firestoreService.getProductsByCategory(category);
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  }

  // Get products by artisan
  static async getByArtisan(artisanId) {
    try {
      return await firestoreService.getProductsByArtisan(artisanId);
    } catch (error) {
      console.error('Error fetching products by artisan:', error);
      return [];
    }
  }

  // Search products
  static async search(searchTerm) {
    try {
      return await firestoreService.searchProducts(searchTerm);
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }
}
