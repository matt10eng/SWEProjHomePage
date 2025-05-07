import React, { useState, useEffect } from 'react';
import { SearchContext } from './ProductList';
import api from './api';

/**
 * Provider component for sharing search state across components
 */
const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Load all products once on mount
  useEffect(() => {
    api.get('/api/products')
      .then(res => {
        setAllProducts(res.data);
      })
      .catch(err => {
        console.error('Error loading products:', err);
      });
  }, []);

  // Provide the search context values
  const contextValue = {
    // State
    searchTerm,
    searchResults,
    allProducts,
    isSearching,
    
    // Setters
    setSearchTerm,
    setSearchResults,
    setAllProducts,
    setIsSearching
  };

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchProvider; 