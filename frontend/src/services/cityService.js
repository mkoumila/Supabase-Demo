const API_URL = import.meta.env.VITE_API_URL;

/**
 * Get auth token from localStorage
 * @returns {string|null} Auth token
 */
const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Get all cities
 * @returns {Promise<Array>} Array of cities
 */
const getAllCities = async () => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/api/cities`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Failed to fetch cities');
  return response.json();
};

/**
 * Create a new city
 * @param {Object} cityData - City data to create
 * @returns {Promise<Object>} Created city
 */
const createCity = async (cityData) => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/api/cities`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    credentials: 'include',
    body: JSON.stringify(cityData)
  });
  if (!response.ok) throw new Error('Failed to create city');
  return response.json();
};

/**
 * Update a city
 * @param {string} id - City ID to update
 * @param {Object} cityData - Updated city data
 * @returns {Promise<Object>} Updated city
 */
const updateCity = async (id, cityData) => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/api/cities/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    credentials: 'include',
    body: JSON.stringify(cityData)
  });
  if (!response.ok) throw new Error('Failed to update city');
  return response.json();
};

/**
 * Delete a city
 * @param {string} id - City ID to delete
 */
const deleteCity = async (id) => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/api/cities/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Failed to delete city');
};

export const cityService = {
  getAllCities,
  createCity,
  updateCity,
  deleteCity,
}; 