const express = require("express");
const cors = require("cors");
const passport = require("passport");

require("dotenv").config();
require("./config/passport"); // ✅ load passport strategies

const app = express();

/* =====================
   MIDDLEWARE
===================== */
app.use(cors({
  origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
  credentials: true,
}));

app.use(express.json());
app.use(passport.initialize());
app.use("/uploads", express.static("uploads"));

/* =====================
   ROUTES
===================== */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/admin/stats", require("./routes/adminStatsRoutes"));

module.exports = app;
