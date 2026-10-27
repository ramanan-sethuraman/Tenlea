const { generateToken } = require('../config/jwt');
const User = require('../models/User');

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

    // Password Policy: Only Admin can use 7-letter password ('admin28'); users must have 8-10 chars, 1 uppercase, 1 special char
    if (password.length === 7) {
      return res.status(400).json({
        success: false,
        message: 'Only admin can login with 7 letter passwords. All users must register with 8 to 10 characters, at least one capital letter, and one special character.'
      });
    }

    if (password.length < 8 || password.length > 10) {
      return res.status(400).json({
        success: false,
        message: 'Password must be between 8 and 10 characters in length.'
      });
    }

    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least one capital (uppercase) letter.'
      });
    }

    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least one special character (e.g. !@#$%^&*).'
      });
    }

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists. Please Sign In.' });
    }

    const userRole = role === 'LANDOWNER' ? 'LANDOWNER' : 'VEHICLE_OWNER';

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

    // Support both admin@tenlea and admin@tenlea.com as admin ID
    const isAdminQuery = cleanEmail === 'admin@tenlea' || cleanEmail === 'admin@tenlea.com';

    // Password Policy: Only Admin can login with 7-letter password ('admin28'). All users must use 8-10 chars, 1 uppercase, 1 special char.
    if (isAdminQuery) {
      if (password !== 'admin28') {
        return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
      }
    } else {
      if (password.length === 7) {
        return res.status(400).json({
          success: false,
          message: 'Only admin can login with 7 letter passwords. All users must login with 8 to 10 characters, at least one capital letter, and one special character.'
        });
      }

      if (password.length < 8 || password.length > 10) {
        return res.status(400).json({
          success: false,
          message: 'User password must be between 8 and 10 characters.'
        });
      }

      if (!/[A-Z]/.test(password)) {
        return res.status(400).json({
          success: false,
          message: 'User password must contain at least one capital (uppercase) letter.'
        });
      }

      if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(password)) {
        return res.status(400).json({
          success: false,
          message: 'User password must contain at least one special character (e.g. !@#$%^&*).'
        });
      }
    }

    const query = isAdminQuery
      ? { email: { $in: ['admin@tenlea', 'admin@tenlea.com'] } }
      : { email: cleanEmail };

    let user = null;
    try {
      user = await User.findOne(query).select('+password');

      // Auto-provision admin user if missing
      if (!user && isAdminQuery && password === 'admin28') {
        user = await User.create({
          name: 'TENLEA Super Admin',
          email: 'admin@tenlea',
          phone: '+91 98765 00001',
          password: 'admin28',
          role: 'ADMIN',
          kycStatus: 'VERIFIED',
        });
        user = await User.findById(user._id).select('+password');
      }
    } catch (lookupErr) {
      console.warn('[User Lookup Warning in Login]:', lookupErr.message);
    }

    // Direct fallback for admin@tenlea
    if (!user && isAdminQuery && password === 'admin28') {
      const token = generateToken('admin_root_usr_01');
      return res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        token,
        data: {
          _id: 'admin_root_usr_01',
          name: 'TENLEA Super Admin',
          email: 'admin@tenlea',
          phone: '+91 98765 00001',
          role: 'ADMIN',
          kycStatus: 'VERIFIED',
        },
      });
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password. Please try again.' });
    }

    let isMatch = await user.matchPassword(password);
    // Allow admin28 to match and upgrade legacy admin password
    if (!isMatch && user.role === 'ADMIN' && password === 'admin28') {
      try {
        user.password = 'admin28';
        await user.save();
      } catch (saveErr) {
        console.warn('[Admin Password Save Warning]:', saveErr.message);
      }
      isMatch = true;
    }

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
