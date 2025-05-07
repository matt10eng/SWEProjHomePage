import React from 'react';
import { Link } from 'react-router-dom';
// import './Ecommerce.css'; // removed to avoid conflicting header styles
import './styles/amazon-header.css';
import logoWhite from './images/amazon-logo-white.png';
import mobileLogoWhite from './images/amazon-mobile-logo-white.png';
import searchIcon from './images/icons/search-icon.png';
import cartIcon from './images/icons/cart-icon.png';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';

const AmazonHeader = () => {
  const { cartCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  return (
    <div className="amazon-header">
      <div className="amazon-header-left-section">
        <Link to="/ecommerce" className="header-link">
          <img className="amazon-logo" src={logoWhite} alt="Amazon Logo" />
          <img className="amazon-mobile-logo" src={mobileLogoWhite} alt="Mobile Logo" />
        </Link>
      </div>
      <div className="amazon-header-middle-section">
        <input className="search-bar" type="text" placeholder="Search" />
        <button className="search-button">
          <img className="search-icon" src={searchIcon} alt="Search" />
        </button>
      </div>
      <div className="amazon-header-right-section">
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
        <Link to="/ecommerce/orders" className="orders-link header-link">
          <span className="returns-text">Returns</span>
          <span className="orders-text">& Orders</span>
        </Link>
        <Link to="/ecommerce/cart" className="cart-link header-link">
          <img className="cart-icon" src={cartIcon} alt="Cart" />
          <div className="cart-quantity">{cartCount}</div>
          <div className="cart-text">Cart</div>
        </Link>
      </div>
    </div>
  );
};

export default AmazonHeader; 