const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/Restaurant_Management_App");

const userSchema = mongoose.Schema({
  username: String,
  email: String,
  restaurantname: String,
  ownername: String,
  menus: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }],



});

userSchema.plugin(plm);

module.exports = mongoose.model("User", userSchema);
