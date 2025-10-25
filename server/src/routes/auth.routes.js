const express = require('express');
const { register, login, logout, getProfile, updateProfile, invalidateAllSessions } = require('../controllers/auth.controller');
const { auth } = require('../middlewares/auth.middleware');
const { 
  registerSchema, 
  loginSchema, 
  updateProfileSchema,
  validate 
} = require('../validations/auth.validation');

const router = express.Router();

// Authentication routes
router.post('/auth/register', validate(registerSchema), register);
router.post('/auth/login', validate(loginSchema), login);
router.post('/auth/logout', auth, logout);

// User profile routes (protected)
router.get('/users/profile', auth, getProfile);
router.put('/users/profile', auth, validate(updateProfileSchema), updateProfile);

// Security routes (protected)
router.post('/auth/invalidate-all-sessions', auth, invalidateAllSessions);

module.exports = router;
