const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');

router.get('/login', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/login/callback', passport.authenticate('google', { failureRedirect: '/user/login_failed' }), (req, res) => {
  res.redirect('/');
});
router.get('/login_failed', (req, res) => {
  res.render('login_failed');
});

// user homepage
router.get('/home', (req, res) => {
  res.render('home');
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
