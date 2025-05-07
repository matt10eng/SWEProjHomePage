// backend/src/routes/products.js
// --------------------------------
const express = require('express');
const Product = require('../models/product');
const router = express.Router();
const { getAllProducts, getProductById, updateProduct, deleteProduct, searchProducts } = require('../controllers/productController');
const authMiddleware = require('../middleware/auth');

// GET /api/products/search
router.get('/search', searchProducts);

// GET /api/products
router.get('/', getAllProducts);

// GET /api/products/:id
router.get('/:id', getProductById);

// POST /api/products - create a new product (admin only)
router.post('/', authMiddleware, async (req, res) => {
  const { name, description, price, imageUrl } = req.body;
  if (!name || price == null) {
    return res.status(400).json({ message: 'Name and price are required' });
  }
  try {
    const product = await Product.create({ name, description, price, imageUrl });
    res.status(201).json(product);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ message: 'Server error creating product' });
  }
});

// PUT /api/products/:id - update a product (admin only)
router.put('/:id', authMiddleware, updateProduct);

// DELETE /api/products/:id - delete a product (admin only)
router.delete('/:id', authMiddleware, deleteProduct);

module.exports = router;