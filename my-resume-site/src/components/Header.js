import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="profile-img">
            <span className="initials">ME</span>
          </div>
          <h1>Matthew Eng</h1>
          <p>Software Engineer</p>
        </div>
      </div>
    </header>
  );
};

export default Header; 