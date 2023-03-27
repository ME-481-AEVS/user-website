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
        .then ((user) => {
          if (user) {
            // user exists
            return done(null, user);
          } else {
            const googleEmail = profile.emails[0].value;
            if (googleEmail.substring(googleEmail.length - 11) == '@hawaii.edu') {
              User({
                email: googleEmail,
                displayName: profile.displayName,
                displayPhoto: profile.photos[0].value,
                dateCreated: new Date()
              }).save()
                  .then((err, user) => {
                    return done(null, user);
                  });
            } else {
              return done(null);
            }
          }
        })
        .catch (err => console.log(err));
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id)
        .then((user, err) => {
          done(err, user);
        })
        .catch(err => {
          console.log(err);
        });
  });
}