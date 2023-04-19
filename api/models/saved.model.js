const mongoose = require("mongoose");

const Saved = mongoose.model(
  "Saved",
  new mongoose.Schema({
    colorId: String,
    savedBy: String
  })
);

module.exports = Saved;
