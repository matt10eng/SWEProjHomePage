import React, { useEffect, useState } from 'react';
import api from './api';
import { Link } from 'react-router-dom';
import './Ecommerce.css';
import './styles/orders.css';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/api/orders')
      .then(res => setOrders(res.data))
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!orders.length) return <div>No orders found. <Link to="/ecommerce">Shop now</Link></div>;

  return (
    <div className="main orders-grid">
      <div className="page-title">Your Orders</div>
      {orders.map(order => (
        <div key={order._id} className="order-container">
          <Link to={`/ecommerce/orders/${order._id}`}> 
            <div className="order-header">
              <div className="order-header-left-section">
                <div className="order-date">
                  <div className="order-header-label">Date:</div>
                  <div>{new Date(order.createdAt).toLocaleString()}</div>
                </div>
                <div className="order-total">
                  <div className="order-header-label">Total:</div>
                  <div>${order.total.toFixed(2)}</div>
                </div>
              </div>
              <div className="order-header-right-section">
                <div className="order-header-label">Order ID:</div>
                <div>{order._id}</div>
              </div>
            </div>
          </Link>
          {/* Order details grid would go here if needed */}
        </div>
      ))}
    </div>
  );
};

export default OrdersList; 