const mongoose = require('mongoose');

const parkingSpaceSchema = new mongoose.Schema({
  landId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Land',
    required: true,
  },
  landownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Parking space title is required'],
    trim: true,
  },
  description: {
    type: String,
  },
  spaceSize: {
    type: String,
    enum: ['Compact (2-Wheeler)', 'Standard Car / Sedan', 'Large SUV / Truck', 'Open Plot'],
    default: 'Standard Car / Sedan',
  },
  vehicleTypesAllowed: [{
    type: String, // '2-Wheeler', '4-Wheeler Car', 'SUV', 'Commercial Van'
  }],
  pricePerDay: {
    type: Number,
    required: [true, 'Daily price is required'],
  },
  pricePerMonth: {
    type: Number,
    required: [true, 'Monthly price is required'],
  },
  amenities: [{
    type: String, // 'CCTV 24/7', 'Covered Roof', 'Gated Security', 'EV Charging'
  }],
  images: [{
    type: String,
  }],
  availabilityStatus: {
    type: String,
    enum: ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE'],
    default: 'AVAILABLE',
  },
  verificationStatus: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING',
  },
}, { timestamps: true });

module.exports = mongoose.model('ParkingSpace', parkingSpaceSchema);
