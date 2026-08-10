const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const envConfig = require('../config/env.config');

// In-memory prototype user store
const users = [
  {
    id: 'usr_001',
    name: 'GP Lambiase',
    email: 'gp.lambiase@apexracing.com',
    // Pre-hashed 'password123'
    passwordHash: bcrypt.hashSync('password123', 8),
    team: 'Apex Racing Engineering',
    role: 'Chief Race Engineer',
    driverAssigned: 'Max Verstappen (#1)',
    callSign: 'APEX-ENG-01',
    createdAt: new Date().toISOString(),
  },
];

/**
 * Generate JWT token for a user
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      team: user.team,
      role: user.role,
    },
    envConfig.jwtSecret,
    {
      expiresIn: envConfig.jwtExpiresIn,
    }
  );
};

/**
 * Sanitize user object (omit passwordHash)
 */
const sanitizeUser = (user) => {
  const { passwordHash, ...sanitized } = user;
  return sanitized;
};

/**
 * Register a new user
 */
const registerUser = async ({ name, email, team, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  // Check if user already exists
  const existingUser = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existingUser) {
    const error = new Error('A user with this email address already exists');
    error.statusCode = 409;
    error.code = 'EMAIL_EXISTS';
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = {
    id: `usr_${Date.now()}`,
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    team: (team || 'Apex Racing Team').trim(),
    role: 'Race Engineer',
    driverAssigned: 'Car #1',
    callSign: `APEX-ENG-${Math.floor(10 + Math.random() * 90)}`,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);

  const token = generateToken(newUser);
  return {
    user: sanitizeUser(newUser),
    token,
  };
};

/**
 * Login existing user
 */
const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    const error = new Error('Invalid email address or password');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    const error = new Error('Invalid email address or password');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  const token = generateToken(user);
  return {
    user: sanitizeUser(user),
    token,
  };
};

/**
 * Get user profile by ID
 */
const getUserById = async (id) => {
  const user = users.find((u) => u.id === id);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    error.code = 'USER_NOT_FOUND';
    throw error;
  }
  return sanitizeUser(user);
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
};
