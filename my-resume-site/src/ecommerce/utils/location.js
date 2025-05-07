/**
 * Utility functions for handling delivery location
 */

// Default location
const defaultLocation = {
  city: "West Orange",
  zipCode: "07052"
};

/**
 * Get the user's saved location or return default
 * @returns {Object} The location object with city and zipCode
 */
export const getUserLocation = () => {
  try {
    const savedLocation = localStorage.getItem('deliveryLocation');
    if (savedLocation) {
      return JSON.parse(savedLocation);
    }
  } catch (err) {
    console.error('Error retrieving location:', err);
  }
  return defaultLocation;
};

/**
 * Save a new delivery location
 * @param {Object} location - Location object with city and zipCode
 */
export const saveUserLocation = (location) => {
  try {
    localStorage.setItem('deliveryLocation', JSON.stringify(location));
    return true;
  } catch (err) {
    console.error('Error saving location:', err);
    return false;
  }
};

/**
 * Clear the saved delivery location
 */
export const clearUserLocation = () => {
  try {
    localStorage.removeItem('deliveryLocation');
    return true;
  } catch (err) {
    console.error('Error clearing location:', err);
    return false;
  }
}; 