const { createModel } = require('../config/store');

const Agreement = createModel('Agreement', {
  bookingId: null,
  landownerId: null,
  vehicleOwnerId: null,
  vehicleId: null,
  parkingSpaceId: null,
  startDate: null,
  endDate: null,
  amount: 0,
  terms: 'Standard TENLEA Parking Space Rental Terms & Conditions. Escrow protected.',
  landownerAccepted: false,
  vehicleOwnerAccepted: false,
  documentUrl: '',
  status: 'PENDING',
});

module.exports = Agreement;
