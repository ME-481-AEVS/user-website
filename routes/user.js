const express = require('express');
const passport = require('passport');

const router = express.Router();

const User = require('../models/user');

// home route
router.get('/', (req, res) => {
  res.send('ayooo');
});

// login route
router.get('/login', passport.authenticate('google', { scope: ['profile', 'email'] }));

// login callback
router.get('/login/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/');
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
