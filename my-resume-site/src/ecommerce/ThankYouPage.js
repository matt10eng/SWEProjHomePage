import React from 'react';
import { Link } from 'react-router-dom';
import './styles/checkout.css';

const ThankYouPage = () => (
  <div className="main" style={{ marginTop: '140px', textAlign: 'center' }}>
    <h1 style={{ marginBottom: '24px' }}>Thank You for Your Purchase!</h1>
    <p style={{ marginBottom: '24px', fontSize: '1.1rem' }}>
      Your order is confirmed. You'll receive an email summary shortly.
    </p>
    <Link
      to="/ecommerce"
      className="place-order-button"
      style={{ display: 'inline-block', marginTop: '16px' }}
    >
      Continue Shopping
    </Link>
  </div>
);

export default ThankYouPage; 