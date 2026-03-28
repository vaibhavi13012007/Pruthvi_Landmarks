const mongoose = require("mongoose");

const resetSchema = new mongoose.Schema({
  email: String,
  token: String,
  expiresAt: Date
});

module.exports = mongoose.model("ResetToken", resetSchema);
