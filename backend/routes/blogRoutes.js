const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

const auth = require("../middleware/auth");
const role = require("../middleware/role");
const upload = require("../middleware/multer");
const ctrl = require("../controllers/blogController");

/* =========================================================
   ENSURE UPLOAD DIRECTORIES EXIST (CRITICAL FIX)
========================================================= */
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

ensureDir(path.join(__dirname, "../uploads/blogs"));
ensureDir(path.join(__dirname, "../uploads/videos"));
ensureDir(path.join(__dirname, "../uploads/songs"));

/* ================= PUBLIC ================= */
router.get("/", ctrl.getBlogs);

/* ================= USER ACTIONS ================= */
router.post("/:id/like", auth, ctrl.likeBlog);
router.post("/:id/dislike", auth, ctrl.dislikeBlog);
router.post("/:id/comment", auth, ctrl.commentBlog);

/* ================= ADMIN / SUPERVISOR ================= */
router.post(
  "/",
  auth,
  role("admin", "supervisor"),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "song", maxCount: 1 }
  ]),
  ctrl.createBlog
);

router.put(
  "/:id",
  auth,
  role("admin", "supervisor"),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "song", maxCount: 1 }
  ]),
  ctrl.updateBlog
);

/* ================= ADMIN ONLY ================= */
router.delete("/:id", auth, role("admin"), ctrl.deleteBlog);

router.delete(
  "/:blogId/comment/:commentId",
  auth,
  role("admin", "supervisor"),
  ctrl.deleteComment
);

module.exports = router;
