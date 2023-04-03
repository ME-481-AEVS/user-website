const mongoose = require('mongoose');

const DeliverySchema = mongoose.Schema({
  status: {
    /* 1: scheduled
       2: waiting at pickup
       3: moving to drop-off
       4: waiting at drop-off
       5: completed
       0: cancelled
       -1: error
     */
    type: Number,
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
  },
  user_id: {
    type: String,
    required: true,
  },
  robot_id: {
    type: Number,
  },
});

module.exports = mongoose.model('Delivery', DeliverySchema);
