const Land = require('../models/Land');

// @desc    Add new land property listing
// @route   POST /api/v1/lands
// @access  Private (Landowner)
exports.addLand = async (req, res, next) => {
  try {
    const { title, description, address, city, state, pinCode, latitude, longitude, totalArea, availableArea, amenities, images } = req.body;

    const land = await Land.create({
      landownerId: req.user._id,
      title,
      description,
      address,
      city,
      state,
      pinCode,
      latitude: latitude || 12.9716,
      longitude: longitude || 77.5946,
      totalArea,
      availableArea,
      amenities: amenities || ['Gated', 'Lighting'],
      images: images || ['/uploads/demo-land.jpg'],
      verificationStatus: 'PENDING',
    });

    res.status(201).json({
      success: true,
      message: 'Land listing submitted for verification',
      data: land,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get landowner's own property listings
// @route   GET /api/v1/lands/my-lands
// @access  Private (Landowner)
exports.getMyLands = async (req, res, next) => {
  try {
    const lands = await Land.find({ landownerId: req.user._id });
    res.status(200).json({
      success: true,
      count: lands.length,
      data: lands,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all verified lands (Public)
// @route   GET /api/v1/lands
// @access  Public
exports.getLands = async (req, res, next) => {
  try {
    const lands = await Land.find({ verificationStatus: 'VERIFIED' });
    res.status(200).json({
      success: true,
      count: lands.length,
      data: lands,
    });
  } catch (error) {
    next(error);
  }
};
