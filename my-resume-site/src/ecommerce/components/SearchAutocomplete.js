import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/search-autocomplete.css';

/**
 * Search autocomplete dropdown component
 * 
 * @param {Object} props
 * @param {Array} props.results - Search results to display
 * @param {Function} props.onSelect - Function to call when an item is selected
 * @param {boolean} props.loading - Whether search is in progress
 * @param {string} props.query - Current search query
 * @param {Function} props.onViewAllResults - Function to call to view all results
 */
const SearchAutocomplete = ({ results, onSelect, loading, query, onViewAllResults }) => {
  const navigate = useNavigate();

  // If there's no query, don't show the dropdown
  if (!query.trim()) {
    return null;
  }

  // Handle click on a search result
  const handleResultClick = (productId) => {
    navigate(`/ecommerce/products/${productId}`);
    if (onSelect) {
      onSelect();
    }
  };

  // Handle view all results button
  const handleViewAll = (e) => {
    e.preventDefault();
    if (onViewAllResults) {
      onViewAllResults();
    }
  };

  return (
    <div className="search-autocomplete">
      {loading ? (
        <div className="autocomplete-loading">
          <div className="loading-spinner"></div>
          <span>Searching...</span>
        </div>
      ) : results.length > 0 ? (
        <>
          <ul className="autocomplete-results">
            {results.slice(0, 5).map(product => (
              <li 
                key={product._id} 
                className="autocomplete-result-item"
                onClick={() => handleResultClick(product._id)}
              >
                <div className="result-image">
                  <img 
                    src={`${process.env.PUBLIC_URL}/${product.imageUrl}`} 
                    alt={product.name} 
                  />
                </div>
                <div className="result-info">
                  <div className="result-name">{product.name}</div>
                  <div className="result-price">${product.price.toFixed(2)}</div>
                </div>
              </li>
            ))}
          </ul>
          
          <div className="autocomplete-footer">
            <button 
              className="view-all-results" 
              onClick={handleViewAll}
            >
              See all results for "{query}" ({results.length})
            </button>
          </div>
        </>
      ) : (
        <div className="no-results">
          <p>No products found for "{query}"</p>
          <p className="no-results-suggestion">Try a different search term</p>
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete; 