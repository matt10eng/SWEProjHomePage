import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
// import './Ecommerce.css'; // removed to avoid conflicting header styles
import './styles/amazon-header.css';
import logoWhite from './images/amazon-logo-white.png';
import mobileLogoWhite from './images/amazon-mobile-logo-white.png';
import searchIcon from './images/icons/search-icon.png';
import cartIcon from './images/icons/cart-icon.png';
import locationIcon from './images/icons/location-icon.png';
import MenuIcon from './components/MenuIcon';
import HamburgerMenu from './components/HamburgerMenu';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';
import { getUserLocation } from './utils/location';
import LocationModal from './LocationModal';
import SearchAutocomplete from './SearchAutocomplete';
import { useSearch } from './ProductList';
import api from './api';

const AmazonHeader = () => {
  const { cartCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [location, setLocation] = useState(getUserLocation());
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [useBackupMenu, setUseBackupMenu] = useState(false);
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  // Get search context
  const { 
    searchTerm, setSearchTerm,
    searchResults, setSearchResults,
    allProducts, setAllProducts,
    isSearching, setIsSearching
  } = useSearch();
  
  // Local state for dropdown visibility
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const searchTimeout = useRef(null);
  const searchRef = useRef(null);
  
  // Initialize search term from URL when on search page
  useEffect(() => {
    if (pathname === '/ecommerce/search') {
      const searchParams = new URLSearchParams(search);
      const queryParam = searchParams.get('query') || '';
      
      // Only set the search term from URL on initial load or direct navigation,
      // not when typing in the search bar while on the search page
      if (queryParam !== searchTerm && !searchRef.current?.contains(document.activeElement)) {
        setSearchTerm(queryParam);
      }
    }
  }, [pathname, search, setSearchTerm, searchTerm]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Debounced search functionality
  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
    
    // Always show autocomplete dropdown when focus is on search bar
    // Even with empty search to show all products
    setShowAutocomplete(true);
    
    // If search term becomes empty and we're on the search results page,
    // we don't redirect automatically, user needs to press Enter
  };

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    
    // Clear any pending timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    // Navigate to search results page even with empty search term
    // Empty search will show all products
    navigate(`/ecommerce/search?query=${encodeURIComponent(searchTerm.trim())}`);
    
    // Hide autocomplete
    setShowAutocomplete(false);
    
    // If mobile menu is open, close it
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  // Handle clicks outside the search autocomplete
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showAutocomplete &&
        searchRef.current && 
        !searchRef.current.contains(event.target)
      ) {
        setShowAutocomplete(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAutocomplete]);

  // Debounce search input changes
  useEffect(() => {
    // If search term is empty, show all products
    if (!searchTerm.trim()) {
      setSearchResults(allProducts);
      setIsSearching(false);
      return;
    }
    
    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    setIsSearching(true);
    
    // Set new timeout for debounce
    searchTimeout.current = setTimeout(() => {
      // We only update URL when the user presses enter now (handled in handleSearchSubmit)
      // This prevents the URL from constantly changing as the user types
      
      // If we have all products loaded, do client-side filtering
      if (allProducts.length > 0) {
        const query = searchTerm.trim().toLowerCase();
        const filtered = allProducts.filter(product => 
          product.name.toLowerCase().includes(query) || 
          (product.description && product.description.toLowerCase().includes(query))
        );
        setSearchResults(filtered);
        setIsSearching(false);
      } 
      // Otherwise, fetch from API - only do this once per search term
      else {
        // Use a stable key for this search to avoid duplicate requests
        const searchKey = searchTerm.trim().toLowerCase();
        const lastSearchKey = searchRef.current?.dataset?.lastSearchKey;
        
        if (searchKey !== lastSearchKey) {
          if (searchRef.current) {
            searchRef.current.dataset.lastSearchKey = searchKey;
          }
          
          api.get(`/api/products/search?query=${encodeURIComponent(searchTerm.trim())}`)
            .then(res => {
              setSearchResults(res.data);
            })
            .catch(error => {
              console.error('Search error:', error);
              setSearchResults([]);
            })
            .finally(() => {
              setIsSearching(false);
            });
        } else {
          // We've already searched for this term, just stop loading
          setIsSearching(false);
        }
      }
    }, 300); // 300ms debounce - faster for a better user experience
    
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchTerm, allProducts, setSearchResults, setIsSearching]);

  // Handle result click
  const handleResultClick = () => {
    setShowAutocomplete(false);
  };

  // Handle search focus
  const handleSearchFocus = () => {
    // Always show dropdown on focus
    setShowAutocomplete(true);
  };

  // Handle search blur - update URL if on search page and search term changed
  const handleSearchBlur = () => {
    // Hide the autocomplete dropdown
    setShowAutocomplete(false);
    
    // If we're on the search page and the search term has changed from the URL
    if (pathname === '/ecommerce/search') {
      const searchParams = new URLSearchParams(search);
      const queryParam = searchParams.get('query') || '';
      
      // If the search term has changed, update the URL
      if (searchTerm.trim() !== queryParam) {
        navigate(`/ecommerce/search?query=${encodeURIComponent(searchTerm.trim())}`, { replace: true });
      }
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Handle location click - open the location modal
  const handleLocationClick = (e) => {
    e.preventDefault();
    setIsLocationModalOpen(true);
    // Close mobile menu if open
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  // Handle location change
  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
  };

  // Handle SVG error
  useEffect(() => {
    // Check if SVGs are supported in this browser
    try {
      const svgTest = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      if (!svgTest || typeof svgTest.createSVGRect !== 'function') {
        setUseBackupMenu(true);
      }
    } catch (e) {
      setUseBackupMenu(true);
    }
  }, []);

  return (
    <>
      <div className="amazon-header">
        {/* Only show this button on mobile */}
        {windowWidth <= 768 && (
          <button 
            className={`mobile-menu-button ${isMobileMenuOpen ? 'menu-open' : ''}`} 
            onClick={toggleMobileMenu} 
            aria-label="Menu"
            aria-expanded={isMobileMenuOpen}
          >
            {useBackupMenu ? <HamburgerMenu /> : <MenuIcon color="white" size={24} />}
            <span className="sr-only">Menu</span>
          </button>
        )}

        <div className="amazon-header-left-section">
          <Link to="/ecommerce" className="header-link">
            <img className="amazon-logo" src={logoWhite} alt="Amazon Logo" />
            <img className="amazon-mobile-logo" src={mobileLogoWhite} alt="Mobile Logo" />
          </Link>

          {windowWidth > 576 && (
            <Link to="#" className="location-link header-link" onClick={handleLocationClick}>
              <img src={locationIcon} alt="Location" className="location-icon" />
              <div className="location-text">
                <span className="deliver-to-text">Deliver to</span>
                <span className="location-name" title={`${location.city} ${location.zipCode}`}>
                  {location.city} {location.zipCode}
                </span>
              </div>
            </Link>
          )}
        </div>
        
        <div className="amazon-header-middle-section" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input 
              className="search-bar" 
              type="text" 
              placeholder="Search" 
              value={searchTerm}
              onChange={handleSearchInputChange}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              aria-label="Search products"
            />
            <button type="submit" className="search-button" aria-label="Submit search">
              <img className="search-icon" src={searchIcon} alt="Search" />
            </button>
            
            <SearchAutocomplete
              results={searchResults}
              loading={isSearching}
              searchTerm={searchTerm}
              onResultClick={handleResultClick}
              show={showAutocomplete}
            />
          </form>
        </div>

        <div className={`amazon-header-right-section ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
          {windowWidth <= 576 && (
            <div className="mobile-location-container">
              <Link to="#" className="location-link header-link" onClick={handleLocationClick}>
                <img src={locationIcon} alt="Location" className="location-icon" />
                <div className="location-text">
                  <span className="deliver-to-text">Deliver to</span>
                  <span className="location-name" title={`${location.city} ${location.zipCode}`}>
                    {location.city} {location.zipCode}
                  </span>
                </div>
              </Link>
            </div>
          )}

          {/* Mobile search box that only appears in the mobile menu */}
          {isMobileMenuOpen && windowWidth <= 576 && (
            <div className="mobile-search-container">
              <form onSubmit={handleSearchSubmit} className="mobile-search-form">
                <input 
                  className="mobile-search-bar" 
                  type="text" 
                  placeholder="Search Amazon" 
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  aria-label="Search products"
                />
                <button type="submit" className="mobile-search-button" aria-label="Submit search">
                  <img className="search-icon" src={searchIcon} alt="Search" />
                </button>
              </form>
            </div>
          )}

          {/* Primary navigation links */}
          <div className="nav-section">
            <Link
              to={isAuthenticated ? "/" : "/ecommerce/auth/login"}
              className="orders-link header-link"
              onClick={e => {
                if (isAuthenticated) {
                  e.preventDefault();
                  logout();
                }
              }}
            >
              <span className="returns-text">
                Hello{isAuthenticated && user ? `, ${user.username}` : ''}
              </span>
              <span className="orders-text">
                {isAuthenticated ? 'Sign out' : 'Sign in'}
              </span>
            </Link>
            <Link 
              to={isAuthenticated ? "/ecommerce/orders" : "/ecommerce/auth/login"} 
              className="orders-link header-link">
              <span className="returns-text">Returns</span>
              <span className="orders-text">& Orders</span>
            </Link>
          </div>
          
          {/* Always visible cart link */}
          <Link to="/ecommerce/cart" className="cart-link header-link">
            <div className="cart-icon-container">
              <img className="cart-icon" src={cartIcon} alt="Cart" />
              <div className="cart-quantity">{cartCount}</div>
            </div>
            <div className="cart-text">Cart</div>
          </Link>
        </div>
      </div>

      {/* Location Modal */}
      <LocationModal 
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={location}
        onLocationChange={handleLocationChange}
      />
    </>
  );
};

export default AmazonHeader; 