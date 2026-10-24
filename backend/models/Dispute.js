const { createModel } = require('../config/store');

const Dispute = createModel('Dispute', {
  bookingId: null,
  raisedBy: null,
  reason: '',
  description: '',
  evidence: [],
  status: 'OPEN',
  adminResponse: '',
  resolvedBy: null,
});

module.exports = Dispute;
