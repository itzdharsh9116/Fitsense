const bcrypt = require('bcryptjs');

/**
 * Service for handling password hashing and comparison
 */
class PasswordService {
  /**
   * Hash a plain text password
   * @param {string} password - Plain text password
   * @returns {Promise<string>} Hashed password
   */
  static async hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * Compare plain text password with hashed password
   * @param {string} password - Plain text password
   * @param {string} hashedPassword - Hashed password from DB
   * @returns {Promise<boolean>} Match result
   */
  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = PasswordService;
