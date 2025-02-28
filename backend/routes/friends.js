const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { checkAdmin } = require('../middleware/auth');

// Public route - anyone can read
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from("friends").select();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Protected routes - only admins can modify
router.post('/', checkAdmin, async (req, res) => {
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

router.put('/:id', checkAdmin, async (req, res) => {
  try {
    // Remove any id from the request body to prevent id update attempts
    const { id, created_at, ...updateData } = req.body;
    
    const { data, error } = await supabase
      .from("friends")
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    
    res.json({ message: 'Friend updated successfully', data });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', checkAdmin, async (req, res) => {
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