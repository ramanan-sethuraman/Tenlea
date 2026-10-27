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
      const { verifyToken } = require('../config/jwt');
      const User = require('../models/User');
      const token = req.headers.authorization.split(' ')[1];
      const decoded = verifyToken(token);
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
