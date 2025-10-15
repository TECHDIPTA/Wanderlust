const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middileware.js");
const userController=require("../controllers/users.js");
// Signup routes
router.route("/signup")
    .get(userController.renderSignupForm)
    .post(userController.signup);

// Login routes
router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl, 
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true,
        }),
        userController.login
    );

// Logout route
router.get("/logout", logout);



module.exports = router;













// new User({ email, username }) creates a Mongoose document instance (not saved yet).
// User.register(newUser, password) is a passport-local-mongoose helper that: generates a salt, hashes the password, stores hash + salt on the document, saves it to MongoDB and returns the saved user object (or throws on error)

