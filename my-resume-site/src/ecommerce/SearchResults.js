import React, { useEffect, useState, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import api from './api';
import './styles/amazon.css';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import { useSearch } from './ProductList';
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

const SearchResults = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const queryParam = searchParams.get('query') || '';
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [addedMap, setAddedMap] = useState({});
  const addedTimers = useRef({});
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Use the search context
  const { 
    searchTerm, setSearchTerm,
    searchResults, setSearchResults,
    allProducts, setIsSearching, setAllProducts 
  } = useSearch();
  
  // Track if this is the initial load
  const isInitialLoad = useRef(true);
  // Track previous query param to detect direct navigation changes
  const prevQueryParam = useRef(queryParam);
  
  // Set search term from URL query parameter on initial load or when URL changes through navigation
  useEffect(() => {
    // On initial load, always set the search term from the URL
    if (isInitialLoad.current) {
      setSearchTerm(queryParam);
      isInitialLoad.current = false;
      prevQueryParam.current = queryParam;
    } 
    // If the URL query param changes and it wasn't from typing in the search bar
    // (it was from direct navigation), update the search term
    else if (queryParam !== prevQueryParam.current) {
      setSearchTerm(queryParam);
      prevQueryParam.current = queryParam;
    }
  }, [queryParam, setSearchTerm]);
  
  // Use searchResults from context
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    setLoading(true);
    // If we have a search term, use the search results
    if (searchTerm.trim() && searchResults.length > 0) {
      setProducts(searchResults);
      setLoading(false);
    } 
    // If no search term, show all products
    else if (!searchTerm.trim() && allProducts.length > 0) {
      setProducts(allProducts);
      setLoading(false);
    }
    // Otherwise, fetch the data
    else {
      fetchSearchResults(queryParam);
    }
  }, [searchTerm, searchResults, allProducts, queryParam]);
  
  // Fetch search results from API - fallback if context doesn't have data
  const fetchSearchResults = async (query) => {
    setIsSearching(true);
    try {
      let response;
      if (!query.trim()) {
        // If query is empty, fetch all products
        response = await api.get('/api/products');
      } else {
        // Otherwise, search with the query
        response = await api.get(`/api/products/search?query=${encodeURIComponent(query)}`);
      }
      
      const productData = response.data;
      setProducts(productData);
      
      // Store in context for other components
      if (!query.trim()) {
        // If this was a request for all products, also update allProducts
        setAllProducts(productData);
      } else {
        // If it was a search query, update searchResults
        setSearchResults(productData);
      }
      
      // Initialize quantities for all products if they don't already exist
      if (productData.length > 0) {
        setQuantities(prevQuantities => {
          const newQuantities = { ...prevQuantities };
          productData.forEach(product => {
            if (!newQuantities[product._id]) {
              newQuantities[product._id] = 1;
            }
          });
          return newQuantities;
        });
      }
    } catch (err) {
      console.error('Error fetching search results:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  const handleQuantityChange = (id, value) => {
    setQuantities(q => ({ ...q, [id]: Number(value) }));
  };

  const handleAddToCart = async (id) => {
    if (!isAuthenticated) {
      return navigate('/ecommerce/auth/login');
    }
    try {
      console.log('Adding product to cart with ID:', id, 'and quantity:', quantities[id]);
      
      // Make sure we have a valid product ID and quantity
      if (!id || !quantities[id]) {
        setError('Invalid product ID or quantity');
        return;
      }
      
      await addToCart(id, quantities[id]);
      
      // show feedback and reset fade timer
      setAddedMap(m => ({ ...m, [id]: true }));
      if (addedTimers.current[id]) clearTimeout(addedTimers.current[id]);
      addedTimers.current[id] = setTimeout(() => {
        setAddedMap(m => ({ ...m, [id]: false }));
      }, 3000);
      // Keep the user on the page; cart count will update
    } catch (e) {
      console.error('Error adding to cart:', e);
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

  // Initialize quantities when product data changes
  useEffect(() => {
    if (products.length > 0) {
      // Initialize quantities for any new products
      const newQuantities = { ...quantities };
      let updated = false;
      
      products.forEach(product => {
        if (!newQuantities[product._id]) {
          newQuantities[product._id] = 1;
          updated = true;
        }
      });
      
      // Only update state if we actually added new quantities
      if (updated) {
        setQuantities(newQuantities);
      }
    }
  }, [products]);

  return (
    <div className="search-results-container">
      {loading ? (
        <div className="loading">Searching for products...</div>
      ) : error ? (
        <div className="error">Error: {error}</div>
      ) : products.length === 0 ? (
        <div className="search-results-header">
          <h1>No results found for "{queryParam}"</h1>
          <p>Try checking your spelling or use more general terms</p>
        </div>
      ) : (
        <>
          <div className="search-results-header">
            <h1>{queryParam.trim() ? `Results for "${queryParam}"` : "All Products"}</h1>
            <p>{products.length} products found</p>
          </div>
          
          <div className="products-grid search-results-grid">
            {products.map(product => (
              <div key={product._id} className="product-container">
                <Link to={`/ecommerce/products/${product._id}`}> 
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
        </>
      )}
    </div>
  );
};

export default SearchResults; 