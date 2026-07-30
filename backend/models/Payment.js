const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
  payerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  platformFee: {
    type: Number,
    required: true, // 8-12%
  },
  transactionId: {
    type: String,
    required: true,
  },
  paymentGateway: {
    type: String,
    enum: ['RAZORPAY', 'DEMO_ESCROW'],
    default: 'DEMO_ESCROW',
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'FAILED', 'PENDING', 'REFUNDED'],
    default: 'SUCCESS',
  },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
