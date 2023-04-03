const express = require('express');
const Delivery = require('../models/delivery');
const User = require('../models/user');

const router = express.Router();

// access control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/');
}

// request new delivery
router.get('/new', ensureAuthenticated, (req, res) => {
  res.render('delivery_new', {
    title: ' | Schedule New Delivery',
    profileImgUrl: req.user.displayPhoto,
  });
});

router.post('/new', ensureAuthenticated, (req, res) => {
  const delivery = new Delivery();
  const date = `${req.body.dateTimePicker_value}000`;
  delivery.status = 1;
  delivery.startLocation = req.body.deliveryPickup;
  delivery.endLocation = req.body.deliveryDestination;
  delivery.startTime = new Date(parseInt(date, 10) + 36000000);
  delivery.endTime = new Date(parseInt(date, 10) + 36000000);
  delivery.endTime.setHours(delivery.endTime.getHours() + 1);
  delivery.user_id = req.user.id;

  try {
    delivery.save();
    console.log('Delivery scheduled.');
    req.flash('success', 'Delivery scheduled!');
    res.redirect('/user/home');
  } catch (err) {
    req.flash('error', 'Internal server error - please try again in a few moments.');
    res.redirect('/delivery/new');
    console.log(err);
  }
});

// view scheduled deliveries
router.get('/scheduled', ensureAuthenticated, (req, res) => {
  Delivery.find({ user_id: req.user.id })
    .then((deliveries) => {
      if (deliveries.length < 1) {
        req.flash('info', 'No upcoming deliveries');
      }
      res.render('delivery_scheduled', {
        title: ' | View Scheduled Deliveries',
        profileImgUrl: req.user.displayPhoto,
        deliveries: deliveries.sort((a,b) => a.startTime - b.startTime),
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
  User.find({ _id: req.user.id })
    .then((user) => {
      if (user[0].deliveryHistory.length < 1) {
        req.flash('info', 'No delivery history found');
      }
      res.render('delivery_history', {
        title: ' | View Delivery History',
        profileImgUrl: req.user.displayPhoto,
        deliveries: user[0].deliveryHistory,
      });
    })
    .catch(err => {
      req.flash('error', 'Internal Error - Please Try Again');
      res.redirect('/user/home');
      console.log(err);
    });
});

module.exports = router;
