const Agreement = require('../models/Agreement');
const Booking = require('../models/Booking');

// @desc    Get agreement for booking
// @route   GET /api/v1/agreements/booking/:bookingId
// @access  Private
exports.getAgreementByBooking = async (req, res, next) => {
  try {
    const agreement = await Agreement.findOne({ bookingId: req.params.bookingId })
      .populate('landownerId vehicleOwnerId vehicleId parkingSpaceId');

    if (!agreement) {
      return res.status(404).json({ success: false, message: 'Digital agreement not found for this booking' });
    }

    res.status(200).json({
      success: true,
      data: agreement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept digital agreement
// @route   PUT /api/v1/agreements/:id/accept
// @access  Private
exports.acceptAgreement = async (req, res, next) => {
  try {
    const agreement = await Agreement.findById(req.params.id);
    if (!agreement) {
      return res.status(404).json({ success: false, message: 'Agreement not found' });
    }

    if (req.user.role === 'LANDOWNER') {
      agreement.landownerAccepted = true;
    } else {
      agreement.vehicleOwnerAccepted = true;
    }

    if (agreement.landownerAccepted && agreement.vehicleOwnerAccepted) {
      agreement.status = 'ACCEPTED_BY_BOTH';
      await Booking.findByIdAndUpdate(agreement.bookingId, { agreementStatus: 'ACCEPTED_BY_BOTH' });
    }

    await agreement.save();

    res.status(200).json({
      success: true,
      message: 'Digital agreement signed successfully',
      data: agreement,
    });
  } catch (error) {
    next(error);
  }
};
