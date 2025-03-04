const Friend = require('../models/Friend');
const User = require('../models/User');

const getAll = async (req, res) => {
  try {
    const friends = await Friend.getAll();
    res.json(friends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    const userId = req.user.id;
    const friend = await Friend.create(req.body, userId);
    res.status(201).json(friend);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Check if user is admin
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

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Check if user is admin
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