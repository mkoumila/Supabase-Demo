/**
 * Authentication Middleware
 * Verifies JWT tokens and attaches user information to requests
 * Used to protect routes that require authentication
 */

const User = require('../models/User');

/**
 * Middleware to verify authentication tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Check for authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    // Extract token from header
    const [tokenType, token] = authHeader.split(' ');
    
    // Verify token format
    if (!token || tokenType.toLowerCase() !== 'bearer') {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    try {
      // Verify token and get user information
      const user = await User.verifyToken(token);
      if (!user) {
        return res.status(401).json({ error: 'Invalid token' });
      }
      
      // Attach user object to request for use in route handlers
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};

module.exports = authMiddleware; 