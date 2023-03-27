const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');

router.get('/login', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
    '/login/callback',
    passport.authenticate('google', { failureRedirect: '/user/login_failed' }),
    (req, res) => {
  res.redirect('/user/home');
});

router.get('/login_failed', (req, res) => {
  res.render('login_failed', { title: ' | Login Failure' });
});

// user homepage
router.get('/home', ensureAuthenticated, (req, res) => {
  res.render('home', { title: ' | Home', profileImgUrl: req.user.displayPhoto });
});

// logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
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
