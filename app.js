/**
 * Required external dependencies:
 * 1. express
 * 2. express-session
 * 3. passport.js (http://www.passportjs.org/)
 * 4. passport-google-oauth2 (http://www.passportjs.org/packages/passport-google-oauth2/)
 * 5. Nodemon -- developer dependencies
 * 6. dotenv -- to store secrets and process environment variables
 *
 * Note: If you check the passport.js link you will find many different authentication strategies and their documentation on how to use
 */

const express = require("express");
const session = require("express-session");
const passport = require("passport");
require("./auth");

// Define a Middleware function to check if the user is already logged in
// The next param. is pointing to the next end-point to go to, once the middleware function is done executing
function isLoggedIn(req, res, next) {
  // Logic: If the req object already has user credentaial, then pass it onto the next point, else return a 401 status (unauthorized acccess)
  req.user ? next() : res.sendStatus(401);
}

const app = express();

// Declare session usage as a middleware
app.use(session({ secret: "cats" })); // use a more complicated secret and save it in the .env file.
app.use(passport.initialize());
app.use(passport.session());

// Create a home route that will only show login link
app.get("/", (req, res) => {
  // respond with a link that will take users to authenticate with Google
  // You can replace it with a View which will have the href in a html file
  res.send('<a href="/auth/google">Login with Google </a>');
});

// Define Route: /auth/google to redirect user to goto Google Authentication Page
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

// Define Route: /google/callback to redirect users back to our webapp after successfull log in
app.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/protected",
    failureRedirect: "auth/failure",
  })
);

// Create a protected route for successful redirect -- Users won't be able to access this route unless successfully logged in.
app.get("/protected", isLoggedIn, (req, res) => {
  //   res.send("You are now logged in");
  res.send(`Hello.... ${req.user.displayName}`);
});

// Define a failure route for redirect on invalid login in
app.get("/auth/failure", (req, res) => {
  res.send("You were not authenticated.. Try again next time");
});

// Define a route for logging out
app.get("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  res.send("You have been successfully logged out... Goodbye!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
