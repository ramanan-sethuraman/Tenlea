const { createModel } = require('../config/store');

const ParkingSpace = createModel('ParkingSpace', {
  landId: null,
  landownerId: null,
  title: '',
  description: '',
  spaceSize: 'Standard Car / Sedan',
  vehicleTypesAllowed: ['4-Wheeler Car', 'SUV'],
  pricePerDay: 250,
  pricePerMonth: 4000,
  amenities: ['CCTV 24/7', 'Covered Roof', 'Gated Security'],
  images: [],
  availabilityStatus: 'AVAILABLE',
  verificationStatus: 'APPROVED',
});

module.exports = ParkingSpace;
