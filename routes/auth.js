var express = require('express');
var router = express.Router();
const passport = require("passport"); 
const userModel = require('../models/User');
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));


// authentication------------------
router.post("/register", function (req, res) {
  const { username, email, restaurantname, ownername, password } = req.body;

  const newUser = new userModel({ username, email, restaurantname, ownername });

  userModel.register(newUser, password, function (err, user) {
    if (err) {
      console.log(err);
      return res.redirect("/dashboard");
    }
    passport.authenticate("local")(req, res, function () {
      res.redirect("/cart");
    });
  });
});

// login ---------------
router.post("/login", passport.authenticate("local", {
  successRedirect: "/dashboard",
  failureRedirect: "/dashboard"
}), function (req, res) { });


// logout----------
router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect("/dashboard");
  });
});

module.exports = router;