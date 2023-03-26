let GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');
const config = require('../config/database');
const clientID = require('../config/googleData').clientId;
const clientSecret = require('../config/googleData').clientSecret;

module.exports = (passport) => {
  passport.use(new GoogleStrategy({
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: 'http://localhost:3000/user/login/callback'
  }, (accessToken, refreshToken, profile, done) => {

    // find if user exists exists
    User.findOne({ email: profile.emails[0].value })
        .then((user) => {
          if (user){
            // user exists
            return done(null, user);
          } else {
            User({
              email: profile.emails[0].value,
              displayName: profile.displayName,
              displayPhoto: profile.photos[0].value
            }).save()
                .then((err, data) => {
                  return done(null, data);
                });
          }
        });
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id)
        .then((err, user) => {
          done(err, user);
        })
        .catch(err => {
          console.log(err);
        });
  });
}