const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const sheetsService = require('../services/sheets.service');
const config = require('../config/config');
const logger = require('../utils/logger');

class AuthController {
  // Generate JWT token
  generateToken(user) {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
  }

  // Register new user
  async register(req, res) {
    try {
      const { name, email, password, phone, address, role } = req.body;

      logger.info(`Registration attempt for email: ${email}`);

      // Check if user already exists by email
      const existingUserByEmail = await sheetsService.getUserByEmail(email);
      if (existingUserByEmail) {
        logger.info(`User already exists with email: ${email}`);
        return res.status(409).json({
          error: 'User already exists',
          message: 'An account with this email already exists'
        });
      }

      // Check if user already exists by phone
      const existingUserByPhone = await sheetsService.getUserByPhone(phone);
      if (existingUserByPhone) {
        logger.info(`User already exists with phone: ${phone}`);
        return res.status(409).json({
          error: 'Phone number already exists',
          message: 'An account with this phone number already exists'
        });
      }

      logger.info(`Creating new user: ${email}`);

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user data
      const userData = {
        id: uuidv4(),
        name,
        email,
        password: hashedPassword,
        role: role || 'user',
        profileImage: null,
        phone: phone || null,
        address: address || null,
        isVerified: false,
        isActive: true,
        lastLogin: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      logger.info(`User data prepared for: ${email}`);

      // Save user to Google Sheets
      const createdUser = await sheetsService.createUser(userData);
      logger.info(`User created successfully: ${email}`);

      // Create login log
      await sheetsService.createLoginLog({
        id: uuidv4(),
        userId: userData.id,
        email: userData.email,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent') || 'Unknown',
        loginMethod: 'registration',
        status: 'success',
        failureReason: null,
        location: null,
        createdAt: new Date().toISOString()
      });

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: userData.id, 
          email: userData.email, 
          role: userData.role,
          isValid: true
        },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      // Create user session
      await sheetsService.createUserSession({
        id: uuidv4(),
        userId: userData.id,
        sessionToken: token,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent') || 'Unknown',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        isActive: true,
        createdAt: new Date().toISOString()
      });

      // Remove password from response
      const { password: _, ...userResponse } = userData;

      logger.info(`New user registered successfully: ${email}`);

      res.status(201).json({
        message: 'User registered successfully',
        user: userResponse,
        token,
        expiresIn: config.jwt.expiresIn
      });

    } catch (error) {
      logger.error('Registration error:', error.message);
      logger.error('Registration error stack:', error.stack);
      res.status(500).json({
        error: 'Registration failed',
        message: 'An error occurred while creating your account'
      });
    }
  }

  // Login user
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await sheetsService.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({
          error: 'Invalid credentials',
          message: 'Email or password is incorrect'
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          error: 'Account disabled',
          message: 'Your account has been disabled. Please contact support.'
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        // Log failed login attempt
        await sheetsService.createLoginLog({
          id: uuidv4(),
          userId: user.id,
          email: user.email,
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.get('User-Agent') || 'Unknown',
          loginMethod: 'password',
          status: 'failed',
          failureReason: 'Invalid password',
          location: null,
          createdAt: new Date().toISOString()
        });

        return res.status(401).json({
          error: 'Invalid credentials',
          message: 'Email or password is incorrect'
        });
      }

      // Update last login
      await sheetsService.updateUser(user.id, {
        lastLogin: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // Create login log
      await sheetsService.createLoginLog({
        id: uuidv4(),
        userId: user.id,
        email: user.email,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent') || 'Unknown',
        loginMethod: 'password',
        status: 'success',
        failureReason: null,
        location: null,
        createdAt: new Date().toISOString()
      });

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email, 
          role: user.role,
          isValid: true
        },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      // Create user session
      await sheetsService.createUserSession({
        id: uuidv4(),
        userId: user.id,
        sessionToken: token,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent') || 'Unknown',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        isActive: true,
        createdAt: new Date().toISOString()
      });

      // Remove password from response
      const { password: _, ...userResponse } = user;

      logger.info(`User logged in: ${email}`);

      res.json({
        message: 'Login successful',
        user: userResponse,
        token,
        expiresIn: config.jwt.expiresIn
      });

    } catch (error) {
      logger.error('Login error:', error.message);
      res.status(500).json({
        error: 'Login failed',
        message: 'An error occurred while logging in'
      });
    }
  }

  // Logout user
  async logout(req, res) {
    try {
      const sessionId = req.sessionId;
      
      if (sessionId) {
        // Deactivate the current session
        await sheetsService.updateUserSession(sessionId, {
          isActive: false,
          updatedAt: new Date().toISOString()
        });
        
        logger.info(`Session invalidated for user: ${req.user?.email || 'Unknown'}`);
      }

      logger.info(`User logged out: ${req.user?.email || 'Unknown'}`);

      res.json({
        message: 'Logout successful',
        details: 'Token has been invalidated and can no longer be used'
      });

    } catch (error) {
      logger.error('Logout error:', error.message);
      res.status(500).json({
        error: 'Logout failed',
        message: 'An error occurred while logging out'
      });
    }
  }

  // Get current user profile
  async getProfile(req, res) {
    try {
      const user = await sheetsService.getUserById(req.user.id);
      
      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          message: 'User profile not found'
        });
      }

      // Remove password from response
      const { password: _, ...userResponse } = user;

      res.json({
        user: userResponse
      });

    } catch (error) {
      logger.error('Get profile error:', error.message);
      res.status(500).json({
        error: 'Failed to get profile',
        message: 'An error occurred while fetching your profile'
      });
    }
  }

  // Update user profile
  async updateProfile(req, res) {
    try {
      const { name, phone, address, profileImage } = req.body;
      const userId = req.user.id;

      // Check if phone number is being updated and if it's unique
      if (phone !== undefined) {
        const existingUserByPhone = await sheetsService.getUserByPhone(phone);
        if (existingUserByPhone && existingUserByPhone.id !== userId) {
          return res.status(409).json({
            error: 'Phone number already exists',
            message: 'An account with this phone number already exists'
          });
        }
      }

      const updateData = {
        updatedAt: new Date().toISOString()
      };

      if (name !== undefined) updateData.name = name;
      if (phone !== undefined) updateData.phone = phone;
      if (address !== undefined) updateData.address = address;
      if (profileImage !== undefined) updateData.profileImage = profileImage;

      const updatedUser = await sheetsService.updateUser(userId, updateData);

      // Remove password from response
      const { password: _, ...userResponse } = updatedUser;

      logger.info(`User profile updated: ${req.user.email}`);

      res.json({
        message: 'Profile updated successfully',
        user: userResponse
      });

    } catch (error) {
      logger.error('Update profile error:', error.message);
      res.status(500).json({
        error: 'Failed to update profile',
        message: 'An error occurred while updating your profile'
      });
    }
  }

  // Invalidate all sessions for a user (security feature)
  async invalidateAllSessions(req, res) {
    try {
      const userId = req.user.id;
      
      // Get all active sessions for the user
      const userSessions = await sheetsService.getUserSessionsByUserId(userId);
      const activeSessions = userSessions.filter(session => session.isActive === true);
      
      // Deactivate all sessions
      for (const session of activeSessions) {
        await sheetsService.updateUserSession(session.id, {
          isActive: false,
          updatedAt: new Date().toISOString()
        });
      }
      
      logger.info(`All sessions invalidated for user: ${req.user.email}`);

      res.json({
        message: 'All sessions invalidated successfully',
        sessionsTerminated: activeSessions.length,
        details: 'All tokens for this user have been invalidated'
      });

    } catch (error) {
      logger.error('Invalidate all sessions error:', error.message);
      res.status(500).json({
        error: 'Failed to invalidate sessions',
        message: 'An error occurred while invalidating sessions'
      });
    }
  }
}

const authController = new AuthController();

module.exports = {
  register: authController.register.bind(authController),
  login: authController.login.bind(authController),
  logout: authController.logout.bind(authController),
  getProfile: authController.getProfile.bind(authController),
  updateProfile: authController.updateProfile.bind(authController),
  invalidateAllSessions: authController.invalidateAllSessions.bind(authController)
};
