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

### Step 4: Setup Google OAuth2

1. Login to Google using your desired gmail account. It is suggested you use your personal gmail.
2. Browse to the [Google cloud console link](https://console.cloud.google.com/getting-started)
   - First time users, accept the terms and conditions
3. On the menu of the left of the page, select **APIs and Services**
4. On the dashboard, click on **create project**
   - Give your project a name
   - If you are using an organizational gmail account it will default select your organization and location fields. If using personal gmail, it will show location as _No organization_. Either is fine. Once done, click **Create**.
5. Then from the menu on the left, select **OAuth consent screen**.
   - Choose your _User Type_:
     - _Internal_: Only users within your organization can use this authentication.
     - _External_: Anyone with a gmail can use your authentication for your webapp.
   - Click on create after making your selection.
6. Go through the prompts and fill in the information that you want to show to your users when they get to the google authentication page. If you don't want to fill this now, simply skip all the optional info. Just fill in the name and contact email of your web-app and web-app admin. You can always come back and edit all of this information. Once you are done, it will take you back to the dashboard.
7. Next, from the menu on the left, click on **credentials**.
8. In this page, look at the center top. There will be an option called **CREATE CREDENTIALS**. Click that and choose **OAuth client ID** from the dropdown menu.
9. The new page that will open will ask you to select an application type. Here we will select _Web Application_.
   - Make a note of this action. You have the option to choose Andriod, iOS and others.
10. Give a name for your OAuth 2.0 client. This will not be shown to end users. The tutorial stuck to the default name, but you can give any name.
11. The next important field to fill out in this page is **Authorized redirect URIs**
    - This field essentially means, 'What should Google do once the user is successfully authenticated?'. We want Google to send the user back to our web application page or whatever resource you decide the user should be re-directed to.
12. For the tutorial we will create a route for the URL specified below. Remember, you can give whatever you want, as long as it is a valid route in your server

```javascript
http://localhost:3000/google/callback
```

13. After this, click the **CREATE** button at the bottom of the page.
14. This will open a new window with your **Client ID** and **Client-Secret**. We need to use this to replace the generic parameter values in the code preamble we had imported into our auth.js file.
15. You will now see your OAuth 2.0 Client IDs on the credentials dashboard page. Click on it to revisit the details anytime you want.

### Step 5: Replace the generic stuff from the Passport's Google Strategy.

1. Go back to _auth.js_
2. Notice the parameters in the following piece of code:

```javascript
new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID, // Replace Here
      clientSecret: GOOGLE_CLIENT_SECRET, // Replace Here
      callbackURL: "http://yourdomain:3000/auth/google/callback", // Replace Here
      passReqToCallback: true,
    },
```

3. However, we do not simply want to copy and replace directly in the code
4. These values are secrets and environment/config variables. As a good practice, we want to place them in a file called _config.env_ that will be enabled in the rest of our files using the _dotenv_ module that we had installed earlier.
5. Create a file _config.env_ in the root directory, and initialize your variables (You can also put the callbackURL and PORT number etc.):

```javascript
GOOGLE_CLIENT_ID = "Your generated value";
GOOGLE_CLIENT_SECRET = "Your generated value";
```

6. Get back to the _auth.js_ file and import the following module:

```javascript
const dotenv = require('dotenv');
//load file path for config.env
dotenv.config({ path = './config.env'}); // make sure to specify the correct path
```

7. Then replace the authentication strategy codes as follows:

```javascript
clientID: process.env.GOOGLE_CLIENT_ID,
clientSecret: process.env.GOOGLE_CLIENT_SECRET,
```
