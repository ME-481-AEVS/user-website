const mongoose = require('mongoose');

const RobotSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
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
    required: true,
  },
  currentOrderId: String,
  ipAddress: String,
  batteryLevel: Number,
  state: Number, // e.g. normal, warning...figure out specifics later
  speed: Number, // KPH
  accelerometer: String,
  boltLock: Boolean, // true = bolt lock is engaged
  brakes: Boolean, // true = brakes are powered
  cpuTemp: Number, // degrees celsius
  elecBayTemp: Number, // degrees celsius
  wiFi: Number, // 0 = off, 1 = weak, 5 = strongest
  gps: Number, // 0 = off, 1 = weak, 5 = strongest
});

module.exports = mongoose.model('Robot', RobotSchema);
