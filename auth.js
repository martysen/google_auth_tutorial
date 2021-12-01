const passport = require("passport");
const dotenv = require("dotenv");

// Load config.env
dotenv.config({ path: "./config.env" });

const GoogleStrategy = require("passport-google-oauth2").Strategy;

passport.use(
  new GoogleStrategy(
    {
      // Coneecting to Google
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/google/callback",
      passReqToCallback: true,
    },
    // function (request, accessToken, refreshToken, profile, done) {
    //   User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //     return done(err, user);
    //   });
    // What to do when user is verified?
    function (request, accessToken, refreshToken, profile, done) {
      return done(null, profile); // if you have a db the null will be an err
    }
  )
);

// Serialize and Deserialize Users -- Setting up for user sessions/cookies
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
