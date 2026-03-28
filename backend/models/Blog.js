const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: String,
  caption: String,

  image: String,      // image filename or URL
  video: String,      // video filename or URL
  map: String,        // Google map embed link
category: String,
song: String,
videoUrl: String,
views: { type: Number, default: 0 },
likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
comments: [{
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: String,
  createdAt: { type: Date, default: Date.now }
}]
,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  views: { type: Number, default: 0 },

  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

}, { timestamps: true });

module.exports = mongoose.model("Blog", blogSchema);
