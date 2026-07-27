const express = require('express');
const router = express.Router();
const { getAgreementByBooking, acceptAgreement } = require('../controllers/agreementController');
const { protect } = require('../middleware/authMiddleware');

router.get('/booking/:bookingId', protect, getAgreementByBooking);
router.put('/:id/accept', protect, acceptAgreement);

module.exports = router;
