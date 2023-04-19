const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.color = require("./color.model");
db.saved = require("./saved.model");
db.comments = require("./comments.model");

module.exports = db;