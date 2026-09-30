const User = require('../models/User');
const PasswordService = require('../services/passwordService');
const JwtService = require('../services/jwtService');
const { successResponse, errorResponse } = require('../utils/response');

class AuthController {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  static async register(req, res, next) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return errorResponse(res, 400, 'Please provide name, email, and password');
      }

      if (password.length < 6) {
        return errorResponse(res, 400, 'Password must be at least 6 characters long');
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
      if (existingUser) {
        return errorResponse(res, 409, 'User with this email already exists');
      }

      // Hash password
      const hashedPassword = await PasswordService.hashPassword(password);

      // Create user
      const user = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword
      });

      // Generate JWT
      const token = JwtService.generateToken({ id: user._id, email: user.email });

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Log in an existing user
   * POST /api/auth/login
   */
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return errorResponse(res, 400, 'Please provide email and password');
      }

      // Find user
      const user = await User.findOne({ email: email.toLowerCase().trim() });
      if (!user) {
        return errorResponse(res, 401, 'Invalid credentials');
      }

      // Check password
      const isMatch = await PasswordService.comparePassword(password, user.password);
      if (!isMatch) {
        return errorResponse(res, 401, 'Invalid credentials');
      }

      // Generate JWT
      const token = JwtService.generateToken({ id: user._id, email: user.email });

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user profile
   * GET /api/auth/profile
   */
  static async getProfile(req, res, next) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return errorResponse(res, 404, 'User profile not found');
      }

      return successResponse(res, 200, 'Profile retrieved successfully', user);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
