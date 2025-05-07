const Cart = require('../models/cart');
// Get the current user's cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    let cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }
    res.json(cart);
  } catch (err) {
    console.error('Error fetching cart:', err);
    res.status(500).json({ message: 'Server error fetching cart' });
  }
};

// Add or update an item in the cart
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    if (!productId || quantity == null) {
      return res.status(400).json({ message: 'productId and quantity are required' });
    }
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }
    const idx = cart.items.findIndex(item => item.product.toString() === productId);
    if (idx > -1) {
      cart.items[idx].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    cart.updatedAt = Date.now();
    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
  } catch (err) {
    console.error('Error updating cart:', err);
    res.status(500).json({ message: 'Server error updating cart' });
  }
};

// Remove an item from the cart
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    cart.updatedAt = Date.now();
    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
  } catch (err) {
    console.error('Error removing cart item:', err);
    res.status(500).json({ message: 'Server error removing cart item' });
  }
};

// Update the quantity of an item in the cart, or remove it if quantity <= 0
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;
    if (quantity == null) {
      return res.status(400).json({ message: 'quantity is required' });
    }
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    const idx = cart.items.findIndex(item => item.product.toString() === productId);
    if (idx === -1) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    if (quantity <= 0) {
      // Remove item
      cart.items.splice(idx, 1);
    } else {
      // Update quantity
      cart.items[idx].quantity = quantity;
    }
    cart.updatedAt = Date.now();
    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
  } catch (err) {
    console.error('Error updating cart item:', err);
    res.status(500).json({ message: 'Server error updating cart item' });
  }
};

// DELETE /api/cart - clear the entire cart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }
    cart.items = [];
    cart.updatedAt = Date.now();
    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
  } catch (err) {
    console.error('Error clearing cart:', err);
    res.status(500).json({ message: 'Server error clearing cart' });
  }
};
