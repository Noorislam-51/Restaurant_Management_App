const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/Restaurant_Management_App");

const menuItemSchema = new mongoose.Schema({
  menuname: String,
  menucategory: String,
  menudescription: String,
  menuprice: Number,
  menuimage: String,
});


module.exports = mongoose.model('MenuItem', menuItemSchema);
