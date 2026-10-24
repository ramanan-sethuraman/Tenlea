const { createModel } = require('../config/store');

const Review = createModel('Review', {
  bookingId: null,
  reviewerId: null,
  targetUserId: null,
  rating: 5,
  comment: '',
});

module.exports = Review;
