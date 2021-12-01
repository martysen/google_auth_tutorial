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
const GoogleStrategy = require("passport-google-oauth2").Strategy;
passport.use(
  new GoogleStrategy(
    {
      // Connection Confguration to Google authentication
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://yourdomain:3000/auth/google/callback",
      passReqToCallback: true,
    },
    // What to do once the user is successfully authenticated
    function (request, accessToken, refreshToken, profile, done) {
      //The function below is useful when connected to a DB such that
      //you can create a new user or find existing users
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return done(err, user);
      });
    }
  )
);
```

3. We now have to replace all the generic parameter values in the above preamble with values specific to our web application

### Step 3: Include the passport module in the _auth.js_ file

1. Use the following code to import passport into _auth.js_

```javascript
const passport = require("passport");
```

2. What is Passport?

   - Passport is authentication middleware for Node.js. It is extremely flexible and modular and can be unobtrusively dropped in to any Express-based web application. It supports set of strategies for authentication (a.k.a. user identity verification or user login) using a username and password (a.k.a local strategy), Facebook, Twitter, Google, and many more. Currently Passport supports 500+ strategies. All of which can be found on their website.

3. A quick note on Middleware Functions

   - Middleware functions are functionalities that lie between the front-end and back-end and is responsible for carrying out various server pre-processing (informally speaking) tasks before getting to the actual processing that will take place on the back-end (or server-side). In this particular case, user authentication being a pre-processing step i.e. unless a user's identity is not verified, they will not be able to access any of the resources (or the resources you want to protect as a developer) hosted by the server.

4. In this tutorial, we will use Google as our identity provider that will be invoked through Passport.
