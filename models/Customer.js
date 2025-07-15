const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/Restaurant_Management_App");

const customerDetailSchema = new mongoose.Schema({

  customername: String,
  customerphone: Number,
  seatnumber: Number,
  amount:Number

});


module.exports = mongoose.model('customerDetail', customerDetailSchema);