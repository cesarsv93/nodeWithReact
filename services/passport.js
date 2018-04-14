const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys') // don't need the .js for files

const User = mongoose.model('users');

passport.serializeUser((user,done) => {
  done(null, user.id); //place user id in the cookie
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user);
    });
}); //Pulls is and turns it into a user

passport.use(new GoogleStrategy({
  clientID: keys.googleClientID,
  clientSecret: keys.googleClientSecret,
  callbackURL: '/auth/google/callback',//Where will the user be redirected after grating permission to our app
  proxy: true //Tells google strategy to truste the proxy (In our case heroku)
}, (accessToken, refreshToken, profile, done) => {
  User.findOne({ googleId: profile.id })
    .then((existingUser) => {
      if (existingUser) {
        //We alreay have a record witht the given profile ID
        done(null, existingUser); //done(error, userFound/userCreated)
      } else {
        //Make new record since we dont have a user with this id
        new User({ googleId: profile.id })
          .save()
          .then(user => done(null, user));
      }
    });
}));
