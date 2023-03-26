const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const AppointmentPicker = require('appointment-picker');

// request new delivery
router.get('/schedule', ensureAuthenticated, (req, res) => {

  res.render('delivery_schedule', { title: ' | Schedule New Delivery', profileImgUrl: req.user.displayPhoto });

});

// access control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/');
  }
}

module.exports = router;
