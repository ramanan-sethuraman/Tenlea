const { createModel } = require('../config/store');

const Land = createModel('Land', {
  landownerId: null,
  title: '',
  description: '',
  address: '',
  city: 'Bengaluru',
  state: 'Karnataka',
  pinCode: '',
  latitude: 12.9716,
  longitude: 77.5946,
  images: [],
  totalArea: '',
  availableArea: '',
  amenities: [],
  verificationStatus: 'PENDING',
});

module.exports = Land;
