const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
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
      const user = await User.verifyToken(token);
      if (!user) {
        return res.status(401).json({ error: 'Invalid token' });
      }
      
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};

module.exports = authMiddleware; 