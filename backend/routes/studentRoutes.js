const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.get('/students', studentController.getAll);

// Protected routes
router.use(authMiddleware);
router.post('/students', studentController.create);
router.put('/students/:id', studentController.update);
router.delete('/students/:id', studentController.remove);

module.exports = router; 