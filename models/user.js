let mongoose = require('mongoose');

let UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  displayName: {
    type: String,
    required: true
  },
  displayPhoto: {
    type: String
  },
  orders: {
    type: String
  }
});

module.exports = mongoose.model('User', UserSchema);
