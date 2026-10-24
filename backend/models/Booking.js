const { createModel } = require('../config/store');

const Booking = createModel('Booking', {
  parkingSpaceId: null,
  landownerId: null,
  vehicleOwnerId: null,
  vehicleId: null,
  startDate: null,
  endDate: null,
  durationDays: 1,
  totalAmount: 0,
  securityDeposit: 500,
  bookingStatus: 'REQUESTED',
  paymentStatus: 'PENDING',
  agreementStatus: 'PENDING',
  checkInTime: null,
  checkOutTime: null,
  qrCode: '',
});

module.exports = Booking;
