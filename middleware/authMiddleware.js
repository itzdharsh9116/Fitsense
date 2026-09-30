const JwtService = require('../services/jwtService');
const { errorResponse } = require('../utils/response');

/**
 * Authentication Middleware
 * Protects routes by verifying JWT in Authorization header
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 401, 'Access denied. No authentication token provided.');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return errorResponse(res, 401, 'Access denied. Token missing.');
    }

    const decoded = JwtService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 401, 'Authentication failed. Token has expired.');
    }
    return errorResponse(res, 401, 'Authentication failed. Invalid token.');
  }
};

module.exports = authMiddleware;
