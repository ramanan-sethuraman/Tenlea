const KYC = require('../models/KYC');
const User = require('../models/User');

// In-Memory Aadhaar OTP Storage
const aadhaarOtpStore = new Map();

// @desc    Send OTP to mobile linked with Aadhaar ID
// @route   POST /api/v1/kyc/send-aadhaar-otp
// @access  Public / Private
exports.sendAadhaarOtp = async (req, res, next) => {
  try {
    const { aadhaarNumber } = req.body;
    const cleanNumber = (aadhaarNumber || '').toString().replace(/\D/g, '');

    if (!cleanNumber || cleanNumber.length !== 12) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 12-digit Aadhaar number',
      });
    }

    // Demo OTP is 282828 for testing, valid for 10 minutes
    const demoOtp = '282828';
    const lastFour = cleanNumber.slice(-4);
    const maskedAadhaar = `XXXX-XXXX-${lastFour}`;

    aadhaarOtpStore.set(cleanNumber, {
      otp: demoOtp,
      expiresAt: Date.now() + 10 * 60 * 1000,
      createdAt: new Date().toISOString(),
    });

    res.status(200).json({
      success: true,
      message: `UIDAI OTP sent successfully to the registered mobile number linked with Aadhaar (ending in ...${lastFour})`,
      data: {
        maskedAadhaar,
        demoOtp,
        expiresInSeconds: 600,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Aadhaar OTP
// @route   POST /api/v1/kyc/verify-aadhaar-otp
// @access  Public / Private
exports.verifyAadhaarOtp = async (req, res, next) => {
  try {
    const { aadhaarNumber, otp } = req.body;
    const cleanNumber = (aadhaarNumber || '').toString().replace(/\D/g, '');
    const cleanOtp = (otp || '').toString().trim();

    if (!cleanNumber || cleanNumber.length !== 12) {
      return res.status(400).json({
        success: false,
        verified: false,
        message: 'A valid 12-digit Aadhaar number is required',
      });
    }

    if (!cleanOtp) {
      return res.status(400).json({
        success: false,
        verified: false,
        message: 'Please enter the 6-digit OTP',
      });
    }

    const record = aadhaarOtpStore.get(cleanNumber);
    const isValid = cleanOtp === '282828' || (record && record.otp === cleanOtp);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        verified: false,
        message: 'Invalid OTP entered. Please enter valid OTP (Demo: 282828)',
      });
    }

    // If authenticated user is present, update user's KYC status to VERIFIED
    if (req.user && req.user._id) {
      await User.findByIdAndUpdate(req.user._id, { kycStatus: 'VERIFIED' });
      
      let kyc = await KYC.findOne({ userId: req.user._id });
      if (kyc) {
        kyc.documentType = 'AADHAAR';
        kyc.documentNumber = cleanNumber;
        kyc.status = 'VERIFIED';
        kyc.aadhaarOtpVerified = true;
        kyc.aadhaarVerifiedAt = new Date().toISOString();
        await kyc.save();
      } else {
        await KYC.create({
          userId: req.user._id,
          documentType: 'AADHAAR',
          documentNumber: cleanNumber,
          status: 'VERIFIED',
          aadhaarOtpVerified: true,
          aadhaarVerifiedAt: new Date().toISOString(),
        });
      }
    }

    const lastFour = cleanNumber.slice(-4);
    res.status(200).json({
      success: true,
      verified: true,
      message: 'Aadhaar ID verified successfully via UIDAI OTP',
      data: {
        maskedAadhaar: `XXXX-XXXX-${lastFour}`,
        verificationMethod: 'UIDAI_OTP',
        verifiedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit KYC document & selfie
// @route   POST /api/v1/kyc
// @access  Private
exports.submitKYC = async (req, res, next) => {
  try {
    const { documentType, documentNumber, documentUrl, selfieUrl, aadhaarOtpVerified } = req.body;

    if (!documentType || !documentNumber) {
      return res.status(400).json({ success: false, message: 'Please provide document type and number' });
    }

    const isVerified = Boolean(aadhaarOtpVerified);
    const newStatus = isVerified ? 'VERIFIED' : 'UNDER_REVIEW';

    let kyc = await KYC.findOne({ userId: req.user._id });
    if (kyc) {
      kyc.documentType = documentType;
      kyc.documentNumber = documentNumber;
      if (documentUrl) kyc.documentUrl = documentUrl;
      if (selfieUrl) kyc.selfieUrl = selfieUrl;
      kyc.status = newStatus;
      kyc.aadhaarOtpVerified = isVerified;
      if (isVerified) kyc.aadhaarVerifiedAt = new Date().toISOString();
      await kyc.save();
    } else {
      kyc = await KYC.create({
        userId: req.user._id,
        documentType,
        documentNumber,
        documentUrl: documentUrl || '/uploads/demo-id.jpg',
        selfieUrl: selfieUrl || '/uploads/demo-selfie.jpg',
        status: newStatus,
        aadhaarOtpVerified: isVerified,
        aadhaarVerifiedAt: isVerified ? new Date().toISOString() : null,
      });
    }

    await User.findByIdAndUpdate(req.user._id, { kycStatus: newStatus });

    res.status(200).json({
      success: true,
      message: isVerified ? 'Aadhaar verified via OTP! KYC approved.' : 'KYC submitted successfully for admin review',
      data: kyc,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get KYC status for current user
// @route   GET /api/v1/kyc/status
// @access  Private
exports.getKYCStatus = async (req, res, next) => {
  try {
    const kyc = await KYC.findOne({ userId: req.user._id });
    res.status(200).json({
      success: true,
      data: kyc || { status: req.user.kycStatus },
    });
  } catch (error) {
    next(error);
  }
};
