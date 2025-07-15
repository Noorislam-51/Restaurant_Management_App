const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const isLoggedIn = require('../middleware/isLoggedIn') // Middleware to check if user is logged in

// GET route to display the cart page
router.get('/cart', async (req, res) => {


  const cart = req.session.cart || []; // Get cart from session or initialize empty array

  try {
    const itemIds = cart.map(i => i.itemId); // Extract item IDs from the cart
    const menuItems = await MenuItem.find({ _id: { $in: itemIds } }); // Fetch menu items from DB

    // Merge item details from DB with quantity from session cart
    const cartItems = cart.map(cartItem => {
      const item = menuItems.find(m => m._id.toString() === cartItem.itemId);
      return {
        ...item._doc,
        quantity: cartItem.quantity
      };
    });

    res.render('cart', { cartItems }); // Render cart page with item details
  } catch (err) {
    console.log(err); // Log any errors
    res.redirect('/'); // Redirect to home page on error
  }
});

// POST route to add an item to the cart
router.post('/cart/add/:id', async (req, res) => {
  const menuItemId = req.params.id; // Get item ID from URL
  const quantity = parseInt(req.body.quantity) || 1; // Get quantity from form or default to 1

  try {
    const menuItem = await MenuItem.findById(menuItemId); // Find the menu item in DB
    if (!menuItem) return res.redirect('/'); // If not found, redirect

    if (!req.session.cart) req.session.cart = []; // Initialize cart if it doesn't exist

    const existingItem = req.session.cart.find(item => item.itemId === menuItemId); // Check if item already exists

    if (existingItem) {
      existingItem.quantity += quantity; // Increase quantity if already in cart
    } else {
      req.session.cart.push({ itemId: menuItemId, quantity }); // Add new item to cart
    }

    res.redirect('/cart'); // Redirect to cart page
  } catch (err) {
    console.log(err); // Log any errors
    res.redirect('/'); // Redirect to home page on error
  }
});

// POST route to remove an item from the cart
router.post('/cart/remove/:id', (req, res) => {
  const menuItemId = req.params.id; // Get item ID to remove

  if (req.session.cart) {
    req.session.cart = req.session.cart.filter(item => item.itemId !== menuItemId); // Remove item from cart
  }

  res.redirect('/cart'); // Redirect to cart page
});

// POST route to decrease quantity of an item in the cart
router.post('/cart/decrease/:id', (req, res) => {
  const menuItemId = req.params.id; // Get item ID

  const cart = req.session.cart || []; // Get cart from session

  const item = cart.find(i => i.itemId === menuItemId); // Find the item in the cart

  if (item) {
    if (item.quantity > 1) {
      item.quantity -= 1; // Decrease quantity if more than 1
    } else {
      req.session.cart = cart.filter(i => i.itemId !== menuItemId); // Remove item if quantity is 1
    }
  }

  res.redirect('/cart'); // Redirect to cart page
});

module.exports = router; // Export the router
