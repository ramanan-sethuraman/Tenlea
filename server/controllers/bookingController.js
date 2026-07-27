const Booking = require('../models/Booking');
const ParkingSpace = require('../models/ParkingSpace');
const Agreement = require('../models/Agreement');
const Notification = require('../models/Notification');

// @desc    Request a new booking (Validates date overlaps to prevent double booking)
// @route   POST /api/v1/bookings
// @access  Private (Vehicle Owner)
exports.createBooking = async (req, res, next) => {
  try {
    const { parkingSpaceId, vehicleId, startDate, endDate } = req.body;

    if (!parkingSpaceId || !vehicleId || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Please provide parking space, vehicle, start date and end date' });
    }

    const space = await ParkingSpace.findById(parkingSpaceId);
    if (!space) {
      return res.status(404).json({ success: false, message: 'Parking space not found' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({ success: false, message: 'End date must be after start date' });
    }

    // Check for double booking overlap
    const existingOverlap = await Booking.findOne({
      parkingSpaceId,
      bookingStatus: { $in: ['ACCEPTED', 'PAYMENT_PENDING', 'CONFIRMED', 'ACTIVE'] },
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } },
      ],
    });

    if (existingOverlap) {
      return res.status(400).json({
        success: false,
        message: 'This parking space is unavailable for the selected dates. Please choose different dates.',
      });
    }

    // Calculate duration & total amount
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const totalAmount = diffDays * space.pricePerDay;

    const booking = await Booking.create({
      parkingSpaceId,
      landownerId: space.landownerId,
      vehicleOwnerId: req.user._id,
      vehicleId,
      startDate: start,
      endDate: end,
      durationDays: diffDays,
      totalAmount,
      securityDeposit: 500,
      bookingStatus: 'REQUESTED',
      paymentStatus: 'PENDING',
      qrCode: `TENLEA-QR-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
    });

    // Send notification to landowner
    await Notification.create({
      userId: space.landownerId,
      title: 'New Booking Request',
      message: `You have a new parking booking request for "${space.title}" (${diffDays} days).`,
      type: 'BOOKING',
    });

    res.status(201).json({
      success: true,
      message: 'Booking request submitted to landowner',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept booking request (Landowner)
// @route   PUT /api/v1/bookings/:id/accept
// @access  Private (Landowner)
exports.acceptBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.landownerId.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Unauthorized action' });
    }

    booking.bookingStatus = 'ACCEPTED';
    await booking.save();

    // Auto-generate Digital Agreement (Phase 8 integration)
    let agreement = await Agreement.findOne({ bookingId: booking._id });
    if (!agreement) {
      agreement = await Agreement.create({
        bookingId: booking._id,
        landownerId: booking.landownerId,
        vehicleOwnerId: booking.vehicleOwnerId,
        vehicleId: booking.vehicleId,
        parkingSpaceId: booking.parkingSpaceId,
        startDate: booking.startDate,
        endDate: booking.endDate,
        amount: booking.totalAmount,
        landownerAccepted: true,
        vehicleOwnerAccepted: false,
        status: 'PENDING',
      });
    }

    // Notify driver
    await Notification.create({
      userId: booking.vehicleOwnerId,
      title: 'Booking Accepted!',
      message: `Your booking request has been accepted. Please review digital agreement & proceed to payment.`,
      type: 'BOOKING',
    });

    res.status(200).json({
      success: true,
      message: 'Booking accepted and digital agreement generated',
      data: { booking, agreement },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject booking request
// @route   PUT /api/v1/bookings/:id/reject
// @access  Private (Landowner)
exports.rejectBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    booking.bookingStatus = 'REJECTED';
    await booking.save();

    await Notification.create({
      userId: booking.vehicleOwnerId,
      title: 'Booking Request Declined',
      message: `Your booking request was declined by the landowner.`,
      type: 'BOOKING',
    });

    res.status(200).json({
      success: true,
      message: 'Booking rejected',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user bookings
// @route   GET /api/v1/bookings
// @access  Private
exports.getUserBookings = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'LANDOWNER') {
      query = { landownerId: req.user._id };
    } else if (req.user.role === 'VEHICLE_OWNER') {
      query = { vehicleOwnerId: req.user._id };
    }

    const bookings = await Booking.find(query)
      .populate('parkingSpaceId vehicleId landownerId vehicleOwnerId')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};
