// backend/src/routes/cart.js
// --------------------------------
const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart, updateCartItem } = require('../controllers/cartController');

// GET /api/cart - fetch the current user's cart
router.get('/', getCart);

// POST /api/cart - add or update an item in the cart
router.post('/', addToCart);

// DELETE /api/cart/:productId - remove a specific item
router.delete('/:productId', removeFromCart);

// PATCH /api/cart/:productId - update the quantity of a specific item
router.patch('/:productId', updateCartItem);

module.exports = router;