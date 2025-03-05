/**
 * Auth Model
 * Handles authentication operations using Supabase Auth
 * Provides methods for user authentication and token verification
 */

const { supabase } = require('../utils/supabaseClient');

class Auth {
  /**
   * Sign in a user with email and password
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<Object>} User data and session
   * @throws {Error} If authentication fails
   */
  static async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  }

  /**
   * Sign out the current user
   * @returns {Promise<boolean>} True if sign out was successful
   * @throws {Error} If sign out fails
   */
  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  }

  /**
   * Verify a JWT token and get user information
   * @param {string} token - JWT token to verify
   * @returns {Promise<Object>} User information if token is valid
   * @throws {Error} If token is invalid or verification fails
   */
  static async verifyToken(token) {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error) throw error;
    return user;
  }
}

module.exports = Auth; 