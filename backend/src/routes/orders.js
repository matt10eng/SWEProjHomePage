// backend/src/routes/orders.js
// --------------------------------
const express = require('express');
const router = express.Router();
const { getOrders, createOrder, getOrderById } = require('../controllers/orderController');
const cartController = require('../controllers/cartController');

// GET /api/orders - list all orders for current user
router.get('/', getOrders);

// POST /api/orders - place a new order (checkout)
router.post('/', createOrder);

// GET /api/orders/:id - get a specific order by ID
router.get('/:id', getOrderById);

// existing cart routes
router.get('/cart', cartController.getCart);
router.post('/cart', cartController.addToCart);
router.patch('/cart/:productId', cartController.updateCartItem);
router.delete('/cart/:productId', cartController.removeFromCart);
router.delete('/cart', cartController.clearCart);  // clear entire cart

module.exports = router;