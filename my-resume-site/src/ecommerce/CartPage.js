import React, { useEffect, useState } from 'react';
import api from './api';
import { Link, useNavigate } from 'react-router-dom';
import './Ecommerce.css';
import { useCart } from './CartContext';

const CartPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { updateCartItem, removeFromCart } = useCart();
  const [editingItemId, setEditingItemId] = useState(null);
  const [editQuantity, setEditQuantity] = useState(0);

  const fetchCart = () => {
    setLoading(true);
    api.get('/api/cart')
      .then(res => setItems(res.data.items))
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdate = async (productId, quantity) => {
    try {
      await api.patch(`/api/cart/${productId}`, { quantity });
      fetchCart();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await api.delete(`/api/cart/${productId}`);
      fetchCart();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleCheckout = () => {
    navigate('/ecommerce/checkout');
  };

  // Start editing a cart item
  const handleStartEdit = (productId, currentQty) => {
    setEditingItemId(productId);
    setEditQuantity(currentQty);
  };

  // Cancel editing
  const handleCancelEdit = () => setEditingItemId(null);

  // Save edited quantity
  const handleSaveEdit = async (productId) => {
    const oldQty = items.find(i => i.product._id === productId)?.quantity || 0;
    try {
      await updateCartItem(productId, editQuantity, oldQty);
      setItems(items.map(i => i.product._id === productId ? { ...i, quantity: editQuantity } : i));
      setEditingItemId(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  // Delete cart item
  const handleDeleteItem = async (productId) => {
    const oldQty = items.find(i => i.product._id === productId)?.quantity || 0;
    try {
      await removeFromCart(productId, oldQty);
      setItems(items.filter(i => i.product._id !== productId));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  if (loading) return <div>Loading cart...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!items.length) return (
    <div className="cart-page">
      <h2>Shopping Cart</h2>
      <div>Your cart is empty. <Link to="/ecommerce">Shop now</Link></div>
    </div>
  );

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {items.map(item => (
        <div key={item.product._id} className="cart-item">
          <img src={`${process.env.PUBLIC_URL}/${item.product.imageUrl}`} alt={item.product.name} className="cart-item-image" />
          <div className="cart-item-info">
            <h3>{item.product.name}</h3>
            <p>Price: ${item.product.price.toFixed(2)}</p>
            <div className="cart-item-actions">
              {editingItemId === item.product._id ? (
                <>
                  <input
                    type="number"
                    min="1"
                    value={editQuantity}
                    onChange={e => setEditQuantity(Number(e.target.value))}
                  />
                  <button className="action-link" onClick={() => handleSaveEdit(item.product._id)}>Save</button>
                  <button className="action-link" onClick={handleCancelEdit}>Cancel</button>
                </>
              ) : (
                <>
                  <span>Quantity: {item.quantity}</span>
                  <button className="action-link" onClick={() => handleStartEdit(item.product._id, item.quantity)}>Update</button>
                  <button className="action-link" onClick={() => handleDeleteItem(item.product._id)}>Delete</button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
      <button className="checkout-button" onClick={handleCheckout}>Checkout</button>
    </div>
  );
};

export default CartPage; 