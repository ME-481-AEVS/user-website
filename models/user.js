let mongoose = require('mongoose');

let userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  googleId : {
    type: String,
    required: true
  },
  orders: {
    type: String
  }
});