const supabase = require('../config/supabase');

const checkAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const [tokenType, token] = authHeader.split(' ');
    
    if (!token || tokenType.toLowerCase() !== 'bearer') {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      
      if (authError || !user) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (roleError) {
        return res.status(403).json({ error: 'Error checking admin status' });
      }

      if (!roleData || roleData.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized - Admin access required' });
      }

      req.user = user;
      next();
    } catch (verifyError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed', details: error.message });
  }
};

module.exports = { checkAdmin }; 