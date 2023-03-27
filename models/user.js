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
  },
  dateCreated: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('User', UserSchema);
