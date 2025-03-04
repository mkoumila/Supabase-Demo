const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.get('/friends', friendController.getAll);

// Protected routes
router.use(authMiddleware);
router.post('/friends', friendController.create);
router.put('/friends/:id', friendController.update);
router.delete('/friends/:id', friendController.remove);

module.exports = router; 