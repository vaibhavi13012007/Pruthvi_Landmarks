const Blog = require("../models/Blog");

/* ================= PUBLIC ================= */
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};

/* ================= CREATE BLOG (ADMIN / SUPERVISOR) ================= */
exports.createBlog = async (req, res) => {
  try {
    const { title, caption, category, videoUrl } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const blog = await Blog.create({
      title,
      caption,
      category,

      image: req.files?.image?.[0]?.filename || "",
      video: req.files?.video?.[0]?.filename || videoUrl || "",
      song: req.files?.song?.[0]?.filename || "",

      createdBy: req.user._id
    });

    res.status(201).json(blog);
  } catch (err) {
    console.error("CREATE BLOG ERROR:", err);
    res.status(500).json({ message: "Blog creation failed" });
  }
};

/* ================= UPDATE BLOG ================= */
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    blog.title = req.body.title ?? blog.title;
    blog.caption = req.body.caption ?? blog.caption;
    blog.category = req.body.category ?? blog.category;

    if (req.files?.image) blog.image = req.files.image[0].filename;
    if (req.files?.video) blog.video = req.files.video[0].filename;
    if (req.files?.song) blog.song = req.files.song[0].filename;
    if (req.body.videoUrl) blog.video = req.body.videoUrl;

    await blog.save();
    res.json(blog);
  } catch (err) {
    console.error("UPDATE BLOG ERROR:", err);
    res.status(500).json({ message: "Update failed" });
  }
};

/* ================= DELETE BLOG (ADMIN) ================= */
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    await blog.deleteOne();
    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

/* ================= LIKE ================= */
exports.likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.likes.addToSet(req.user._id);
    blog.dislikes.pull(req.user._id);

    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Like failed" });
  }
};

/* ================= DISLIKE ================= */
exports.dislikeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.dislikes.addToSet(req.user._id);
    blog.likes.pull(req.user._id);

    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Dislike failed" });
  }
};

/* ================= COMMENT ================= */
exports.commentBlog = async (req, res) => {
  try {
    if (!req.body.text) {
      return res.status(400).json({ message: "Comment text required" });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.comments.push({
      user: req.user._id,
      text: req.body.text
    });

    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Comment failed" });
  }
};

/* ================= DELETE COMMENT (ADMIN / SUPERVISOR) ================= */
exports.deleteComment = async (req, res) => {
  try {
    const { blogId, commentId } = req.params;

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.comments = blog.comments.filter(
      c => c._id.toString() !== commentId
    );

    await blog.save();
    res.json({ message: "Comment removed" });
  } catch (err) {
    res.status(500).json({ message: "Delete comment failed" });
  }
};
