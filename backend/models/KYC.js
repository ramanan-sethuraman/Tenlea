const { createModel } = require('../config/store');

const KYC = createModel('KYC', {
  userId: null,
  documentType: 'AADHAAR',
  documentNumber: '',
  documentUrl: '',
  selfieUrl: '',
  status: 'PENDING',
  rejectionReason: '',
  reviewedBy: null,
  reviewedAt: null,
});

module.exports = KYC;
