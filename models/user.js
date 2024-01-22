const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  displayPhoto: {
    type: String,
  },
  orders: {
    type: String,
    // todo delete?
  },
  dateCreated: {
    type: Date,
    required: true,
  },
  deliveryHistory: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model('User', UserSchema);
