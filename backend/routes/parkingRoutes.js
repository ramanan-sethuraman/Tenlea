const express = require('express');
const router = express.Router();
const { addParkingSpace, getParkingSpaces, getParkingSpaceById } = require('../controllers/parkingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('LANDOWNER', 'ADMIN'), addParkingSpace);
router.get('/', getParkingSpaces);
router.get('/:id', getParkingSpaceById);

module.exports = router;
