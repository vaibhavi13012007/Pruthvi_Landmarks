const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    site: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    updates: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["ongoing", "completed", "upcoming"],
      default: "ongoing",
      lowercase: true,
      trim: true,
    },

    mapUrl: {
      type: String,
      default: "",
    },

    coverImage: {
      type: String,
      default: "",
    },

    photos: {
      type: [String],
      default: [],
    },

    videos: {
      type: [String],
      default: [],
    },

    location: {
      lat: {
        type: Number,
        default: null,
      },
      lng: {
        type: Number,
        default: null,
      },
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);