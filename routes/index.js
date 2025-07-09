var express = require('express');
var router = express.Router();
const passport = require("passport"); // ✅ ADD THIS
const userModel = require('../models/User');
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));




/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('menu',{page:'menu'});
});

// dashboar------------------
router.get('/dashboard', function (req, res, next) {
  res.render('admin-dashboard', {
    user: req.user, // Will be undefined if not logged in
    isAuthenticated: req.isAuthenticated(),
    page:'dashboard'
  });
});

// cart------------------
router.get('/cart', isLoggedIn, function (req, res, next) {
  res.render('cart', { page: 'cart' });
});


// checking login --------
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}


module.exports = router;