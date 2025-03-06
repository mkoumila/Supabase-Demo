/**
 * Friend Controller
 * Handles the business logic between routes and the Friend model
 * Processes requests and sends responses for friend-related operations
 */

const Friend = require('../services/Friend');
const User = require('../services/User');

/**
 * Get all friends
 * @route GET /api/friends
 * @access Public
 */
const getAll = async (req, res) => {
  try {
    const friends = await Friend.getAll();
    res.json(friends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Create a new friend
 * @route POST /api/friends
 * @access Private - Requires authentication
 */
const create = async (req, res) => {
  try {
    const userId = req.user.id;
    const friend = await Friend.create(req.body, userId);
    res.status(201).json(friend);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Update an existing friend
 * @route PUT /api/friends/:id
 * @access Private - Requires admin role
 */
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Verify admin privileges
    const isAdmin = await User.isAdmin(userId);
    if (!isAdmin) {
      return res.status(403).json({ error: 'Unauthorized - Admin access required' });
    }

    const friend = await Friend.update(id, req.body);
    res.json(friend);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Delete a friend
 * @route DELETE /api/friends/:id
 * @access Private - Requires admin role
 */
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Verify admin privileges
    const isAdmin = await User.isAdmin(userId);
    if (!isAdmin) {
      return res.status(403).json({ error: 'Unauthorized - Admin access required' });
    }

    await Friend.remove(id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAll,
  create,
  update,
  remove
}; 