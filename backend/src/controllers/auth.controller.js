const authService = require('../services/auth.service');
const { sendSuccess, sendError } = require('../utils/response.util');

/**
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { name, email, team, password } = req.body;

    if (!name || !email || !password) {
      return sendError(res, 400, 'Name, email, and password are required', 'VALIDATION_ERROR');
    }

    if (password.length < 6) {
      return sendError(res, 400, 'Password must be at least 6 characters long', 'VALIDATION_ERROR');
    }

    const result = await authService.registerUser({ name, email, team, password });
    return sendSuccess(res, 201, result, 'Registration successful');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, 'Email and password are required', 'VALIDATION_ERROR');
    }

    const result = await authService.loginUser({ email, password });
    return sendSuccess(res, 200, result, 'Login successful');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 */
const getMe = async (req, res, next) => {
  try {
    const user = await authService.getUserById(req.user.id);
    return sendSuccess(res, 200, { user }, 'User profile retrieved');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
};
