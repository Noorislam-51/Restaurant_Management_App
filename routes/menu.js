const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem'); // Optional: if using MongoDB
const upload = require('../routes/multer')

// POST route to handle menu upload
router.post('/upload', upload.single('image'), async (req, res) => {
   try {
    const { name, category, description, price } = req.body;

    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const newItem = new MenuItem({
      menuname: name,
      menucategory: category,
      menudescription: description,
      menuprice: price,
      menuimage: req.file.filename // or `uploads/${req.file.filename}`
    });

    await newItem.save();
    res.redirect('/dashboard'); // Or respond with JSON if you're using AJAX
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// upload------------


module.exports = router;
