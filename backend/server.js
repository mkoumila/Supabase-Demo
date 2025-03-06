/**
 * Main application entry point
 * This file sets up the Express server, middleware, and routes
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const friendRoutes = require('./routes/friendRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// CORS Configuration
// Get allowed origins from environment variable for security
const allowedOrigins = process.env.CLIENT_URLS ? process.env.CLIENT_URLS.split(',') : [];

// Middleware Setup
app.use(cors({
  origin: allowedOrigins, // Only allow specified origins
  credentials: true       // Allow credentials (cookies, auth headers)
}));
app.use(express.json());  // Parse JSON request bodies

// Health check route (no auth required)
// Used to verify the server is running
app.get("/api/health", (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    path: req.path
  });
});

// Mount route handlers
// Each route group is prefixed with the API prefix
app.use("/api/auth", authRoutes);   // Authentication routes
app.use("/api/users", userRoutes);  // User management routes
app.use("/api", friendRoutes);           // Friend management routes

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ 
    message: `Route ${req.method} ${req.url} not found`,
    timestamp: new Date().toISOString()
  });
});

// Global error handling middleware
// Catches all errors thrown in the application
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    // Only show error details in development
    error: process.env.NODE_ENV === 'development' ? err : {},
    timestamp: new Date().toISOString()
  });
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 