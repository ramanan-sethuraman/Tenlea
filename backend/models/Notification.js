const { createModel } = require('../config/store');

const Notification = createModel('Notification', {
  userId: null,
  title: '',
  message: '',
  type: 'SYSTEM',
  read: false,
});

module.exports = Notification;
