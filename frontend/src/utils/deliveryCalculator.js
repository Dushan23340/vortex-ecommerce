// Sri Lanka Delivery Fee Calculator
// Based on Sri Lanka Post zones and private courier services

// Sri Lankan districts organized by postal zones
export const sriLankanDistricts = {
  // Western Province (Zone 1 - Colombo Metro)
  'Colombo': { zone: 1, province: 'Western' },
  'Gampaha': { zone: 1, province: 'Western' },
  'Kalutara': { zone: 2, province: 'Western' },
  
  // Central Province
  'Kandy': { zone: 2, province: 'Central' },
  'Matale': { zone: 3, province: 'Central' },
  'Nuwara Eliya': { zone: 3, province: 'Central' },
  
  // Southern Province
  'Galle': { zone: 2, province: 'Southern' },
  'Matara': { zone: 3, province: 'Southern' },
  'Hambantota': { zone: 3, province: 'Southern' },
  
  // North Western Province
  'Kurunegala': { zone: 2, province: 'North Western' },
  'Puttalam': { zone: 3, province: 'North Western' },
  
  // North Central Province
  'Anuradhapura': { zone: 3, province: 'North Central' },
  'Polonnaruwa': { zone: 3, province: 'North Central' },
  
  // Uva Province
  'Badulla': { zone: 3, province: 'Uva' },
  'Monaragala': { zone: 4, province: 'Uva' },
  
  // Sabaragamuwa Province
  'Ratnapura': { zone: 2, province: 'Sabaragamuwa' },
  'Kegalle': { zone: 2, province: 'Sabaragamuwa' },
  
  // Northern Province
  'Jaffna': { zone: 4, province: 'Northern' },
  'Mannar': { zone: 4, province: 'Northern' },
  'Vavuniya': { zone: 4, province: 'Northern' },
  'Mullaitivu': { zone: 4, province: 'Northern' },
  'Kilinochchi': { zone: 4, province: 'Northern' },
  
  // Eastern Province
  'Batticaloa': { zone: 4, province: 'Eastern' },
  'Ampara': { zone: 4, province: 'Eastern' },
  'Trincomalee': { zone: 3, province: 'Eastern' }
};

// Major cities with special rates (within districts)
export const majorCities = {
  // Colombo District
  'Colombo': { zone: 1, type: 'metro' },
  'Dehiwala': { zone: 1, type: 'metro' },
  'Mount Lavinia': { zone: 1, type: 'metro' },
  'Moratuwa': { zone: 1, type: 'metro' },
  'Sri Jayawardenepura Kotte': { zone: 1, type: 'metro' },
  'Maharagama': { zone: 1, type: 'metro' },
  'Kesbewa': { zone: 1, type: 'metro' },
  'Homagama': { zone: 1, type: 'metro' },
  
  // Gampaha District
  'Negombo': { zone: 1, type: 'city' },
  'Gampaha': { zone: 1, type: 'city' },
  'Ja-Ela': { zone: 1, type: 'city' },
  'Wattala': { zone: 1, type: 'city' },
  'Kelaniya': { zone: 1, type: 'city' },
  'Kadawatha': { zone: 1, type: 'city' },
  
  // Other major cities
  'Kandy': { zone: 2, type: 'city' },
  'Galle': { zone: 2, type: 'city' },
  'Matara': { zone: 3, type: 'city' },
  'Jaffna': { zone: 4, type: 'city' },
  'Batticaloa': { zone: 4, type: 'city' },
  'Kurunegala': { zone: 2, type: 'city' },
  'Anuradhapura': { zone: 3, type: 'city' },
  'Ratnapura': { zone: 2, type: 'city' }
};

// Delivery service types and their pricing structure
export const deliveryServices = {
  standard: {
    name: 'Standard Delivery',
    description: '3-5 working days',
    rates: {
      1: 250, // Colombo Metro
      2: 350, // Major cities nearby
      3: 450, // Other districts
      4: 550  // Remote areas
    },
    freeThreshold: 5000 // Free delivery above Rs. 5000
  },
  express: {
    name: 'Express Delivery',
    description: '1-2 working days',
    rates: {
      1: 500, // Colombo Metro
      2: 650, // Major cities nearby
      3: 800, // Other districts
      4: 1000 // Remote areas
    },
    freeThreshold: 8000 // Free express delivery above Rs. 8000
  },
  sameDay: {
    name: 'Same Day Delivery',
    description: 'Same day (Colombo only)',
    rates: {
      1: 800, // Colombo Metro only
      2: null, // Not available
      3: null, // Not available
      4: null  // Not available
    },
    freeThreshold: 15000, // Free same day delivery above Rs. 15000
    availability: ['Colombo'] // Only available in Colombo district
  }
};

/**
 * Calculate delivery fee based on location and cart amount
 * @param {string} district - District name
 * @param {string} city - City name (optional)
 * @param {number} cartAmount - Total cart amount
 * @param {string} serviceType - Delivery service type ('standard', 'express', 'sameDay')
 * @returns {Object} Delivery calculation result
 */
export const calculateDeliveryFee = (district, city = '', cartAmount = 0, serviceType = 'standard') => {
  try {
    // Normalize inputs
    const normalizedDistrict = district?.trim();
    const normalizedCity = city?.trim();
    const service = deliveryServices[serviceType];
    
    if (!service) {
      throw new Error('Invalid service type');
    }
    
    if (!normalizedDistrict) {
      throw new Error('District is required');
    }

    // Get zone information
    let zone = 4; // Default to highest zone for unknown areas
    let locationInfo = null;

    // Check if it's a major city first
    if (normalizedCity && majorCities[normalizedCity]) {
      locationInfo = majorCities[normalizedCity];
      zone = locationInfo.zone;
    } 
    // Otherwise check district
    else if (sriLankanDistricts[normalizedDistrict]) {
      locationInfo = sriLankanDistricts[normalizedDistrict];
      zone = locationInfo.zone;
    }

    // Check service availability for same day delivery
    if (serviceType === 'sameDay' && !service.availability?.includes(normalizedDistrict)) {
      return {
        success: false,
        error: 'Same day delivery is only available in Colombo district',
        availableServices: ['standard', 'express']
      };
    }

    // Get base delivery fee for the zone
    const baseFee = service.rates[zone];
    
    if (baseFee === null || baseFee === undefined) {
      return {
        success: false,
        error: `${service.name} is not available for this location`,
        availableServices: getAvailableServices(normalizedDistrict, normalizedCity)
      };
    }

    // Check for free delivery
    const isFreeDelivery = cartAmount >= service.freeThreshold;
    const finalFee = isFreeDelivery ? 0 : baseFee;

    // Calculate estimated delivery days
    const estimatedDays = getEstimatedDeliveryDays(zone, serviceType);

    return {
      success: true,
      zone,
      district: normalizedDistrict,
      city: normalizedCity,
      serviceType,
      serviceName: service.name,
      serviceDescription: service.description,
      baseFee,
      finalFee,
      isFreeDelivery,
      freeDeliveryThreshold: service.freeThreshold,
      estimatedDays,
      locationInfo
    };

  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get available delivery services for a location
 * @param {string} district - District name
 * @param {string} city - City name
 * @returns {Array} Available service types
 */
export const getAvailableServices = (district, city = '') => {
  const availableServices = [];
  
  Object.keys(deliveryServices).forEach(serviceType => {
    const service = deliveryServices[serviceType];
    
    // Check if service has availability restrictions
    if (service.availability && !service.availability.includes(district)) {
      return; // Skip this service
    }
    
    // Check if service has rates for this location
    let zone = 4;
    if (city && majorCities[city]) {
      zone = majorCities[city].zone;
    } else if (sriLankanDistricts[district]) {
      zone = sriLankanDistricts[district].zone;
    }
    
    if (service.rates[zone] !== null && service.rates[zone] !== undefined) {
      availableServices.push({
        type: serviceType,
        name: service.name,
        description: service.description,
        rate: service.rates[zone],
        freeThreshold: service.freeThreshold
      });
    }
  });
  
  return availableServices;
};

/**
 * Get estimated delivery days based on zone and service
 * @param {number} zone - Delivery zone
 * @param {string} serviceType - Service type
 * @returns {Object} Delivery time estimate
 */
export const getEstimatedDeliveryDays = (zone, serviceType) => {
  const estimates = {
    standard: {
      1: { min: 1, max: 2, text: '1-2 working days' },
      2: { min: 2, max: 3, text: '2-3 working days' },
      3: { min: 3, max: 5, text: '3-5 working days' },
      4: { min: 4, max: 7, text: '4-7 working days' }
    },
    express: {
      1: { min: 1, max: 1, text: '1 working day' },
      2: { min: 1, max: 2, text: '1-2 working days' },
      3: { min: 2, max: 3, text: '2-3 working days' },
      4: { min: 3, max: 4, text: '3-4 working days' }
    },
    sameDay: {
      1: { min: 0, max: 0, text: 'Same day' },
      2: null,
      3: null,
      4: null
    }
  };

  return estimates[serviceType]?.[zone] || { min: 3, max: 7, text: '3-7 working days' };
};

/**
 * Get all Sri Lankan districts for dropdown/selection
 * @returns {Array} Array of district names sorted alphabetically
 */
export const getAllDistricts = () => {
  return Object.keys(sriLankanDistricts).sort();
};

/**
 * Get major cities for a district
 * @param {string} district - District name
 * @returns {Array} Array of major cities in the district
 */
export const getCitiesForDistrict = (district) => {
  return Object.keys(majorCities)
    .filter(city => {
      const districtInfo = sriLankanDistricts[district];
      const cityInfo = majorCities[city];
      
      if (!districtInfo || !cityInfo) return false;
      
      // Simple matching - in a real app, you'd have a proper city-to-district mapping
      return city.includes(district) || 
             (district === 'Colombo' && cityInfo.type === 'metro') ||
             (district === 'Gampaha' && ['Negombo', 'Gampaha', 'Ja-Ela', 'Wattala', 'Kelaniya', 'Kadawatha'].includes(city));
    })
    .sort();
};

/**
 * Validate delivery address for Sri Lanka
 * @param {Object} address - Address object
 * @returns {Object} Validation result
 */
export const validateSriLankanAddress = (address) => {
  const errors = [];
  
  if (!address.district || !sriLankanDistricts[address.district]) {
    errors.push('Please select a valid district');
  }
  
  if (!address.postalCode || !/^\d{5}$/.test(address.postalCode)) {
    errors.push('Please enter a valid 5-digit postal code');
  }
  
  if (!address.street || address.street.length < 5) {
    errors.push('Please enter a complete street address');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export default {
  calculateDeliveryFee,
  getAvailableServices,
  getEstimatedDeliveryDays,
  getAllDistricts,
  getCitiesForDistrict,
  validateSriLankanAddress,
  sriLankanDistricts,
  majorCities,
  deliveryServices
};