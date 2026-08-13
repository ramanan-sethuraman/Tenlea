const User = require('./models/User');
const Land = require('./models/Land');
const ParkingSpace = require('./models/ParkingSpace');
const Vehicle = require('./models/Vehicle');
const Booking = require('./models/Booking');
const Agreement = require('./models/Agreement');
const Dispute = require('./models/Dispute');

const populateDatabase = async () => {
  try {
    const existingUsersCount = await User.countDocuments();
    if (existingUsersCount > 0) {
      console.log(`[Database Engine]: ${existingUsersCount} user records already exist in MongoDB.`);
      return;
    }

    console.log('[Database Engine]: Populating initial demo data into MongoDB...');

    // Create Demo Users
    const admin = await User.create({
      name: 'TENLEA Super Admin',
      email: 'admin@tenlea.com',
      phone: '+91 98765 00001',
      password: 'password123',
      role: 'ADMIN',
      kycStatus: 'VERIFIED',
    });

    const landowner1 = await User.create({
      name: 'Sanjay Kumar',
      email: 'sanjay@landowner.com',
      phone: '+91 98765 11111',
      password: 'password123',
      role: 'LANDOWNER',
      kycStatus: 'VERIFIED',
    });

    const landowner2 = await User.create({
      name: 'Ananya Sharma',
      email: 'ananya@landowner.com',
      phone: '+91 98765 22222',
      password: 'password123',
      role: 'LANDOWNER',
      kycStatus: 'VERIFIED',
    });

    const driver1 = await User.create({
      name: 'Rahul Dravid',
      email: 'rahul@driver.com',
      phone: '+91 98765 33333',
      password: 'password123',
      role: 'VEHICLE_OWNER',
      kycStatus: 'VERIFIED',
    });

    const driver2 = await User.create({
      name: 'Priya Patel',
      email: 'priya@driver.com',
      phone: '+91 98765 44444',
      password: 'password123',
      role: 'VEHICLE_OWNER',
      kycStatus: 'VERIFIED',
    });

    // Create Land Plots
    const land1 = await Land.create({
      landownerId: landowner1._id,
      title: 'Indiranagar Prime Vacant Plot',
      description: 'Fully gated 4,000 sq ft paved land in Indiranagar 100ft road. 24/7 CCTV, electric gate access, lighting, and security guard on duty.',
      address: '100 Feet Road, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pinCode: '560038',
      latitude: 12.9784,
      longitude: 77.6408,
      totalArea: '4,000 sq ft',
      availableArea: '3,200 sq ft',
      amenities: ['CCTV 24/7', 'Gated Security', 'Covered Roof', 'EV Charging', 'Paved Surface'],
      verificationStatus: 'VERIFIED',
      images: ['https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&q=80'],
    });

    const land2 = await Land.create({
      landownerId: landowner2._id,
      title: 'Koramangala Commercial Corner Land',
      description: 'Spacious secured open compound near Forum Mall Koramangala. Ideal for cars, SUVs, and long-term vehicle storage.',
      address: '5th Block, Koramangala',
      city: 'Bengaluru',
      state: 'Karnataka',
      pinCode: '560095',
      latitude: 12.9352,
      longitude: 77.6245,
      totalArea: '6,500 sq ft',
      availableArea: '5,000 sq ft',
      amenities: ['CCTV 24/7', 'Gated Security', 'Night Lighting', 'Water Wash Available'],
      verificationStatus: 'VERIFIED',
      images: ['https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&q=80'],
    });

    // Create Parking Spaces
    const space1 = await ParkingSpace.create({
      landId: land1._id,
      landownerId: landowner1._id,
      title: 'Indiranagar Covered Sedan Bay A-1',
      description: 'Premium covered sedan/SUV slot with dedicated EV charger point.',
      spaceSize: 'Standard Car / Sedan',
      vehicleTypesAllowed: ['4-Wheeler Car', 'SUV'],
      pricePerDay: 250,
      pricePerMonth: 4500,
      amenities: ['CCTV 24/7', 'Covered Roof', 'Gated Security', 'EV Charging'],
      availabilityStatus: 'AVAILABLE',
      verificationStatus: 'APPROVED',
      images: ['https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&q=80'],
    });

    const space2 = await ParkingSpace.create({
      landId: land2._id,
      landownerId: landowner2._id,
      title: 'Koramangala Open SUV Bay B-3',
      description: 'Extra-wide SUV parking slot in 24/7 secured perimeter compound.',
      spaceSize: 'Large SUV / Truck',
      vehicleTypesAllowed: ['SUV', '4-Wheeler Car'],
      pricePerDay: 300,
      pricePerMonth: 5500,
      amenities: ['CCTV 24/7', 'Gated Security', 'Night Lighting'],
      availabilityStatus: 'AVAILABLE',
      verificationStatus: 'APPROVED',
      images: ['https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&q=80'],
    });

    // Create Vehicles
    const vehicle1 = await Vehicle.create({
      ownerId: driver1._id,
      vehicleNumber: 'KA-01-MJ-8899',
      brand: 'Hyundai',
      model: 'Creta 1.5 SX',
      vehicleType: '4-Wheeler Car / SUV',
    });

    // Create Booking & Agreement
    const booking1 = await Booking.create({
      parkingSpaceId: space1._id,
      landownerId: landowner1._id,
      vehicleOwnerId: driver1._id,
      vehicleId: vehicle1._id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      durationDays: 30,
      totalAmount: 4500,
      paymentStatus: 'PAID',
      bookingStatus: 'ACTIVE',
      qrCode: 'TENLEA-QR-BOOKING-8899-2026',
    });

    await Agreement.create({
      bookingId: booking1._id,
      landownerId: landowner1._id,
      vehicleOwnerId: driver1._id,
      vehicleId: vehicle1._id,
      parkingSpaceId: space1._id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      amount: 4500,
      terms: 'Standard TENLEA digital lease terms apply. 30-day notice required for cancellation.',
      landownerAccepted: true,
      vehicleOwnerAccepted: true,
      status: 'ACCEPTED_BY_BOTH',
    });

    console.log('[Database Engine]: Database populated successfully with initial records!');
  } catch (err) {
    console.error('[Database Engine Error]: Failed to populate initial data:', err.message);
  }
};

module.exports = populateDatabase;
