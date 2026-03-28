const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    mobile: { type: String },

    password: { type: String },

    googleId: String,
    facebookId: String,

    role: {
      type: String,
      default: "user",
    },

    photo: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
