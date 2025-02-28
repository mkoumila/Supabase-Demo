const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Get all friends
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from("friends").select();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new friend
router.post('/', async (req, res) => {
  try {
    const { error } = await supabase
      .from("friends")
      .insert([req.body]);
    if (error) throw error;
    res.status(201).json({ message: 'Friend created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a friend
router.put('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from("friends")
      .update(req.body)
      .eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'Friend updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a friend
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from("friends")
      .delete()
      .eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'Friend deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 