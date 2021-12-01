# User Authentication Using NodeJS/Express, Passport, and Google Sign-in

## Required external modules

1. express
2. express-session
3. [passport.js](http://www.passportjs.org/)
4. [passport-google-oauth2](http://www.passportjs.org/packages/passport-google-oauth2/)
5. nodemon
6. dotenv - to store environment variables or configuration parameters

### Step 1: Setup Basic Web-application Framework in Exprss

1. Create package.json with npm init
2. Create a landing file: index.js or app.js or server.js
3. Create basic express app server inside of your landing file
4. Create two routes
   - one for home page
   - another route, call it a protected route that will eventually be made into a resource that users can only access if they are logged in

### Step 2: Setup file to carry out authentication

1. In the root directory, create another file, say _auth.js_
   - This file will contain all the authentication stuff which we will later export into our landing page.
   - The code preamble used in this tutorial can be found on the [passport-google-oauth2](http://www.passportjs.org/packages/passport-google-oauth2/) documentation page.
2. Copy paste the preamble code shown below into _auth.js_

```javascript
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://yourdomain:3000/auth/google/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return done(err, user);
      });
    }
  )
);
```
