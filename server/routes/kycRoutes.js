const express = require('express');
const router = express.Router();
const { submitKYC, getKYCStatus } = require('../controllers/kycController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, submitKYC);
router.get('/status', protect, getKYCStatus);

module.exports = router;
