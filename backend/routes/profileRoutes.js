const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const multer = require("multer");

/* Multer Config */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

/* GET PROFILE */
router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

/* UPDATE PROFILE + PHOTO */
router.put("/", auth, upload.single("photo"), async (req, res) => {
  const updateData = {
    name: req.body.name
  };

  if (req.file) {
    updateData.photo = req.file.filename;
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    updateData,
    { new: true }
  ).select("-password");

  res.json(updatedUser);
});

module.exports = router;
