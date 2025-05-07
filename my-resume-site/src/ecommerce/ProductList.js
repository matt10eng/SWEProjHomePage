import React, { useEffect, useState, useRef } from 'react';
import api from './api';
import { Link } from 'react-router-dom';
import './Ecommerce.css';
import './styles/amazon.css';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';
import rating0 from './images/ratings/rating-0.png';
import rating05 from './images/ratings/rating-05.png';
import rating10 from './images/ratings/rating-10.png';
import rating15 from './images/ratings/rating-15.png';
import rating20 from './images/ratings/rating-20.png';
import rating25 from './images/ratings/rating-25.png';
import rating30 from './images/ratings/rating-30.png';
import rating35 from './images/ratings/rating-35.png';
import rating40 from './images/ratings/rating-40.png';
import rating45 from './images/ratings/rating-45.png';
import rating50 from './images/ratings/rating-50.png';
import checkmarkIcon from './images/icons/checkmark.png';

const ProductList = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [addedMap, setAddedMap] = useState({});
  const addedTimers = useRef({});
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/api/products')
      .then(res => {
        setProducts(res.data);
        // init quantities to 1
        const init = {};
        res.data.forEach(p => { init[p._id] = 1; });
        setQuantities(init);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleQuantityChange = (id, value) => {
    setQuantities(q => ({ ...q, [id]: Number(value) }));
  };

  const handleAddToCart = async (id) => {
    if (!isAuthenticated) {
      return navigate('/ecommerce/auth/login');
    }
    try {
      await addToCart(id, quantities[id]);
      // show feedback and reset fade timer
      setAddedMap(m => ({ ...m, [id]: true }));
      if (addedTimers.current[id]) clearTimeout(addedTimers.current[id]);
      addedTimers.current[id] = setTimeout(() => {
        setAddedMap(m => ({ ...m, [id]: false }));
      }, 3000);
      // Keep the user on the page; cart count will update
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    }
  };

  // Map of rating stars to icons
  const ratingMap = {
    0: rating0,
    5: rating05,
    10: rating10,
    15: rating15,
    20: rating20,
    25: rating25,
    30: rating30,
    35: rating35,
    40: rating40,
    45: rating45,
    50: rating50
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="products-grid">
      {products.map(product => (
        <div key={product._id} className="product-container">
          <Link to={`products/${product._id}`}> 
            <div className="product-image-container">
              <img src={`${process.env.PUBLIC_URL}/${product.imageUrl}`} alt={product.name} className="product-image" />
            </div>
            <div className="product-name">{product.name}</div>
            {/* Safely compute and display rating */}
            {(() => {
              const stars = product.rating?.stars || 0;
              const count = product.rating?.count || 0;
              const key = Math.round(stars * 10);
              return (
                <div className="product-rating-container">
                  <img
                    className="product-rating-stars"
                    src={ratingMap[key] || rating0}
                    alt={`${stars} stars`}
                  />
                  <span className="product-rating-count">{count}</span>
                </div>
              );
            })()}
            <div className="product-price">${product.price.toFixed(2)}</div>
          </Link>
          <div className="product-actions">
            <select
              value={quantities[product._id]}
              onChange={e => handleQuantityChange(product._id, e.target.value)}
            >
              {[1,2,3,4,5,10,20].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <div className={`added-to-cart ${addedMap[product._id] ? 'added-to-cart-visible' : ''}`}>
              <img src={checkmarkIcon} alt="Added" /> Added
            </div>
            <button
              className="add-to-cart-button"
              onClick={() => handleAddToCart(product._id)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList; 