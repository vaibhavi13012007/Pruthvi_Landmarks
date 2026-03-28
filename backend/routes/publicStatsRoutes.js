const router = require("express").Router();
const Project = require("../models/Project");

router.get("/", async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const ongoingProjects = await Project.countDocuments({ status: "ongoing" });

    res.json({
      projectsCompleted: totalProjects,
      ongoingProjects,
      yearsExperience: 13,
      happyClients: 100
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load stats" });
  }
});

module.exports = router;
