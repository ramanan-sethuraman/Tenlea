const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  vehicleType: {
    type: String,
    enum: ['2-Wheeler Bike', '4-Wheeler Car / SUV', 'Commercial Van'],
    required: true,
  },
  brand: {
    type: String,
    required: [true, 'Vehicle brand/make is required'],
  },
  model: {
    type: String,
    required: [true, 'Vehicle model is required'],
  },
  vehicleNumber: {
    type: String,
    required: [true, 'Registration plate number is required'],
    uppercase: true,
    trim: true,
  },
  registrationDocument: {
    type: String,
    default: '',
  },
  images: [{
    type: String,
  }],
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
