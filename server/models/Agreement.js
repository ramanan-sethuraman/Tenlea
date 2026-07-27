const mongoose = require('mongoose');

const agreementSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
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
  parkingSpaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParkingSpace',
    required: true,
  },
  startDate: Date,
  endDate: Date,
  amount: Number,
  terms: {
    type: String,
    default: 'Standard TENLEA Parking Space Rental Terms & Conditions. Escrow protected.',
  },
  landownerAccepted: {
    type: Boolean,
    default: false,
  },
  vehicleOwnerAccepted: {
    type: Boolean,
    default: false,
  },
  documentUrl: String,
  status: {
    type: String,
    enum: ['PENDING', 'ACCEPTED_BY_BOTH'],
    default: 'PENDING',
  },
}, { timestamps: true });

module.exports = mongoose.model('Agreement', agreementSchema);
