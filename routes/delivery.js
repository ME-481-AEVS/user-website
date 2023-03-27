const express = require('express');

const router = express.Router();

// access control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/');
}

// request new delivery
router.get('/schedule', ensureAuthenticated, (req, res) => {
  res.render('delivery_schedule', { title: ' | Schedule New Delivery', profileImgUrl: req.user.displayPhoto });
});

module.exports = router;
