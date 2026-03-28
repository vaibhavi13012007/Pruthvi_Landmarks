const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();

/* ================== ENV CHECK ================== */
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing in environment variables");
  process.exit(1);
}

/* ================== DEBUG LOGS ================== */
console.log("🔍 MONGO_URI exists:", !!MONGO_URI);
console.log(
  "🔍 MONGO_URI preview:",
  MONGO_URI ? MONGO_URI.substring(0, 30) + "..." : "NOT FOUND"
);

/* ================== PASSPORT ================== */
const hasGoogleOAuth =
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET;

if (hasGoogleOAuth) {
  require("./config/passport");
  app.use(passport.initialize());
  console.log("✅ Passport Google OAuth initialized");
} else {
  console.log("⚠️ Google OAuth skipped (missing env vars)");
}

/* ================== MIDDLEWARE ================== */
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================== STATIC FOLDERS ================== */
const uploadsPath = path.join(__dirname, "uploads");
const frontendPath = path.join(__dirname, "../frontend");

// Ensure uploads folder exists
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log("📁 uploads folder created");
}

// Uploaded files
app.use("/uploads", express.static(uploadsPath));

// Frontend files
app.use(express.static(frontendPath));

/* ================== API ROUTES ================== */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/admin/stats", require("./routes/adminStatsRoutes"));
app.use("/api/stats", require("./routes/publicStatsRoutes"));
app.use("/api/supervisor/blogs", require("./routes/supervisorBlogRoutes"));
app.use("/api/blogs", require("./routes/blogRoutes"));

/* ================== FRONTEND ROUTES ================== */
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(frontendPath, "about.html"));
});

app.get("/contact", (req, res) => {
  res.sendFile(path.join(frontendPath, "contact.html"));
});

app.get("/projects", (req, res) => {
  res.sendFile(path.join(frontendPath, "project.html"));
});

app.get("/blogs", (req, res) => {
  res.sendFile(path.join(frontendPath, "blogs.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(frontendPath, "login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(frontendPath, "register.html"));
});

app.get("/profile", (req, res) => {
  res.sendFile(path.join(frontendPath, "profile.html"));
});

app.get("/add-project", (req, res) => {
  res.sendFile(path.join(frontendPath, "add-project.html"));
});

app.get("/project-details", (req, res) => {
  res.sendFile(path.join(frontendPath, "project-details.html"));
});

/* ================== 404 HANDLER ================== */
app.use((req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(404).json({
      success: false,
      error: "API Route Not Found",
    });
  }

  // Frontend fallback
  res.sendFile(path.join(frontendPath, "index.html"));
});

/* ================== GLOBAL ERROR HANDLER ================== */
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack || err.message);

  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.status || 500).json({
      success: false,
      error: err.message || "Internal Server Error",
    });
  }

  res.status(err.status || 500).send("Internal Server Error");
});

/* ================== DATABASE CONNECTION ================== */
mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1);
  });

/* ================== HANDLE PROCESS ERRORS ================== */
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err.message);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err.message);
  process.exit(1);
});