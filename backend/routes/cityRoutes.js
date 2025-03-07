const express = require('express');
const router = express.Router();
const cityController = require('../controllers/cityController');
const authMiddleware = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/auth');

// Public routes
router.get('/cities', cityController.getAllCities);

// Protected routes that require authentication
router.use(authMiddleware);

// Routes that require admin privileges
router.post('/cities', isAdmin, cityController.createCity);
router.put('/cities/:id', isAdmin, cityController.updateCity);
router.delete('/cities/:id', isAdmin, cityController.deleteCity);

module.exports = router; 