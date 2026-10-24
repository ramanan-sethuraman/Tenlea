const { createModel } = require('../config/store');

const Vehicle = createModel('Vehicle', {
  ownerId: null,
  vehicleType: '4-Wheeler Car / SUV',
  brand: '',
  model: '',
  vehicleNumber: '',
  registrationDocument: '',
  images: [],
});

module.exports = Vehicle;
