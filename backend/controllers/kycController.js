const KYC = require('../models/KYC');
const User = require('../models/User');

// @desc    Submit KYC document & selfie
// @route   POST /api/v1/kyc
// @access  Private
exports.submitKYC = async (req, res, next) => {
  try {
    const { documentType, documentNumber, documentUrl, selfieUrl } = req.body;

    if (!documentType || !documentNumber) {
      return res.status(400).json({ success: false, message: 'Please provide document type and number' });
    }

    let kyc = await KYC.findOne({ userId: req.user._id });
    if (kyc) {
      kyc.documentType = documentType;
      kyc.documentNumber = documentNumber;
      if (documentUrl) kyc.documentUrl = documentUrl;
      if (selfieUrl) kyc.selfieUrl = selfieUrl;
      kyc.status = 'UNDER_REVIEW';
      await kyc.save();
    } else {
      kyc = await KYC.create({
        userId: req.user._id,
        documentType,
        documentNumber,
        documentUrl: documentUrl || '/uploads/demo-id.jpg',
        selfieUrl: selfieUrl || '/uploads/demo-selfie.jpg',
        status: 'UNDER_REVIEW',
      });
    }

    await User.findByIdAndUpdate(req.user._id, { kycStatus: 'UNDER_REVIEW' });

    res.status(200).json({
      success: true,
      message: 'KYC submitted successfully for admin review',
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
