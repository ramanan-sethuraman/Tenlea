const Vehicle = require('../models/Vehicle');

// @desc    Add new vehicle
// @route   POST /api/v1/vehicles
// @access  Private (Vehicle Owner)
exports.addVehicle = async (req, res, next) => {
  try {
    const { vehicleType, brand, model, vehicleNumber, registrationDocument, images } = req.body;

    if (!vehicleType || !brand || !model || !vehicleNumber) {
      return res.status(400).json({ success: false, message: 'Please provide vehicle type, brand, model, and registration number' });
    }

    const vehicle = await Vehicle.create({
      ownerId: req.user._id,
      vehicleType,
      brand,
      model,
      vehicleNumber: vehicleNumber.toUpperCase(),
      registrationDocument: registrationDocument || '/uploads/demo-rc.pdf',
      images: images || ['/uploads/demo-car.jpg'],
    });

    res.status(201).json({
      success: true,
      message: 'Vehicle added successfully',
      data: vehicle,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get vehicle owner's vehicles
// @route   GET /api/v1/vehicles
// @access  Private (Vehicle Owner)
exports.getMyVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({ ownerId: req.user._id });
    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete vehicle
// @route   DELETE /api/v1/vehicles/:id
// @access  Private (Vehicle Owner)
exports.deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({ _id: req.params.id, ownerId: req.user._id });
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found or unauthorized' });
    }

    res.status(200).json({
      success: true,
      message: 'Vehicle removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
