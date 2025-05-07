import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/search-autocomplete.css';

/**
 * SearchAutocomplete component displays search suggestions as the user types
 * 
 * @param {Object} props
 * @param {Array} props.results - Search results to display
 * @param {boolean} props.loading - Whether search is in progress
 * @param {string} props.searchTerm - Current search term
 * @param {Function} props.onResultClick - Function to call when a result is clicked
 * @param {boolean} props.show - Whether to show the autocomplete dropdown
 */
const SearchAutocomplete = ({ 
  results, 
  loading, 
  searchTerm, 
  onResultClick, 
  show 
}) => {
  const navigate = useNavigate();

  // Don't show dropdown if explicitly hidden
  if (!show) {
    return null;
  }

  // Check if we have a valid search term and should display no results message
  const hasSearchTerm = searchTerm && searchTerm.trim().length > 0;
  const showNoResults = hasSearchTerm && !loading && results.length === 0;
  
  // If no search term and no results and not loading, don't show dropdown
  if (!hasSearchTerm && results.length === 0 && !loading) {
    return null;
  }

  // Handle product click navigation
  const handleProductClick = (productId, e) => {
    e.preventDefault(); // Prevent default Link behavior
    
    // Call the onResultClick callback to close the dropdown
    if (onResultClick) {
      onResultClick();
    }
    
    // Use navigate to go to the product page
    navigate(`/ecommerce/products/${productId}`);
  };
  
  // Handle "See all results" click
  const handleSeeAllClick = (e) => {
    e.preventDefault(); // Prevent default Link behavior
    
    // Call the onResultClick callback to close the dropdown
    if (onResultClick) {
      onResultClick();
    }
    
    // Navigate to search results page
    navigate(`/ecommerce/search?query=${encodeURIComponent(searchTerm.trim())}`);
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
              <li key={product._id} className="autocomplete-result-item">
                <a 
                  href={`/ecommerce/products/${product._id}`}
                  onClick={(e) => handleProductClick(product._id, e)}
                  className="result-link"
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
                </a>
              </li>
            ))}
          </ul>
          
          <div className="autocomplete-footer">
            <a 
              href={`/ecommerce/search?query=${encodeURIComponent(searchTerm.trim())}`}
              className="view-all-results"
              onClick={handleSeeAllClick}
            >
              {searchTerm.trim() ? 
                `See all results for "${searchTerm}" (${results.length})` : 
                `See all products (${results.length})`
              }
            </a>
          </div>
        </>
      ) : showNoResults ? (
        <div className="no-results">
          <p>No products found for "{searchTerm}"</p>
          <p className="no-results-suggestion">Try a different search term</p>
        </div>
      ) : null}
    </div>
  );
};

export default SearchAutocomplete; 