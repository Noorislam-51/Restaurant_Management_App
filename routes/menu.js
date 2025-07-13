const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem'); // Model for menu items
const upload = require('../routes/multer'); // Multer setup for handling file uploads
const userModel = require('../models/User'); // User model
const isLoggedIn= require('../middleware/isLoggedIn') // Middleware to restrict access to logged-in users

// POST route to handle menu upload
router.post('/upload', isLoggedIn, upload.single('image'), async (req, res) => {
  try {
    const { name, category, description, price } = req.body; // Destructure form data from request body

    if (!req.file) {
      return res.status(400).send('No file uploaded.'); // Validate that an image file was uploaded
    }

    // Find the user from the session using passport
    const user = await userModel.findOne({ username: req.session.passport.user });

    // Create new menu item instance with form data and uploaded image
    const newItem = new MenuItem({
      menuname: name,
      menucategory: category,
      menudescription: description,
      menuprice: price,
      menuimage: req.file.filename, // Image filename from multer
      user: user._id // Associate menu item with the user
    });

    const savedItem = await newItem.save(); // Save menu item to the database

    // Add the saved menu item's ID to the user's `menus` array
    user.menus.push(newItem._id);
    await user.save(); // Save updated user document

    await newItem.save(); // (Optional double-save; could be removed)

    res.redirect('/'); // Redirect to home after successful upload
  } catch (err) {
    console.error(err); // Log any server errors
    res.status(500).send('Server error'); // Send error response to client
  }
});

// upload------------

module.exports = router; // Export router to be used in main app
