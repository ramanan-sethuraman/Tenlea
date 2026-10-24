const express = require('express');
const router = express.Router();
const { 
  submitKYC, 
  getKYCStatus, 
  sendAadhaarOtp, 
  verifyAadhaarOtp 
} = require('../controllers/kycController');
const { protect } = require('../middleware/authMiddleware');

// Optional auth helper for OTP verification routes
const optionalProtect = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const jwt = require('jsonwebtoken');
      const User = require('../models/User');
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tenlea_super_secret_jwt_key_2026_production_ready');
      req.user = await User.findById(decoded.id).select('-password');
    } catch (e) {
      // Ignore token failure for demo KYC verification
    }
  }
  next();
};

router.post('/send-aadhaar-otp', sendAadhaarOtp);
router.post('/verify-aadhaar-otp', optionalProtect, verifyAadhaarOtp);
router.post('/', protect, submitKYC);
router.get('/status', protect, getKYCStatus);

module.exports = router;
