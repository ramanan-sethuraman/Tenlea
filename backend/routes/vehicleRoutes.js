const express = require('express');
const router = express.Router();
const { addVehicle, getMyVehicles, deleteVehicle } = require('../controllers/vehicleController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addVehicle);
router.get('/', protect, getMyVehicles);
router.delete('/:id', protect, deleteVehicle);

module.exports = router;
