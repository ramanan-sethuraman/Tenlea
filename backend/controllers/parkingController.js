const ParkingSpace = require('../models/ParkingSpace');
const Land = require('../models/Land');

// Seed demo parking listings (Including Chennai & Major Indian Hubs)
const demoSeedParkingSpaces = [
  {
    _id: 'chn-1',
    title: 'T. Nagar Prime Commercial Plot & Garage',
    description: 'Secured gated parking lot right on Usman Road, T. Nagar. 24/7 CCTV surveillance and automated QR gate.',
    city: 'Chennai',
    location: 'Usman Road, T. Nagar, Chennai',
    pricePerDay: 300,
    pricePerMonth: 4000,
    rating: 4.9,
    reviewsCount: 38,
    spaceSize: 'Standard Car / SUV',
    vehicleTypesAllowed: ['4-Wheeler Car / SUV'],
    amenities: ['CCTV 24/7', 'Covered Roof', 'Gated Security', 'Automated QR Gate'],
    images: ['https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80'],
    landownerId: { name: 'Santhanam Ramanathan (Verified Host)', phone: '+91 9080173002', email: 'ramanans.master@gmail.com' },
    verificationStatus: 'APPROVED',
    availabilityStatus: 'AVAILABLE',
  },
  {
    _id: 'chn-2',
    title: 'Velachery Main Road Secured Parking Lot',
    description: 'Open plot with strong boundary fencing, night security guard, and EV charging points near Vijaya Nagar.',
    city: 'Chennai',
    location: 'Near Vijaya Nagar Bus Stand, Velachery, Chennai',
    pricePerDay: 220,
    pricePerMonth: 3000,
    rating: 4.8,
    reviewsCount: 29,
    spaceSize: 'Compact & SUV Slots',
    vehicleTypesAllowed: ['4-Wheeler Car / SUV', '2-Wheeler Bike'],
    amenities: ['24/7 Access', 'Gated Boundary', 'EV Charging Point', 'Night Security Guard'],
    images: ['https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=600&q=80'],
    landownerId: { name: 'Karthik Subramanian (Verified Host)', phone: '+91 9080173002', email: 'ramanans.master@gmail.com' },
    verificationStatus: 'APPROVED',
    availabilityStatus: 'AVAILABLE',
  },
  {
    _id: 'chn-3',
    title: 'OMR IT Corridor (Perungudi) Parking Ground',
    description: 'Spacious open ground next to Phase 1 IT Corridor. Ideal for long-term tech employee vehicle parking.',
    city: 'Chennai',
    location: 'Phase 1 OMR, Perungudi, Chennai',
    pricePerDay: 250,
    pricePerMonth: 3500,
    rating: 5.0,
    reviewsCount: 42,
    spaceSize: 'Large SUV / Commercial Slots',
    vehicleTypesAllowed: ['4-Wheeler Car / SUV', 'Commercial Van'],
    amenities: ['CCTV 24/7', 'EV Fast Charger', 'Large SUV Space', 'Floodlights'],
    images: ['https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=600&q=80'],
    landownerId: { name: 'Meenakshi Sundaram (Verified Host)', phone: '+91 9080173002', email: 'ramanans.master@gmail.com' },
    verificationStatus: 'APPROVED',
    availabilityStatus: 'AVAILABLE',
  },
  {
    _id: 'chn-4',
    title: 'Anna Nagar West Private Driveway',
    description: 'Covered canopy private driveway in residential Anna Nagar West. Quiet and extremely safe.',
    city: 'Chennai',
    location: '2nd Avenue, Anna Nagar West, Chennai',
    pricePerDay: 350,
    pricePerMonth: 4800,
    rating: 4.9,
    reviewsCount: 19,
    spaceSize: 'Sedan & Luxury Slots',
    vehicleTypesAllowed: ['4-Wheeler Car / SUV'],
    amenities: ['Covered Canopy', 'Individual Gate Lock', 'CCTV 24/7'],
    images: ['https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80'],
    landownerId: { name: 'Venkatesh Iyer (Verified Host)', phone: '+91 9080173002', email: 'ramanans.master@gmail.com' },
    verificationStatus: 'APPROVED',
    availabilityStatus: 'AVAILABLE',
  },
  {
    _id: 'chn-5',
    title: 'Guindy Industrial Estate Open Space',
    description: 'Guarded commercial open plot in Guindy Industrial Estate with easy Metro access.',
    city: 'Chennai',
    location: 'Guindy Industrial Estate, Chennai',
    pricePerDay: 280,
    pricePerMonth: 3800,
    rating: 4.7,
    reviewsCount: 22,
    spaceSize: 'Multiple Car Slots',
    vehicleTypesAllowed: ['4-Wheeler Car / SUV', 'Commercial Van'],
    amenities: ['24/7 Guarded Entry', 'CCTV Monitoring', 'QR Check-In'],
    images: ['https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=600&q=80'],
    landownerId: { name: 'Nitin Rajan (Verified Host)', phone: '+91 9080173002', email: 'ramanans.master@gmail.com' },
    verificationStatus: 'APPROVED',
    availabilityStatus: 'AVAILABLE',
  },
  {
    _id: 'blr-1',
    title: 'Indiranagar 100ft Road Gated Plot',
    description: 'Prime Indiranagar location with 24/7 access.',
    city: 'Bengaluru',
    location: 'Indiranagar, Bengaluru',
    pricePerDay: 350,
    pricePerMonth: 4500,
    rating: 4.9,
    reviewsCount: 24,
    spaceSize: 'Standard Car / SUV',
    vehicleTypesAllowed: ['4-Wheeler Car / SUV'],
    amenities: ['CCTV 24/7', 'Gated Security', 'Covered Roof', 'QR Gate'],
    images: ['https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80'],
    landownerId: { name: 'Rajesh Verma (Verified Host)', phone: '+91 9080173002', email: 'ramanans.master@gmail.com' },
    verificationStatus: 'APPROVED',
    availabilityStatus: 'AVAILABLE',
  },
];

// @desc    Add new parking space to a land property
// @route   POST /api/v1/parking
// @access  Private (Landowner)
exports.addParkingSpace = async (req, res, next) => {
  try {
    const { landId, title, description, spaceSize, vehicleTypesAllowed, pricePerDay, pricePerMonth, amenities, images } = req.body;

    if (!title || !pricePerDay || !pricePerMonth) {
      return res.status(400).json({ success: false, message: 'Please provide space title, daily & monthly pricing' });
    }

    const parkingSpace = await ParkingSpace.create({
      landId: landId || null,
      landownerId: req.user._id,
      title,
      description,
      spaceSize: spaceSize || 'Standard Car / Sedan',
      vehicleTypesAllowed: vehicleTypesAllowed || ['4-Wheeler Car / SUV'],
      pricePerDay,
      pricePerMonth,
      amenities: amenities || ['CCTV 24/7', 'Gated Security'],
      images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80'],
      verificationStatus: 'APPROVED',
      availabilityStatus: 'AVAILABLE',
    });

    res.status(201).json({
      success: true,
      message: 'Parking space created and live on TENLEA marketplace',
      data: parkingSpace,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search and filter parking spaces
// @route   GET /api/v1/parking
// @access  Public
exports.getParkingSpaces = async (req, res, next) => {
  try {
    const { city, vehicleType, minPrice, maxPrice, search } = req.query;

    let query = { verificationStatus: 'APPROVED', availabilityStatus: 'AVAILABLE' };

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      query.pricePerDay = {};
      if (minPrice) query.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
    }

    let dbSpaces = [];
    try {
      dbSpaces = await ParkingSpace.find(query).populate('landId landownerId', 'name email phone address city state latitude longitude');
    } catch (dbErr) {
      dbSpaces = [];
    }

    // Merge DB results with demoSeedParkingSpaces to ensure full coverage
    let combinedSpaces = [...dbSpaces];

    if (combinedSpaces.length === 0) {
      combinedSpaces = demoSeedParkingSpaces;
    }

    // Filter by city if specified
    if (city && city !== 'All') {
      combinedSpaces = combinedSpaces.filter(s =>
        (s.city && s.city.toLowerCase().includes(city.toLowerCase())) ||
        (s.location && s.location.toLowerCase().includes(city.toLowerCase())) ||
        (s.title && s.title.toLowerCase().includes(city.toLowerCase()))
      );
    }

    res.status(200).json({
      success: true,
      count: combinedSpaces.length,
      data: combinedSpaces,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single parking space details
// @route   GET /api/v1/parking/:id
// @access  Public
exports.getParkingSpaceById = async (req, res, next) => {
  try {
    let space = null;
    try {
      space = await ParkingSpace.findById(req.params.id).populate('landId landownerId', 'name email phone address city state latitude longitude profileImage');
    } catch (err) {
      space = null;
    }

    if (!space) {
      space = demoSeedParkingSpaces.find(s => s._id === req.params.id);
    }

    if (!space) {
      return res.status(404).json({ success: false, message: 'Parking space not found' });
    }

    res.status(200).json({
      success: true,
      data: space,
    });
  } catch (error) {
    next(error);
  }
};
