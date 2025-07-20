var express = require('express');
var router = express.Router();
const passport = require("passport"); // ✅ ADD THIS: For user authentication
const userModel = require('../models/User'); // User model
const MenuItem = require('../models/MenuItem'); // Optional: if using MongoDB for menu items
const isLoggedIn = require('../middleware/isLoggedIn') // Middleware to check if user is logged in
const upload = require('../routes/multer'); // Multer setup for handling file uploads


// Configure passport-local to use userModel for authentication
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    // Fetch all menu items from the database and sort by newest first
    const menuItems = await MenuItem.find({ user: req.user._id }).sort({ createdAt: -1 });


    res.render('menu', {
      page: 'menu', // For page identification in templates
      menuItems: menuItems || [] // Pass menu items to the template; fallback to empty array
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.render('menu', {
      page: 'menu', // Still render the page in case of error
      menuItems: [] // Pass empty array if error occurs
    });
  }
});

// GET admin dashboard page ------------------
router.get('/dashboard', function (req, res, next) {
  res.render('admin-dashboard', {
    error: req.flash("error"), // Flash message for errors
    user: req.user, // Logged-in user details, undefined if not logged in
    isAuthenticated: req.isAuthenticated(), // Boolean to check login status
    page: 'dashboard' // For template highlighting or logic
  });
});


module.exports = router; // Export this router to be used in the main app
