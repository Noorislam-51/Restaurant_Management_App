var express = require('express');
var router = express.Router();
const passport = require("passport"); // ✅ ADD THIS
const userModel = require('../models/User');
const MenuItem = require('../models/MenuItem'); // Optional: if using MongoDB


const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));




/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    // Fetch all menu items from the database
    const menuItems = await MenuItem.find({}).sort({ createdAt: -1 });

    res.render('menu', {
      page: 'menu',
      menuItems: menuItems || [] // Pass menu items to the template
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.render('menu', {
      page: 'menu',
      menuItems: [] // Pass empty array if error occurs
    });
  }
});

// dashboard ------------------
router.get('/dashboard', function (req, res, next) {
  res.render('admin-dashboard', {
    error: req.flash("error"),
    user: req.user, // Will be undefined if not logged in
    isAuthenticated: req.isAuthenticated(),
    page: 'dashboard'
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