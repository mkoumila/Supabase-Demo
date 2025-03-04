require('dotenv').config();
const express = require('express');
const cors = require('cors');
const friendRoutes = require('./routes/friendRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Auth routes should come BEFORE other routes
app.use('/api/auth', authRoutes);
app.use('/api', friendRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Something went wrong!' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 