const jwt = require('jsonwebtoken');

/**
 * Service for JWT token creation and verification
 */
class JwtService {
  /**
   * Generate JWT Token
   * @param {Object} payload - Data to encode in token (e.g. user ID)
   * @param {string} expiresIn - Expiration duration (e.g. '7d')
   * @returns {string} Signed JWT
   */
  static generateToken(payload, expiresIn = '7d') {
    const secret = process.env.JWT_SECRET || 'default_jwt_secret_key_change_in_production';
    return jwt.sign(payload, secret, { expiresIn });
  }

  /**
   * Verify JWT Token
   * @param {string} token - JWT token string
   * @returns {Object} Decoded payload
   */
  static verifyToken(token) {
    const secret = process.env.JWT_SECRET || 'default_jwt_secret_key_change_in_production';
    return jwt.verify(token, secret);
  }
}

module.exports = JwtService;
