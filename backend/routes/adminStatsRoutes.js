const router = require("express").Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const Project = require("../models/Project");

router.get("/", auth, admin, async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const ongoingProjects = await Project.countDocuments({ status: "ongoing" });

    res.json({
      totalProjects,
      ongoingProjects
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
