const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const { isAdmin } = require('../middleware/auth');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Health check route
router.get('/health', (req, res) => {
  console.log('[UserRoutes] Health check accessed');
  res.json({ 
    status: 'ok',
    service: 'user-routes',
    timestamp: new Date().toISOString(),
    path: req.path
  });
});

// Get all users (admin only)
router.get('/', isAdmin, async (req, res) => {
  try {
    // Get users from auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      return res.status(400).json({
        message: authError.message || 'Failed to fetch users'
      });
    }

    // Get roles from user_roles
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id, role');

    if (rolesError) {
      return res.status(400).json({
        message: rolesError.message || 'Failed to fetch user roles'
      });
    }

    // Combine users with their roles
    const usersWithRoles = authUsers.users.map(user => ({
      ...user,
      role: roles.find(r => r.user_id === user.id)?.role || 'user'
    }));

    res.json(usersWithRoles);
  } catch (error) {
    res.status(500).json({ 
      message: 'Internal server error while fetching users',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Create new user (admin only)
router.post('/', isAdmin, async (req, res) => {
  try {
    const { email, password, isAdmin: isAdminUser } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (authError) {
      return res.status(400).json({
        message: authError.message || 'Failed to create user'
      });
    }

    const role = isAdminUser ? 'admin' : 'user';
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert([{ 
        user_id: authUser.user.id, 
        role: role 
      }]);

    if (roleError) {
      await supabase.auth.admin.deleteUser(authUser.user.id);
      return res.status(400).json({
        message: 'Failed to assign user role',
        error: roleError.message
      });
    }

    res.status(201).json({
      message: 'User created successfully',
      userId: authUser.user.id,
      role: role
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Internal server error while creating user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update user (admin only)
router.put('/:userId', isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (role) {
      // First, delete existing role
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (deleteError) {
        return res.status(400).json({
          message: 'Failed to update user role',
          error: deleteError.message
        });
      }

      // Then, insert new role
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert([{ 
          user_id: userId, 
          role: role 
        }]);

      if (insertError) {
        return res.status(400).json({
          message: 'Failed to update user role',
          error: insertError.message
        });
      }
    }

    // Get updated user data
    const { data: updatedUser, error: userError } = await supabase.auth.admin.getUserById(userId);
    
    if (userError) {
      return res.status(400).json({
        message: 'Failed to fetch updated user data',
        error: userError.message
      });
    }

    res.json({
      message: 'User updated successfully',
      user: {
        ...updatedUser.user,
        role: role
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Internal server error while updating user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Delete user (admin only)
router.delete('/:userId', isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    // First, delete from user_roles
    const { error: roleError } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);

    if (roleError) {
      return res.status(400).json({
        message: 'Failed to delete user role',
        error: roleError.message
      });
    }

    // Then, delete from auth system
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);

    if (authError) {
      return res.status(400).json({
        message: 'Failed to delete user from auth system',
        error: authError.message
      });
    }

    res.json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Internal server error while deleting user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router; 