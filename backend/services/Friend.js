/**
 * Friend Model
 * Handles all database operations for the friends table
 * Uses Supabase as the database provider
 */

const { supabase } = require('../utils/supabaseClient');

/**
 * Retrieve all friends from the database
 * @returns {Promise<Array>} Array of friend objects
 * @throws {Error} If database operation fails
 */
const getAll = async () => {
  try {
    const { data, error } = await supabase
      .from('friends')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(`Failed to fetch friends: ${error.message}`);
  }
};

/**
 * Create a new friend in the database
 * @param {Object} friendData - Friend information (name, age, job, etc.)
 * @param {string} userId - ID of the user creating the friend
 * @returns {Promise<Object>} Created friend object
 * @throws {Error} If database operation fails
 */
const create = async (friendData, userId) => {
  try {
    const { data, error } = await supabase
      .from('friends')
      .insert([{ 
        ...friendData,
        created_by: userId 
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(`Failed to create friend: ${error.message}`);
  }
};

/**
 * Update an existing friend's information
 * @param {string} id - Friend ID to update
 * @param {Object} friendData - Updated friend information
 * @returns {Promise<Object>} Updated friend object
 * @throws {Error} If database operation fails
 */
const update = async (id, friendData) => {
  try {
    const { data, error } = await supabase
      .from('friends')
      .update(friendData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(`Failed to update friend: ${error.message}`);
  }
};

/**
 * Delete a friend from the database
 * @param {string} id - Friend ID to delete
 * @returns {Promise<boolean>} True if deletion was successful
 * @throws {Error} If database operation fails
 */
const remove = async (id) => {
  try {
    const { error } = await supabase
      .from('friends')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    throw new Error(`Failed to delete friend: ${error.message}`);
  }
};

module.exports = {
  getAll,
  create,
  update,
  remove
};