const express = require('express');
const router = express.Router();
const customerDetail = require('../models/Customer'); 
const userModel = require('../models/User'); 
const isLoggedIn = require('../middleware/isLoggedIn') 
// Show checkout form
 router.post("/checkout",isLoggedIn,async (req, res) => {
  const user = await userModel.findOne({ username: req.session.passport.user })
  const grandTotal = req.body.total;
  res.render("checkout", { grandTotal ,user});
});

router.post("/checkout-add", async (req, res) => {
  try {
    const { customername, customerphone, seatnumber, amount } = req.body;
    const newCustomer = new customerDetail({
      customername,
      customerphone,
      seatnumber,
      amount
    });

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





module.exports = router;
