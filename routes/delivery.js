const express = require('express');
const { check, validationResult } = require('express-validator');
const Delivery = require('../models/delivery');

const router = express.Router();

// access control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/');
}

// filter only future deliveries
function getFutureDeliveries(deliveries) {
  const currentTime = new Date();
  const futureDeliveries = [];
  for (const delivery of deliveries) {
    if (delivery.startTime > currentTime) {
      futureDeliveries.push(delivery);
    }
  }
  return futureDeliveries;
}

// filter only past deliveries
function getPastDeliveries(deliveries) {
  const currentTime = new Date();
  const pastDeliveries = [];
  for (const delivery of deliveries) {
    if (delivery.startTime < currentTime) {
      pastDeliveries.push(delivery);
    }
  }
  return pastDeliveries;
}

// request new delivery
router.get('/new', ensureAuthenticated, (req, res) => {
  res.render('delivery_new', {
    title: ' | Schedule New Delivery',
    profileImgUrl: req.user.displayPhoto,
  });
});

router.post('/new', ensureAuthenticated, [
  check('deliveryDate', 'Date is required').notEmpty(),
  check('deliveryTime', 'Time is required').notEmpty(),
], (req, res) => {
  // get errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('error');
    res.render('delivery_new', {
      title: ' | Schedule New Delivery',
      profileImgUrl: req.user.displayPhoto,
      errors,
    });
  } else {
    const delivery = new Delivery();
    delivery.status = 1;
    delivery.startLocation = req.body.deliveryPickup;
    delivery.endLocation = req.body.deliveryDestination;
    delivery.startTime = new Date(); // TODO parse from cal string
    delivery.endTime = delivery.startTime;
    delivery.endTime.setHours(delivery.endTime.getHours() + 1);
    delivery.user_id = req.user.id;

    try {
      delivery.save();
      console.log('Delivery scheduled.');
      req.flash('success', 'Delivery scheduled!');
      res.redirect('/user/home');
    } catch (err) {
      console.log(err);
    }
  }
});

// view scheduled deliveries
router.get('/scheduled', ensureAuthenticated, (req, res) => {
  Delivery.find({ user_id: req.user.id })
    .then((deliveries) => {
      const futureDeliveries = getFutureDeliveries(deliveries);
      if (futureDeliveries.length < 1) {
        req.flash('info', 'No upcoming deliveries');
      }
      res.render('delivery_scheduled', {
        title: ' | View Scheduled Deliveries',
        profileImgUrl: req.user.displayPhoto,
        deliveries: futureDeliveries,
      });
    })
    .catch(err => {
      req.flash('error', 'Internal Error - Please Try Again');
      res.redirect('/user/home');
      console.log(err);
    });
});

// view delivery history
router.get('/history', ensureAuthenticated, (req, res) => {
  Delivery.find({ user_id: req.user.id })
    .then((deliveries) => {
      const pastDeliveries = getPastDeliveries(deliveries);
      if (pastDeliveries.length < 1) {
        req.flash('info', 'No delivery history found');
      }
      res.render('delivery_history', {
        title: ' | View Delivery History',
        profileImgUrl: req.user.displayPhoto,
        deliveries: pastDeliveries,
      });
    })
    .catch(err => {
      req.flash('error', 'Internal Error - Please Try Again');
      res.redirect('/user/home');
      console.log(err);
    });
});

module.exports = router;
