import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from './api';
import './Ecommerce.css';
import './styles/orders.css';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/api/orders/${id}`)
      .then(res => setOrder(res.data))
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading order...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="main">
      <div className="page-title">Order Details</div>
      <p><strong>Order ID:</strong> {order._id}</p>
      <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
      <p><strong>Shipping Option:</strong> {order.shippingOption}</p>
      <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
      <h3>Items:</h3>
      <ul>
        {order.items.map(item => (
          <li key={item.product._id} className="order-item">
            {item.product.name} x {item.quantity} @ ${item.product.price.toFixed(2)}
          </li>
        ))}
      </ul>
      <Link to="/ecommerce/orders">Back to Orders</Link>
    </div>
  );
};

export default OrderDetail; 