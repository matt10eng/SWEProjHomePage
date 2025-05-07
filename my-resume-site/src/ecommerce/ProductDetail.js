import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from './api';
import { useAuth } from './AuthContext';
import './Ecommerce.css';
import './styles/amazon.css';
import { useCart } from './CartContext';
import checkmarkIcon from './images/icons/checkmark.png';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const addedTimer = useRef(null);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    try {
      if (!isAuthenticated) {
        navigate('/ecommerce/auth/login');
        return;
      }
      await addToCart(id, quantity);
      setAdded(true);
      if (addedTimer.current) clearTimeout(addedTimer.current);
      addedTimer.current = setTimeout(() => setAdded(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  if (loading) return <div>Loading product...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="product-detail">
      <img src={`${process.env.PUBLIC_URL}/${product.imageUrl}`} alt={product.name} className="product-image-large" />
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>Price: ${product.price.toFixed(2)}</p>
      <div className="add-cart">
        <label>
          Quantity:
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={e => setQuantity(parseInt(e.target.value, 10))}
          />
        </label>
        <div className={`added-to-cart ${added ? 'added-to-cart-visible' : ''}`}>
          <img src={checkmarkIcon} alt="Added" /> Added
        </div>
        <button className="add-to-cart-button" onClick={handleAddToCart}>Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductDetail; 