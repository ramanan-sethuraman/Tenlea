const { createModel } = require('../config/store');

const Payment = createModel('Payment', {
  bookingId: null,
  payerId: null,
  receiverId: null,
  amount: 0,
  platformFee: 0,
  transactionId: '',
  paymentGateway: 'DEMO_ESCROW',
  status: 'SUCCESS',
});

module.exports = Payment;
