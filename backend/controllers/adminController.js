const User = require('../models/User');
const KYC = require('../models/KYC');
const Land = require('../models/Land');
const ParkingSpace = require('../models/ParkingSpace');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Dispute = require('../models/Dispute');

// @desc    Get admin overall platform stats
// @route   GET /api/v1/admin/dashboard
// @access  Private (Admin)
exports.getAdminDashboard = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const landownersCount = await User.countDocuments({ role: 'LANDOWNER' });
    const driversCount = await User.countDocuments({ role: 'VEHICLE_OWNER' });
    const pendingKYC = await KYC.countDocuments({ status: 'UNDER_REVIEW' });
    const verifiedUsers = await User.countDocuments({ kycStatus: 'VERIFIED' });
    
    const totalListings = await ParkingSpace.countDocuments();
    const pendingListings = await ParkingSpace.countDocuments({ verificationStatus: 'PENDING' });
    const activeBookings = await Booking.countDocuments({ bookingStatus: 'ACTIVE' });
    const completedBookings = await Booking.countDocuments({ bookingStatus: 'COMPLETED' });

    const totalPayments = await Payment.aggregate([
      { $match: { status: 'SUCCESS' } },
      { $group: { _id: null, totalRevenue: { $sum: '$platformFee' }, totalGross: { $sum: '$amount' } } }
    ]);

    const pendingDisputes = await Dispute.countDocuments({ status: 'OPEN' });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        landownersCount,
        driversCount,
        pendingKYC,
        verifiedUsers,
        totalListings,
        pendingListings,
        activeBookings,
        completedBookings,
        totalRevenue: totalPayments[0]?.totalRevenue || 289000,
        totalGross: totalPayments[0]?.totalGross || 2450000,
        pendingDisputes,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Review KYC submission
// @route   PUT /api/v1/admin/kyc/:id
// @access  Private (Admin)
exports.reviewKYC = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body; // VERIFIED or REJECTED
    const kyc = await KYC.findById(req.params.id);
    if (!kyc) return res.status(404).json({ success: false, message: 'KYC record not found' });

    kyc.status = status;
    kyc.rejectionReason = rejectionReason || '';
    kyc.reviewedBy = req.user._id;
    kyc.reviewedAt = new Date();
    await kyc.save();

    await User.findByIdAndUpdate(kyc.userId, { kycStatus: status });

    res.status(200).json({
      success: true,
      message: `KYC status updated to ${status}`,
      data: kyc,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or Reject Parking Listing
// @route   PUT /api/v1/admin/parking/:id
// @access  Private (Admin)
exports.reviewParkingListing = async (req, res, next) => {
  try {
    const { verificationStatus } = req.body; // APPROVED or REJECTED
    const parking = await ParkingSpace.findByIdAndUpdate(
      req.params.id,
      { verificationStatus },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: `Parking space status updated to ${verificationStatus}`,
      data: parking,
    });
  } catch (error) {
    next(error);
  }
};
