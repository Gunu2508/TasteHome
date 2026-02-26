// middleware/authMiddleware.js - JWT authentication middleware
const jwt = require('jsonwebtoken');

/**
 * protect - verifies the Bearer JWT token on private routes.
 * Attaches the decoded user payload to req.user for downstream controllers.
 */
const protect = (req, res, next) => {
  let token;

  // Check for Authorization header with Bearer scheme
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Verify and decode the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach decoded user data to the request object
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized - token is invalid or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized - no token provided' });
  }
};

module.exports = { protect };
