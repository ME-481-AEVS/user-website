const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
  status: {
    type: Number, // 1 = scheduled, 2 = in-progress, 3 = completed, 0 = cancelled, -1 = error (can modify later)
    required: true,
  },
  startLocation: {
    type: String,
    required: true,
  },
  endLocation: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  robot_id: {
    type: Number,
    required: true,
  },
  pickup_code: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Order', OrderSchema);
