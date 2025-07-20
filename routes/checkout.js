const express = require('express');
const router = express.Router();
const customerDetail = require('../models/Customer');
const cart = require('../routes/cart');
const userModel = require('../models/User');
const isLoggedIn = require('../middleware/isLoggedIn')
// Show checkout form

router.post("/checkout", isLoggedIn, async (req, res) => {
  const user = await userModel.findOne({ username: req.session.passport.user })
  const grandTotal = req.body.total;
  res.render("checkout", { grandTotal, user, page: "checkout" });
});


router.post("/checkout-add", async (req, res) => {
  try {
    const { customername, customerphone, seatnumber, amount } = req.body;
    const user = await userModel.findOne({ username: req.session.passport.user });

    const newCustomer = new customerDetail({
      username: user.username,
      customername,
      customerphone,
      seatnumber,
      amount
    });

    // Get cart from session
    const cart = req.session.cart;

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).send("Cart is empty");
    }

    // Save order with both customer and cart
    newCustomer.cart = {
      items: cart.items,
      totalQty: cart.totalQty,
      totalPrice: cart.totalPrice
    };

    // Clear cart after checkout
    req.session.cart = null;


    await newCustomer.save();




    res.redirect('/thank-you');
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving customer data");
  }
});

router.get("/thank-you", async (req, res) => {
  res.render("thank-you");
});


// GET all customer orders

// router.get("/orders", async (req, res) => {
//   const allCustomers = await customerDetail.find({});
//     const user = await userModel.findOne({ username: req.session.passport.user });

//   const customers = allCustomers.filter(c => c.cart && c.cart.items.length > 0);

//   res.render("customerorder", { customers });

// });
router.get("/orders", isLoggedIn, async (req, res) => {
  const user = await userModel.findOne({ username: req.session.passport.user });

  let customers;

  if (user.role === "admin") {
    const allCustomers = await customerDetail.find({});
    customers = allCustomers.filter(c => c.cart && c.cart.items.length > 0);
  } else {
    customers = await customerDetail.find({
      username: user.username,
      "cart.items.0": { $exists: true } // ensures cart is not empty
    });
  }

  res.render("customerorder", { customers });
});


// DELETE a customer order
router.post("/orders/delete/:id", async (req, res) => {
  try {
    await customerDetail.findByIdAndUpdate(req.params.id, {
      $set: {
        cart: {
          items: [],
          totalQty: 0,
          totalPrice: 0
        }
      }
    });
    res.redirect("/orders");
  } catch (err) {
    console.error("Error clearing cart:", err);
    res.status(500).send("Internal Server Error");
  }
});



module.exports = router;
