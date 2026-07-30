const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  parkingSpaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParkingSpace',
    required: true,
  },
  landownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  vehicleOwnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  durationDays: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  securityDeposit: {
    type: Number,
    default: 500,
  },
  bookingStatus: {
    type: String,
    enum: ['REQUESTED', 'ACCEPTED', 'REJECTED', 'PAYMENT_PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'DISPUTED'],
    default: 'REQUESTED',
  },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'PAID', 'REFUNDED'],
    default: 'PENDING',
  },
  agreementStatus: {
    type: String,
    enum: ['PENDING', 'ACCEPTED_BY_BOTH'],
    default: 'PENDING',
  },
  checkInTime: {
    type: Date,
  },
  checkOutTime: {
    type: Date,
  },
  qrCode: {
    type: String,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
