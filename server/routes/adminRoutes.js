const express = require('express');
const router = express.Router();
const { getAdminDashboard, reviewKYC, reviewParkingListing } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('ADMIN'));

router.get('/dashboard', getAdminDashboard);
router.put('/kyc/:id', reviewKYC);
router.put('/parking/:id', reviewParkingListing);

module.exports = router;
