/**
 * Student Controller
 * Handles the business logic between routes and the Student model
 * Processes requests and sends responses for student-related operations
 */

const Student = require('../services/Student');
const User = require('../services/User');

/**
 * Get all students
 * @route GET /api/students
 * @access Public
 */
const getAll = async (req, res) => {
  try {
    const students = await Student.getAll();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Create a new student
 * @route POST /api/students
 * @access Private - Requires authentication
 */
const create = async (req, res) => {
  try {
    const userId = req.user.id;
    const student = await Student.create(req.body, userId);
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Update an existing student
 * @route PUT /api/students/:id
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

    const student = await Student.update(id, req.body);
    res.json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Delete a student
 * @route DELETE /api/students/:id
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

    await Student.remove(id);
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