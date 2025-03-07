const cityService = require('../services/City');

/**
 * Get all cities
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllCities = async (req, res) => {
  try {
    const cities = await cityService.getAll();
    res.json(cities);
  } catch (error) {
    console.error('Error in getAllCities:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Create a new city
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createCity = async (req, res) => {
  try {
    console.log('Creating city with data:', req.body);
    
    if (!req.body.name) {
      return res.status(400).json({ error: 'City name is required' });
    }

    const city = await cityService.create({
      name: req.body.name
    });

    res.status(201).json(city);
  } catch (error) {
    console.error('Error in createCity:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update a city
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateCity = async (req, res) => {
  try {
    console.log('Updating city with data:', req.body);
    console.log('City ID:', req.params.id);
    
    if (!req.body.name) {
      return res.status(400).json({ error: 'City name is required' });
    }

    const city = await cityService.update(req.params.id, {
      name: req.body.name
    });

    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }

    res.json(city);
  } catch (error) {
    console.error('Error in updateCity:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete a city
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteCity = async (req, res) => {
  try {
    console.log('Deleting city:', req.params.id);
    
    await cityService.remove(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error in deleteCity:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllCities,
  createCity,
  updateCity,
  deleteCity
}; 