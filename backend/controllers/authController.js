const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'tenlea_super_secret_jwt_key_2026_production_ready',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields (Name, Email, Phone, Password)' });
    }

    const cleanEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists. Please Sign In.' });
    }

    const userRole = role === 'LANDOWNER' ? 'LANDOWNER' : role === 'ADMIN' ? 'ADMIN' : 'VEHICLE_OWNER';

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      password,
      role: userRole,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        kycStatus: user.kycStatus,
      },
    });
  } catch (error) {
    console.error('[Register Error]:', error.message);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please Sign In.'
      });
    }
    return res.status(400).json({
      success: false,
      message: error.message || 'Registration failed. Please check your details and try again.'
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email address and password' });
    }

    const cleanEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: cleanEmail }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password. Please try again.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password. Please try again.' });
    }

    if (user.accountStatus === 'SUSPENDED') {
      return res.status(403).json({ success: false, message: 'Your account has been suspended. Please contact support.' });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        kycStatus: user.kycStatus,
      },
    });
  } catch (error) {
    console.error('[Login Error]:', error.message);
    return res.status(400).json({
      success: false,
      message: error.message || 'Login failed. Please check your details and try again.'
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('[GetMe Error]:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch user session' });
  }
};
