const { supabase } = require('../utils/supabaseClient');

const login = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;

  // Get user role
  const { data: roleData, error: roleError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', data.user.id)
    .single();

  if (roleError) throw roleError;

  return {
    user: {
      ...data.user,
      role: roleData?.role
    },
    token: data.session.access_token
  };
};

const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

const getRole = async (userId) => {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data?.role;
};

const isAdmin = async (userId) => {
  const role = await getRole(userId);
  return role === 'admin';
};

const verifyToken = async (token) => {
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error) throw error;

  // Get user role
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  return {
    ...user,
    role: roleData?.role
  };
};

module.exports = {
  login,
  logout,
  getRole,
  isAdmin,
  verifyToken
};