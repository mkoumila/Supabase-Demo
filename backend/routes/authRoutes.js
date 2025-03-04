const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// Public routes (no auth required)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      console.log("Missing credentials");
      return res.status(400).json({ error: "Email and password are required" });
    }

    const data = await User.login(email, password);

    res.json(data);
  } catch (error) {
    console.error("Login error:", error);
    res.status(401).json({ error: error.message });
  }
});

// Protected routes (auth required)
router.post("/logout", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      // If no token, consider it already logged out
      return res.json({ message: "Logged out successfully" });
    }

    const [tokenType, token] = authHeader.split(" ");
    if (!token || tokenType.toLowerCase() !== "bearer") {
      return res.json({ message: "Logged out successfully" });
    }

    await User.logout();
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    // Even if there's an error, we consider the user logged out
    res.json({ message: "Logged out successfully" });
  }
});

router.get("/session", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const role = await User.getRole(user.id);
    res.json({ ...user, role });
  } catch (error) {
    console.error("Session error:", error);
    res.status(401).json({ error: error.message });
  }
});

module.exports = router;
