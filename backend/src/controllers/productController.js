const Product = require('../models/product');

// GET /api/products - list all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Server error fetching products' });
  }
};

// GET /api/products/search - search products by query
exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    
    // If no query provided, return all products instead of empty results
    if (!query || query.trim() === '') {
      const allProducts = await Product.find();
      return res.json(allProducts);
    }
    
    const searchQuery = query.trim();
    
    // Create regex patterns for different types of matches
    // 1. Starts with the query (higher priority)
    const startsWithRegex = new RegExp(`^${searchQuery}`, 'i');
    // 2. Contains the query (lower priority)
    const containsRegex = new RegExp(searchQuery, 'i');
    
    // Find products that match either condition
    const products = await Product.find({
      $or: [
        { name: startsWithRegex },
        { name: containsRegex },
        { description: containsRegex }
      ]
    });
    
    // Remove duplicates (products that match both conditions)
    const uniqueProducts = [];
    const productIds = new Set();
    
    // First add products that start with the query (higher priority)
    products.forEach(product => {
      if (startsWithRegex.test(product.name) && !productIds.has(product._id.toString())) {
        uniqueProducts.push(product);
        productIds.add(product._id.toString());
      }
    });
    
    // Then add remaining products
    products.forEach(product => {
      if (!productIds.has(product._id.toString())) {
        uniqueProducts.push(product);
        productIds.add(product._id.toString());
      }
    });
    
    res.json(uniqueProducts);
  } catch (err) {
    console.error('Error searching products:', err);
    res.status(500).json({ message: 'Server error searching products' });
  }
};

// GET /api/products/:id - get one product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ message: 'Server error fetching product' });
  }
};

// Update an existing product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, imageUrl } = req.body;
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (description !== undefined) updateFields.description = description;
    if (price !== undefined) updateFields.price = price;
    if (imageUrl !== undefined) updateFields.imageUrl = imageUrl;
    const product = await Product.findByIdAndUpdate(id, updateFields, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ message: 'Server error updating product' });
  }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: 'Server error deleting product' });
  }
};
