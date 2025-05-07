import React from 'react';
import { Link } from 'react-router-dom';
import './styles/tracking.css';

const TrackingPage = () => (
  <div className="main">
    <Link to="/ecommerce/orders" className="back-to-orders-link link-primary">
      View all orders
    </Link>

    <div className="delivery-date">
      Arriving on Monday, June 13
    </div>

    <div className="product-info">
      Black and Gray Athletic Cotton Socks - 6 Pairs
    </div>

    <div className="product-info">
      Quantity: 1
    </div>

    <img className="product-image" src="/ecommerce/images/products/athletic-cotton-socks-6-pairs.jpg" alt="Product" />

    <div className="progress-labels-container">
      <div className="progress-label">Preparing</div>
      <div className="progress-label current-status">Shipped</div>
      <div className="progress-label">Delivered</div>
    </div>

    <div className="progress-bar-container">
      <div className="progress-bar"></div>
    </div>
  </div>
);

export default TrackingPage; 