const mongoose = require("mongoose");

const Comments = mongoose.model(
  "Comments",
  new mongoose.Schema({
    colorId: String,
    comment: String,
    commentedBy: String
  })
);

module.exports = Comments;
