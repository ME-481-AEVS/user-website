const express = require('express');
const Robot = require('../models/robot');

const router = express.Router();

// access control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/');
}

router.get('/controls', ensureAuthenticated, (req, res) => {
  res.render('controls',{
    title: ' | User Controls',
    profileImgUrl: req.user.displayPhoto,
    name: req.user.displayName,
  });
});

// request new delivery
router.get('/aev1', (req, res) => {
  Robot.findOne({ name: 'aev1' })
    .then((robot) => {
      const json = {
        name: robot.name,
        status: robot.status,
        currentOrderId: robot.currentOrderId,
        ipAddress: robot.ipAddress,
        batteryLevel: robot.batteryLevel,
        state: robot.state,
        speed: robot.speed,
        accelerometer: robot.accelerometer,
        boltLock: robot.boltLock,
        brakes: robot.brakes,
        cpuTemp: robot.cpuTemp,
        elecBayTemp: robot.elecBayTemp,
        wifi: robot.wifi,
        gps: robot.gps,
      };
      res.send(json);
    })
    .catch(err => {
      res.send({ 500: 'internal server error' });
      console.log(err);
    });
});

router.post('/aev1', (req, res) => {
  // todo source checking
  Robot.updateOne(
    { name: req.body.name },
    {
      $set: {
        status: req.body.status,
        currentOrderId: req.body.currentOrderId,
        ipAddress: req.body.ipAddress,
        batteryLevel: req.body.batteryLevel,
        state: req.body.state,
        speed: req.body.speed,
        accelerometer: req.body.accelerometer,
        boltLock: req.body.boltLock,
        brakes: req.body.brakes,
        cpuTemp: req.body.cpuTemp,
        elecBayTemp: req.body.elecBayTemp,
        wifi: req.body.wifi,
        gps: req.body.gps,
      },
    },
  ).then(res.send(req.body))
    .catch(err => {
      console.log(err);
      res.send({ 500: 'internal server error' });
    });
});

module.exports = router;
