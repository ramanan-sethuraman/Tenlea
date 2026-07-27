const express = require('express');
const router = express.Router();
const { addLand, getMyLands, getLands } = require('../controllers/landController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('LANDOWNER', 'ADMIN'), addLand);
router.get('/my-lands', protect, authorize('LANDOWNER', 'ADMIN'), getMyLands);
router.get('/', getLands);

module.exports = router;
