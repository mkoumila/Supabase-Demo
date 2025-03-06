const User = require('../services/User');

class AuthController {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const { user, token } = await User.login(email, password);
      const isAdmin = await User.isAdmin(user.id);
      
      res.json({
        token,
        user,
        isAdmin
      });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  async logout(req, res) {
    try {
      await User.logout(req.user?.id);
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getSession(req, res) {
    try {
      const user = req.user;
      const isAdmin = await User.isAdmin(user.id);
      
      res.json({
        user,
        isAdmin
      });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
}

module.exports = new AuthController(); 