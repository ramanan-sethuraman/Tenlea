const mongoose = require('mongoose');

const kycSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  documentType: {
    type: String,
    enum: ['AADHAAR', 'PAN', 'DRIVING_LICENSE', 'PASSPORT'],
    required: true,
  },
  documentNumber: {
    type: String,
    required: true,
    trim: true,
  },
  documentUrl: {
    type: String,
    required: true,
  },
  selfieUrl: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED'],
    default: 'PENDING',
  },
  rejectionReason: {
    type: String,
    default: '',
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  reviewedAt: {
    type: Date,
  },
}, { timestamps: true });

module.exports = mongoose.model('KYC', kycSchema);
