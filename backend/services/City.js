const { supabase } = require('../utils/supabaseClient');

/**
 * Generate a random weight between 1 and 100
 * @returns {number} Random weight
 */
const generateWeight = () => {
  return Math.floor(Math.random() * 100) + 1;
};

/**
 * City Service
 * Handles all database operations for the cities table
 */

/**
 * Retrieve all cities from the database
 * @returns {Promise<Array>} Array of city objects
 * @throws {Error} If database operation fails
 */
const getAll = async () => {
  try {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error in getAll:', error);
      throw new Error(`Failed to fetch cities: ${error.message}`);
    }
    return data;
  } catch (error) {
    console.error('Error in getAll:', error);
    throw error;
  }
};

/**
 * Create a new city in the database
 * @param {Object} cityData - City information (name)
 * @returns {Promise<Object>} Created city object
 * @throws {Error} If database operation fails
 */
const create = async (cityData) => {
  try {
    console.log('Creating city in service with data:', cityData);
    
    if (!cityData.name) {
      throw new Error('City name is required');
    }

    const { data, error } = await supabase
      .from('cities')
      .insert([{ 
        name: cityData.name,
        weight: generateWeight()
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error in create:', error);
      throw new Error(`Failed to create city: ${error.message}`);
    }
    return data;
  } catch (error) {
    console.error('Error in create:', error);
    throw error;
  }
};

/**
 * Update a city in the database
 * @param {string} id - ID of the city to update
 * @param {Object} cityData - Updated city information
 * @returns {Promise<Object>} Updated city object
 * @throws {Error} If database operation fails
 */
const update = async (id, cityData) => {
  try {
    console.log('Updating city in service:', { id, ...cityData });
    
    if (!cityData.name) {
      throw new Error('City name is required');
    }

    const { data, error } = await supabase
      .from('cities')
      .update({
        name: cityData.name
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error in update:', error);
      throw new Error(`Failed to update city: ${error.message}`);
    }

    if (!data) {
      throw new Error('City not found');
    }

    return data;
  } catch (error) {
    console.error('Error in update:', error);
    throw error;
  }
};

/**
 * Delete a city from the database
 * @param {string} id - ID of the city to delete
 * @returns {Promise<void>}
 * @throws {Error} If database operation fails
 */
const remove = async (id) => {
  try {
    console.log('Deleting city in service:', id);
    
    if (!id) {
      throw new Error('City ID is required');
    }

    const { error } = await supabase
      .from('cities')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error in remove:', error);
      throw new Error(`Failed to delete city: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in remove:', error);
    throw error;
  }
};

module.exports = {
  getAll,
  create,
  update,
  remove
}; 