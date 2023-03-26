let mongoose = require('mongoose');

let robotSchema = mongoose.Schema({
  status: {
    /* -1: error
        0: off
        1: idle
        2: moving to pickup
        3: waiting for customer at pickup location
        4: moving to drop-off
        5: waiting for customer at drop-off location
     */
    type: Number,
    required: true
  }
});