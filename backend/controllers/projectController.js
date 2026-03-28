const express = require("express");
const router = express.Router();

const Project = require("../models/Project");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const upload = require("../config/multerProject");

/* =================================
   ADD PROJECT (ADMIN ONLY)
================================= */
router.post(
  "/",
  auth,
  admin,
  upload.fields([
    { name: "photos", maxCount: 10 },
    { name: "coverImage", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      console.log("REQ BODY:", req.body);
      console.log("REQ FILES:", req.files);

      const photos = req.files?.photos?.map(file => file.filename) || [];
      const coverImage = req.files?.coverImage?.[0]?.filename || "";

      let videos = [];
      try {
        videos = JSON.parse(req.body.videos || "[]");
      } catch (err) {
        videos = [];
      }

      // ✅ FIXED: Save selected status properly
      const status = (req.body.status || "ongoing")
        .toString()
        .trim()
        .toLowerCase();

      const project = await Project.create({
        title: req.body.title,
        site: req.body.site,
        address: req.body.address,
        description: req.body.description,
        updates: req.body.updates,
        status, // ✅ IMPORTANT
        coverImage,
        photos,
        videos,
        mapUrl: req.body.mapUrl,
        createdBy: req.user.id,
      });

      res.status(201).json(project);
    } catch (err) {
      console.error("ADD PROJECT ERROR:", err);
      res.status(500).json({ message: err.message });
    }
  }
);

/* =================================
   GET ALL PROJECTS
================================= */
router.get("/", async (req, res) => {
  try {
    const { search, status } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { site: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      filter.status = status.toString().trim().toLowerCase();
    }

    const projects = await Project.find(filter).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error("GET PROJECTS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

/* =================================
   GET SINGLE PROJECT
================================= */
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (err) {
    console.error("GET SINGLE PROJECT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

/* =================================
   UPDATE PROJECT (ADMIN ONLY)
================================= */
router.put(
  "/:id",
  auth,
  admin,
  upload.fields([
    { name: "photos", maxCount: 10 },
    { name: "coverImage", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const existingProject = await Project.findById(req.params.id);

      if (!existingProject) {
        return res.status(404).json({ message: "Project not found" });
      }

      const photos = req.files?.photos?.map(file => file.filename) || existingProject.photos;
      const coverImage = req.files?.coverImage?.[0]?.filename || existingProject.coverImage;

      let videos = existingProject.videos;
      if (req.body.videos) {
        try {
          videos = JSON.parse(req.body.videos);
        } catch (err) {
          videos = existingProject.videos;
        }
      }

      const status = (req.body.status || existingProject.status || "ongoing")
        .toString()
        .trim()
        .toLowerCase();

      const updatedProject = await Project.findByIdAndUpdate(
        req.params.id,
        {
          title: req.body.title,
          site: req.body.site,
          address: req.body.address,
          description: req.body.description,
          updates: req.body.updates,
          status, // ✅ IMPORTANT
          coverImage,
          photos,
          videos,
          mapUrl: req.body.mapUrl,
        },
        { new: true }
      );

      res.json(updatedProject);
    } catch (err) {
      console.error("UPDATE PROJECT ERROR:", err);
      res.status(500).json({ message: err.message });
    }
  }
);

/* =================================
   DELETE PROJECT (ADMIN ONLY)
================================= */
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("DELETE PROJECT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;