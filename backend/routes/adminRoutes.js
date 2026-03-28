const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const admin = require("../middleware/admin"); // ✅ FIX
const Project = require("../models/Project");

/* =========================
   ADMIN DASHBOARD STATS
========================= */
router.get("/stats", auth, admin, async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const ongoingProjects = await Project.countDocuments({
      status: "ongoing",
    });

    res.json({
      totalProjects,
      ongoingProjects,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
