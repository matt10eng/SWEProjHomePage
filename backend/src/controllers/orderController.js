const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const mailgunTransport = require('nodemailer-mailgun-transport');

// Configure email transporter using Mailgun
const transporter = nodemailer.createTransport(
  mailgunTransport({
    auth: {
      api_key: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN
    }
  })
);

// GET /api/orders - list all orders for the current user
exports.getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId }).populate('items.product');
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
};

// POST /api/orders - create a new order and send confirmation email
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    // Fetch user email for notification
    const user = await User.findById(userId);
    const userEmail = user.email;
    const { items, shippingOption } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }

    // Calculate total from product prices
    let subtotal = 0;
    const detailedItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ message: `Product ${item.productId} not found` });
      }
      subtotal += product.price * item.quantity;
      detailedItems.push({ product: product._id, quantity: item.quantity });
    }

    // Shipping costs
    const rates = { free: 0, twoDay: 5, oneDay: 10 };
    const shippingCost = rates[shippingOption] || 0;
    const total = subtotal + shippingCost;
    // Compute estimated delivery date
    const daysMap = { free: 7, twoDay: 2, oneDay: 1 };
    const daysToAdd = daysMap[shippingOption] || daysMap.free;
    const eta = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000);
    const etaStr = eta.toDateString();

    // Save order
    const order = new Order({
      user: userId,
      items: detailedItems,
      shippingOption,
      total
    });
    await order.save();
    await order.populate('items.product');

    // Send confirmation email
    console.log('Preparing to send order confirmation email to', userEmail);
    const itemsListHtml = order.items.map(i =>
      `<li>${i.product.name} x ${i.quantity} - $${(i.product.price * i.quantity).toFixed(2)}</li>`
    ).join('');
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Order Confirmation',
      html: `
        <h1>Thank you for your order, ${user.username}!</h1>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Items Ordered:</strong></p>
        <ul>
          ${itemsListHtml}
        </ul>
        <p><strong>Shipping:</strong> $${shippingCost.toFixed(2)} (${shippingOption})</p>
        <p><strong>Total:</strong> $${total.toFixed(2)}</p>
        <p><strong>Estimated Delivery:</strong> ${etaStr}</p>
        <p>We will notify you when your items have shipped.</p>
      `
    };
    // Only send email if not in test environment
    if (process.env.NODE_ENV !== 'test') {
      // Use callback form to log full Mailgun response
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error('Mailgun sendMail error:', err);
        } else {
          console.log('Mailgun sendMail response:', info);
        }
      });
    }

    res.status(201).json(order);
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ message: 'Server error creating order' });
  }
};

// GET /api/orders/:id - fetch a specific order by ID for the current user
exports.getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const order = await Order.findOne({ _id: id, user: userId }).populate('items.product');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({ message: 'Server error fetching order' });
  }
};
