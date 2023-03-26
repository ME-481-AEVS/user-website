let GoogleStrategy = require('passport-google-oauth20').Strategy;
const user = require('../models/user');
const clientID = require('../config/googleData').clientId;
const clientSecret = require('../config/googleData').clientSecret;

module.exports = (passport) => {
  passport.use(new GoogleStrategy({
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: 'http://localhost:3000/login/callback'
  }, (accessToken, refreshToken, profile, done) => {
    console.log(profile);

    // find if user exists exists
    user.findOne({ email: profile.emails[0].value })
        .then((data) => {
          if (data){
            // user exists
            return done(null, data);
          } else {
            user({
              email: profile.emails[0].value,
              googleId: profile.id
            }).save((err, data) => {
              return done(null, data);
            });
          }
        });
  }

  ));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    user.findById(id, (err, user) => {
      done(err, user);
    });
  });
}