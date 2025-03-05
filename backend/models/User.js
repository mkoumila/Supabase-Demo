/**
 * User Model
 * Handles user operations and role management
 * Integrates with Supabase Auth and custom user_roles table
 */

const { supabase } = require('../utils/supabaseClient');

/**
 * Authenticate user and retrieve role information
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} User data with role and authentication token
 * @throws {Error} If authentication fails
 */
const login = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;

  // Get user role from custom roles table
  const { data: roleData, error: roleError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', data.user.id)
    .single();

  if (roleError) throw roleError;

  return {
    user: {
      ...data.user,
      role: roleData?.role
    },
    token: data.session.access_token
  };
};

/**
 * Sign out the current user
 * @returns {Promise<void>}
 * @throws {Error} If sign out fails
 */
const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

/**
 * Get user's role from the database
 * @param {string} userId - User's ID
 * @returns {Promise<string>} User's role
 * @throws {Error} If role lookup fails
 */
const getRole = async (userId) => {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data?.role;
};

/**
 * Check if user has admin role
 * @param {string} userId - User's ID
 * @returns {Promise<boolean>} True if user is admin
 */
const isAdmin = async (userId) => {
  const role = await getRole(userId);
  return role === 'admin';
};

/**
 * Verify token and get user information with role
 * @param {string} token - JWT token
 * @returns {Promise<Object>} User information with role
 * @throws {Error} If token verification fails
 */
const verifyToken = async (token) => {
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error) throw error;

  // Get user role
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  return {
    ...user,
    role: roleData?.role
  };
};

module.exports = {
  login,
  logout,
  getRole,
  isAdmin,
  verifyToken
};