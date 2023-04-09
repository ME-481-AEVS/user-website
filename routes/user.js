const express = require('express');
const passport = require('passport');
const Delivery = require('../models/delivery');

const router = express.Router();

// access control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/');
}

router.get('/login', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/login/callback',
  passport.authenticate('google', { failureRedirect: '/user/auth_failed' }),
  (req, res) => {
    res.redirect('/user/home');
  },
);

router.get('/auth_failed', (req, res) => {
  req.flash('danger', 'UH account required to log in');
  res.render('index', { title: null });
});

// user homepage
router.get('/home', ensureAuthenticated, (req, res) => {
  Delivery.find({ user_id: req.user.id })
    .then((deliveries) => {
      let delivery = null;
      if (deliveries.length > 1) {
        delivery = deliveries.reduce((prev, curr) => prev.startTime < curr.startTime ? prev : curr);
      }
      res.render('home', {
        title: ' | Home',
        profileImgUrl: req.user.displayPhoto,
        delivery,
      });
    });
});

// logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
    } else {
      req.flash('success', 'Successfully logged out');
      res.redirect('/');
    }
  });
});

module.exports = router;
