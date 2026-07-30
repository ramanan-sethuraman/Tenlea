const mongoose = require('mongoose');

const landSchema = new mongoose.Schema({
  landownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Land title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Land description is required'],
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
  },
  city: {
    type: String,
    required: [true, 'City is required'],
  },
  state: {
    type: String,
    required: [true, 'State is required'],
  },
  pinCode: {
    type: String,
    required: [true, 'PIN code is required'],
  },
  latitude: {
    type: Number,
    default: 12.9716, // Default Bengaluru coordinates
  },
  longitude: {
    type: Number,
    default: 77.5946,
  },
  images: [{
    type: String,
  }],
  totalArea: {
    type: String,
    required: true, // e.g. "2,400 sq ft"
  },
  availableArea: {
    type: String,
    required: true,
  },
  amenities: [{
    type: String,
  }],
  verificationStatus: {
    type: String,
    enum: ['PENDING', 'VERIFIED', 'REJECTED'],
    default: 'PENDING',
  },
}, { timestamps: true });

// Geospatial index for nearby searches
landSchema.index({ latitude: 1, longitude: 1 });

module.exports = mongoose.model('Land', landSchema);
