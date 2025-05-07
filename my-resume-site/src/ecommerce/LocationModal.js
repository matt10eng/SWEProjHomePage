import React, { useState } from 'react';
import './styles/location-modal.css';
import { saveUserLocation } from './utils/location';
import locationIcon from './images/icons/location-icon.png';

/**
 * Location selection modal
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to call when modal closes
 * @param {Object} props.currentLocation - Current location data
 * @param {Function} props.onLocationChange - Function to call when location changes
 */
const LocationModal = ({ isOpen, onClose, currentLocation, onLocationChange }) => {
  const [zipCode, setZipCode] = useState(currentLocation?.zipCode || '');
  const [city, setCity] = useState(currentLocation?.city || '');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!zipCode.trim() || !city.trim()) {
      setError('Please fill in all fields');
      return;
    }
    
    // Save the new location
    const newLocation = { city, zipCode };
    saveUserLocation(newLocation);
    
    // Notify parent component
    if (onLocationChange) {
      onLocationChange(newLocation);
    }
    
    // Close the modal
    onClose();
  };

  return (
    <div className="location-modal-overlay" onClick={onClose}>
      <div className="location-modal" onClick={e => e.stopPropagation()}>
        <div className="location-modal-header">
          <h2>Choose your location</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="location-modal-body">
          <div className="location-icon-container">
          </div>
          
          <p>Enter your address to see availability, delivery options and more</p>
          
          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter your city"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="zipCode">ZIP Code</label>
              <input
                type="text"
                id="zipCode"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="Enter your ZIP code"
              />
            </div>
            
            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="apply-button">
                Apply
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LocationModal; 