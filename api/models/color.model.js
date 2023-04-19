const mongoose = require("mongoose");

const Color = mongoose.model(
  "Color",
  new mongoose.Schema({
    colorId: String,
    views: Number
  })
);

module.exports = Color;
