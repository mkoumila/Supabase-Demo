require('dotenv').config();
const express = require('express');
const cors = require('cors');
const friendsRouter = require('./routes/friends');

const app = express();
const PORT = process.env.PORT || 5000;

// Verify environment variables are loaded
console.log('Environment check:', {
  url: process.env.SUPABASE_URL ? 'Set' : 'Missing',
  key: process.env.SUPABASE_ANON_KEY ? 'Set' : 'Missing'
});

app.use(cors());
app.use(express.json());

app.use('/api/friends', friendsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 