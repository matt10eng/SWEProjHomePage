import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/checkout-header.css';
import './styles/checkout.css';
import api from './api';
import { useCart } from './CartContext';
import amazonLogo from './images/amazon-logo.png';
import amazonMobileLogo from './images/amazon-mobile-logo.png';
import checkoutLockIcon from './images/icons/checkout-lock-icon.png';

const CheckoutPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDelivery, setSelectedDelivery] = useState({});
  const { cart, updateCartItem, removeFromCart, fetchCartItems } = useCart();

  // State for editing quantity
  const [editingItemId, setEditingItemId] = useState(null);
  const [editQuantity, setEditQuantity] = useState(0);

  const navigate = useNavigate();

  // Fetch cart items on mount and initialize delivery selections
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      try {
        let itemsToSet = [];
        // Check if cart and cart.items are available from context
        if (cart && cart.items) { // Ensure cart itself is defined before accessing cart.items
          itemsToSet = cart.items;
        } else {
          // Fallback to direct API call if context cart is not populated
          const res = await api.get('/api/cart');
          itemsToSet = res.data.items || []; // Ensure res.data.items is not undefined, default to empty array
        }
        
        setItems(itemsToSet);
        
        const initDel = {};
        if (itemsToSet && itemsToSet.length > 0) { // Check itemsToSet before iterating
            itemsToSet.forEach(item => {
                // Preserve existing selection or default to 'free'
                initDel[item.product._id] = selectedDelivery[item.product._id] || 'free';
            });
        }
        setSelectedDelivery(initDel);

      } catch (e) {
        setError(e.response?.data?.message || e.message);
        setItems([]); // On error, set items to an empty array
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, [cart]); // Changed dependency from [cart.items] to [cart]

  // Delivery options setup
  const deliveryOptions = [
    { id: 'free', label: 'Free Shipping', offset: 3, price: 0 },
    { id: 'standard', label: 'Standard Shipping', offset: 1, price: 4.99 },
    { id: 'express', label: 'Express Shipping', offset: 5, price: 9.99 }
  ];

  const handleDeliveryChange = (productId, optionId) => {
    setSelectedDelivery(prev => ({ ...prev, [productId]: optionId }));
  };

  // Format a JavaScript Date to e.g. "Tuesday, May 13"
  const formatDate = date => {
    return new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(date);
  };

  // Edit handlers from CartPage.js, adapted for local state and context
  const handleStartEdit = (productId, currentQty) => {
    setEditingItemId(productId);
    setEditQuantity(currentQty);
  };

  const handleCancelEdit = () => setEditingItemId(null);

  const handleSaveEdit = async (productId) => {
    const itemToUpdate = items.find(i => i.product._id === productId);
    if (!itemToUpdate) return;
    const oldQty = itemToUpdate.quantity;

    if (editQuantity <= 0) { // Prevent saving 0 or negative quantity
        await handleDeleteItem(productId); // Or set a minimum quantity like 1
        return;
    }

    try {
      await updateCartItem(productId, editQuantity, oldQty);
      setItems(prevItems => prevItems.map(i => 
        i.product._id === productId ? { ...i, quantity: editQuantity } : i
      ));
      setEditingItemId(null);
      // Optionally, trigger a refresh of totals if not automatically handled
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleDeleteItem = async (productId) => {
    const itemToDelete = items.find(i => i.product._id === productId);
    if (!itemToDelete) return;
    try {
      await removeFromCart(productId, itemToDelete.quantity);
      setItems(prevItems => prevItems.filter(i => i.product._id !== productId));
      if (items.length -1 === 0) {
        // Handle empty cart scenario if needed, e.g. navigate or show message
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  // Calculate summary
  const itemsCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.product.price, 0);
  const shippingFromDeliveryOptions = items.reduce((sum, item) => {
    const option = deliveryOptions.find(o => o.id === selectedDelivery[item.product._id]);
    return sum + (option ? option.price : 0);
  }, 0);
  const taxRate = 0.1; // Assuming 10% tax rate
  const totalBeforeTax = subtotal + shippingFromDeliveryOptions;
  const tax = totalBeforeTax * taxRate;
  const total = totalBeforeTax + tax;

  const handlePlaceOrder = async () => {
    try {
      // Send the order details to the backend
      await api.post('/api/orders', {
        items: items.map(i => ({
          productId: i.product._id,
          quantity: i.quantity,
          deliveryOption: selectedDelivery[i.product._id]
        }))
      });
      // Clear the cart by removing each item sequentially to avoid version conflicts
      for (const item of items) {
        try {
          await removeFromCart(item.product._id, item.quantity);
        } catch (removeErr) {
          console.error('Error removing cart item:', removeErr);
        }
      }
      // Clear local items state
      setItems([]);
      // Finally, redirect to the thank you page
      navigate('/ecommerce/thankyou');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  if (loading) return <div>Loading checkout...</div>;
  if (error) return <div>Error: {error}</div>;
  if (items.length === 0 && !loading) return <div className="main"><div className="page-title">Your cart is empty.</div> <Link to="/ecommerce">Continue shopping</Link></div>;

  return (
    <>  
      <div className="checkout-header">
        <div className="header-content">
          <div className="checkout-header-left-section">
            <Link to="/ecommerce">
              <img className="amazon-logo" src={amazonLogo} alt="Amazon Logo" />
              <img className="amazon-mobile-logo" src={amazonMobileLogo} alt="Mobile Logo" />
            </Link>
          </div>
          <div className="checkout-header-middle-section">
            Checkout (<Link to="/ecommerce/cart" className="return-to-home-link">{itemsCount} {itemsCount === 1 ? 'item' : 'items'}</Link>)
          </div>
          <div className="checkout-header-right-section">
            <img src={checkoutLockIcon} alt="Secure Checkout" />
          </div>
        </div>
      </div>
      <div className="main">
        <div className="page-title">Review your order</div>
        <div className="checkout-grid">
          <div className="order-summary js-order-summary">
            {items.map(item => {
              const deliveryOptionDetails = deliveryOptions.find(o => o.id === selectedDelivery[item.product._id]);
              const deliveryDate = deliveryOptionDetails ? formatDate(new Date(Date.now() + deliveryOptionDetails.offset * 24 * 60 * 60 * 1000)) : 'N/A';

              return (
                <div key={item.product._id} className="cart-item-container">
                  <div className="delivery-date">Delivery date: {deliveryDate}</div>
                  <div className="cart-item-details-grid">
                    <img
                      className="product-image"
                      src={`${process.env.PUBLIC_URL}/${item.product.imageUrl}`}
                      alt={item.product.name}
                    />
                    <div className="product-details-column">
                      <div>
                        <div className="product-name">{item.product.name}</div>
                        <div className="product-price">${item.product.price.toFixed(2)}</div>
                      </div>
                      <div className="product-quantity-controls">
                        {editingItemId === item.product._id ? (
                          <>
                            <input
                              type="number"
                              min="0"
                              value={editQuantity}
                              onChange={e => setEditQuantity(Number(e.target.value))}
                            />
                            <span className="link-primary" onClick={() => handleSaveEdit(item.product._id)}>Save</span>
                            <span className="link-primary" onClick={handleCancelEdit}>Cancel</span>
                          </>
                        ) : (
                          <>
                            <span>Quantity: {item.quantity}</span>
                            <span className="link-primary" onClick={() => handleStartEdit(item.product._id, item.quantity)}>Update</span>
                            <span className="link-primary" onClick={() => handleDeleteItem(item.product._id)}>Delete</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="delivery-options">
                    <div className="delivery-options-title">Choose a delivery option:</div>
                    {deliveryOptions.map(opt => (
                      <label key={opt.id} className="delivery-option">
                        <input
                          type="radio"
                          className="delivery-option-input"
                          name={`delivery-${item.product._id}`}
                          checked={selectedDelivery[item.product._id] === opt.id}
                          onChange={() => handleDeliveryChange(item.product._id, opt.id)}
                        />
                        <div>
                          <div className="delivery-option-date">{formatDate(new Date(Date.now() + opt.offset * 24 * 60 * 60 * 1000))}</div>
                          <div className="delivery-option-price">
                            {opt.price === 0 ? 'FREE - Shipping' : `$${opt.price.toFixed(2)} - Shipping`}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="payment-summary">
            <div className="payment-summary-title">Order Summary</div>
            <div className="payment-summary-row">
              <div>Items ({itemsCount}):</div>
              <div className="payment-summary-money">${subtotal.toFixed(2)}</div>
            </div>
            <div className="payment-summary-row">
              <div>Shipping & handling:</div>
              <div className="payment-summary-money">${shippingFromDeliveryOptions.toFixed(2)}</div>
            </div>
            <div className="payment-summary-row subtotal-row">
              <div>Total before tax:</div>
              <div className="payment-summary-money">${totalBeforeTax.toFixed(2)}</div>
            </div>
            <div className="payment-summary-row">
              <div>Estimated tax ({Math.round(taxRate*100)}%):</div>
              <div className="payment-summary-money">${tax.toFixed(2)}</div>
            </div>
            <div className="payment-summary-row total-row">
              <div>Order total:</div>
              <div className="payment-summary-money">${total.toFixed(2)}</div>
            </div>
            <button className="place-order-button" onClick={handlePlaceOrder}>Place your order</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage; 