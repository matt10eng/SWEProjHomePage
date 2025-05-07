import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import api from './api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const { isAuthenticated } = useAuth();

  // Fetch current cart and compute total quantity
  const reloadCartCount = () => {
    api.get('/api/cart')
      .then(res => {
        const total = res.data.items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(total);
      })
      .catch(err => console.error('Failed to fetch cart count:', err));
  };

  // Reload cart count when user logs in/out
  useEffect(() => {
    if (isAuthenticated) {
      reloadCartCount();
    } else {
      setCartCount(0);
    }
  }, [isAuthenticated]);

  // Add item to cart and update count locally
  const addToCart = async (productId, quantity) => {
    await api.post('/api/cart', { productId, quantity });
    setCartCount(prev => prev + quantity);
  };

  // Update cart item quantity and adjust count by the difference
  const updateCartItem = async (productId, newQuantity, oldQuantity) => {
    await api.patch(`/api/cart/${productId}`, { quantity: newQuantity });
    const diff = newQuantity - oldQuantity;
    setCartCount(prev => prev + diff);
  };

  // Remove item from cart and subtract its quantity from count
  const removeFromCart = async (productId, oldQuantity) => {
    await api.delete(`/api/cart/${productId}`);
    setCartCount(prev => prev - oldQuantity);
  };

  return (
    <CartContext.Provider value={{ cartCount, reloadCartCount, addToCart, updateCartItem, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}; 