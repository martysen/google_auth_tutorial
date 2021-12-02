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

### Step 6: What to do when the client successfulyy logs in.

1. The following piece of code from the preamble is reponsible for deciding that logic:

```javascript
function (request, accessToken, refreshToken, profile, done) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return done(null, user); // since we are not creating new user in the db we are passing null
      });
```

2. In a more roubust setup, the **findOrCreate()** will allow to connect to a database and insert the user name if it is a new user or find the user from the database if it is a returning user.

3. However, in this tutorial, to stay on point, we will simply take the user name and prompt a hello message to the user using the user name. i.e. we will use the following functionality:

```javascript
function (request, accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
```

4. Note: _accessToken_ and _refreshToken_ allows you to use other google services if present in your app for verified user.

### Step 7: Define serialization and deserialization of users.

1. Using the following code (function bodies are simplied for tutorial purposes)

```javascript
// Define serializer
passport.serializeUser((user, done) => {
  done(null, user);
});

// Define deserializer
passport.deserializeUser((user, done) => {
  done(null, user);
});
```

2. What does serializer do?

   - Sets user attributes (id or email) as cookie in the user's browser for session management purposes.

3. What does deserializer do?

   - Retrives the user id from the cookie and then used in a callback function to get access to other relevant user info from the stored cookie.
   - See a helpful flowchart on this [link's](https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize) top answer to understand the process better.

4. This completes all the operations within the auth.js file and now we need to utilize this in the app.js file.

### Step 8: Utilizing _auth.js_ in _app.js_

1. Import the auth.js file inside of app.js. Note here, we just need the file to be loaded into app.js and as such we are not storing it within an object.

```javascript
require("./auth");
```

2. Our home route is defined as follows:

```javascript
app.get("/", (req, res) => {
  // respond with a link that will take users to authenticate with Google
  // You can replace it with a View which will have the href in a html file
  // Or a View with a proper login page.
  res.send('<a href="/auth/google">Login with Google </a>');
});
```

3. So now we need to define a route for the href specified above. And through this route we will call make call to Google sign-in via Passport.

```javascript
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
```

4. Therefore, the overall workflow of is: when user clicks the link, take them to Google Authentication that is defined by the Passport Middleware function which we have included inside the auth.js file and imported this file within app.js.

5. The _scope_ parameter states what information we want to retreive after a successful authentication. In this example, we are only retreiving the user email and profile information. You can do more like openID etc.

6. Also note, if you have used other authentication strategies like FB or Twitter, you will specify them one by one as Routes like we have done for Google.

7. Now if you load your localhost:3000 page and click the hyperlink on the page it will redirect you to google sign-in page with the name of your web-application.

8. Now if you sign-in it will give a _CANNOT GET_ error. The reason is remember that we had specified a callbackURL to Google, which we are yet to define as a route in our server. So, now we have define the route we specified for Google's Callback URI i.e. '/google/callback' using code below:

```javascript
app.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/protected", // what to do when successful login
    failureRedirect: "auth/failure", // what to do when unsuccesful login
  })
);
```

9. We check that users have been authenticated using the google strategy that can have two outcomes: success or failure. If success, we re-direct them to our protected resource. Else if failure we will will create a new route and re-direct the users to the failure page. Note that for failure, instead of just a failure redirect you can also flash a message to the user using _failureFlash_ or _failureMessage_.

10. Recall, we had initially created a _protected_ route. Now will will tie it up with authentication.

```javascript
app.get("/protected", (req, res) => {
  res.send(`Hello....${req.user.displayName} `);
});
```

11. Since the user is logged in, the req object contains a user object which contains the user credentials (id, name, email etc.). Within this there is a property called _displayName_ that we are using here. You can explore this user object and its properties further using console.log().

12. Let us also define our failure route:

```javascript
app.get("/auth/failure", (req, res) => {
  res.send("You were not authenticated.. Try again next time");
});
```

### Step 9: Check if the user is already logged in

1. The previos steps do re-direct the user to our web-app's protected resources after a successful log-in through Google. However, our resources are not truly protected. This is because, if a user knows the url of the protected pages, they can effectively bypass the authentication by typing the the complete url in the browser address bar.

2. As such we need a mechanism in place to verify whether a user trying to access a protected resource has actually been authenticated or not. We will do so by defining another Middleware function as shown below:

```javascript
function isLoggedIn(req, res, next) {
  // Logic: If the req object already has user credential, then pass it onto the next point, else return a 401 status (unauthorized acccess)
  req.user ? next() : res.sendStatus(401);
}
```

3. Once the above middleware function is declared and defined, we will use it as callback parameter to every protected route as shown below:

```javascript
app.get("/protected", isLoggedIn, (req, res) => {
  res.send(`Hello....${req.user.displayName} `);
});
```

4. Now, with this mechanism in place, a user will never be able to access the http response unless the callback to _isLoogedIn()_ is successful. This callback to _isLoggedIn()_ what makes our protected route truly protected. You can check by typing in your browser: localhost:3000/protected. You will get 401 stating unauthorized access. Also note that, the call to the _next()_ in the body of _isLoggedIn()_ brings the workflow back to the response body of the route that did the callback.

### Step 10: Session Management: make the user object a part of http req object to access protected resources

1. For this we will use the final module that we had installed: _express-session_. Additional info is also present in the Passport documentation page under the middleware sub-section

2. In _app.js_ import express-session:

```javascript
const session = require("express-session");
```

3. We will copy the preamble from the documentation to use session as a middleware.

```javascript
app.use(session({ secret: "cats" }));
```

4. Note: order of declaration is important. The code above MUST be written before following code:

```javascript
app.use(passport.initialize());
app.use(passport.session());
```

5. Note that there are some deprications unrelated to this tutorial which can be resolved by checking out express-session documentations. Also use a stronger secret and preferably store the secret in the _.env_ file. That is use a code like shown below:

```javascript
app.use(
  session({
    secret: "r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#",
    resave: false, // Deprecation flag shown for this parameter
    saveUninitialized: true, // Deprecation flag shown for this parameter
    cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour
  })
);
```

### Step 11: Allow users to be able to logout

1. Create a Logout route as shown below:

```javascript
app.get("/logout", (req, res) => {
  req.logout(); // logs the user out
  req.session.destroy(); // destroy the session created
  res.send("You have been successfully logged out... Goodbye!");
});
```

### Step 12: Check everything works as intended

Try out the following:

1. goto home page: localhost:3000
2. click login
3. login with google
4. see custom msg with your name
5. go to address bar in your browser type /logout
6. Try accessing /protected to get 401 msg.

### Step 13: Looking Ahead

1. Create layouts and views that has proper HTML pages with login forms etc.
2. Try a self-exercise that uses a DB connection within authentication similar to what is shown on this [link](https://heynode.com/tutorial/authenticate-users-node-expressjs-and-passportjs/)
