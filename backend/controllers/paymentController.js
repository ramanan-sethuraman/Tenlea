const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');

// @desc    Create Razorpay / Demo Escrow Payment Order
// @route   POST /api/v1/payments/create-order
// @access  Private (Vehicle Owner)
exports.createPaymentOrder = async (req, res, next) => {
  try {
    const { bookingId, paymentGateway = 'DEMO_ESCROW' } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const platformFee = Math.round(booking.totalAmount * 0.10); // 10% platform fee
    const orderId = `order_demo_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    res.status(200).json({
      success: true,
      message: 'Payment order created successfully',
      data: {
        orderId,
        bookingId: booking._id,
        amount: booking.totalAmount + platformFee + booking.securityDeposit,
        currency: 'INR',
        parkingFee: booking.totalAmount,
        platformFee,
        securityDeposit: booking.securityDeposit,
        paymentGateway,
        mode: paymentGateway === 'DEMO_ESCROW' ? 'DEMO PAYMENT MODE' : 'LIVE RAZORPAY',
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify payment and confirm booking
// @route   POST /api/v1/payments/verify
// @access  Private (Vehicle Owner)
exports.verifyPayment = async (req, res, next) => {
  try {
    const { bookingId, transactionId, paymentGateway = 'DEMO_ESCROW' } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const platformFee = Math.round(booking.totalAmount * 0.10);
    const txnId = transactionId || `TXN-DEMO-${Date.now()}`;

    const payment = await Payment.create({
      bookingId: booking._id,
      payerId: req.user._id,
      receiverId: booking.landownerId,
      amount: booking.totalAmount,
      platformFee,
      transactionId: txnId,
      paymentGateway,
      status: 'SUCCESS',
    });

    booking.paymentStatus = 'PAID';
    booking.bookingStatus = 'CONFIRMED';
    await booking.save();

    await Notification.create({
      userId: booking.landownerId,
      title: 'Payment Received (Escrow)',
      message: `Booking #${booking._id.toString().substring(18)} payment of ₹${booking.totalAmount} secured in escrow.`,
      type: 'PAYMENT',
    });

    await Notification.create({
      userId: booking.vehicleOwnerId,
      title: 'Payment Successful',
      message: `Your booking for ${booking.durationDays} days is confirmed! QR check-in enabled.`,
      type: 'PAYMENT',
    });

    res.status(200).json({
      success: true,
      message: 'Payment verified and booking confirmed successfully',
      data: { payment, booking },
    });
  } catch (error) {
    next(error);
  }
};
