const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/Restaurant_Management_App");

const menuItemSchema = new mongoose.Schema({

  menuname: String,
  menucategory: String,
  menudescription: String,
  menuprice: Number,
  menuimage: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('MenuItem', menuItemSchema);
