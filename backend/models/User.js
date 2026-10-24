const bcrypt = require('bcryptjs');
const { createModel } = require('../config/store');

const User = createModel(
  'User',
  {
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'VEHICLE_OWNER',
    profileImage: '',
    kycStatus: 'PENDING',
    accountStatus: 'ACTIVE',
  },
  {
    async matchPassword(enteredPassword) {
      if (!this.password) return false;
      if (this.password === enteredPassword) return true;
      try {
        return await bcrypt.compare(enteredPassword, this.password);
      } catch (e) {
        return false;
      }
    },
  }
);

module.exports = User;
