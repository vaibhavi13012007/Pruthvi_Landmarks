const router = require("express").Router();
const auth = require("../middleware/auth");
const supervisor = require("../middleware/supervisor");
const upload = require("../middleware/multer");
const Blog = require("../models/Blog");

/* =====================
   GET ALL BLOGS (Dashboard)
===================== */
router.get("/", auth, supervisor, async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch {
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
});

/* =====================
   ADD BLOG
===================== */
router.post(
  "/",
  auth,
  supervisor,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "song", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const blog = await Blog.create({
        title: req.body.title,
        content: req.body.content,
        caption: req.body.caption,
        map: req.body.map,
        category: req.body.category,
        videoUrl: req.body.videoUrl || "",

        image: req.files?.image?.[0]?.filename || "",
        video: req.files?.video?.[0]?.filename || "",
        song: req.files?.song?.[0]?.filename || "",

        createdBy: req.user._id
      });

      res.status(201).json(blog);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Blog creation failed" });
    }
  }
);

/* =====================
   UPDATE BLOG
===================== */
router.put(
  "/:id",
  auth,
  supervisor,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "song", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id);
      if (!blog) return res.status(404).json({ message: "Blog not found" });

      blog.title = req.body.title ?? blog.title;
      blog.content = req.body.content ?? blog.content;
      blog.caption = req.body.caption ?? blog.caption;
      blog.map = req.body.map ?? blog.map;
      blog.category = req.body.category ?? blog.category;
      blog.videoUrl = req.body.videoUrl ?? blog.videoUrl;

      if (req.files?.image) blog.image = req.files.image[0].filename;
      if (req.files?.video) blog.video = req.files.video[0].filename;
      if (req.files?.song) blog.song = req.files.song[0].filename;

      await blog.save();
      res.json(blog);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Update failed" });
    }
  }
);

/* =====================
   DELETE BLOG
===================== */
router.delete("/:id", auth, supervisor, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog deleted" });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
