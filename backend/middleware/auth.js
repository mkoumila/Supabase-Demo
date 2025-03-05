/**
 * Admin Authentication Middleware
 * Verifies that the user has admin privileges
 * Used to protect admin-only routes
 */

const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client with service key for admin operations
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

/**
 * Middleware to verify admin privileges
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
const isAdmin = async (req, res, next) => {
  // List of paths that don't require authentication
  const publicPaths = ["/health"];
  const currentPath = req.path.toLowerCase();

  // Skip authentication for public paths
  if (publicPaths.includes(currentPath)) {
    return next();
  }

  // Check for authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No authorization header" });
  }

  try {
    // Extract and verify token
    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: error?.message || "Invalid token" });
    }

    // Check user's role in user_roles table
    const { data: roles, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (roleError) {
      return res.status(500).json({ error: "Error checking user role" });
    }

    // Verify admin role
    if (!roles || roles.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    // Attach user and role to request
    req.user = user;
    req.userRole = roles.role;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ error: "Internal server error during authentication" });
  }
};

module.exports = { isAdmin };
