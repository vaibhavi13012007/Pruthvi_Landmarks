const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

/* ======================
   REGISTER
====================== */
exports.register = async (req, res) => {
  try {
    const { name, email, mobile, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      role: "user" // default
    });

    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================
   LOGIN
====================== */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ IMPORTANT FIX
    res.json({
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    photo: user.photo || null
  }
});

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login error" });
  }
};

/* ======================
   SOCIAL LOGIN
====================== */
exports.socialLogin = (req, res) => {
  const token = jwt.sign(
    { id: req.user._id, role: req.user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.redirect(
    `http://127.0.0.1:5500/frontend/login.html?token=${token}`
  );
};

/* ======================
   GET LOGGED-IN USER
====================== */
exports.getMe = async (req, res) => {
  try {
    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      photo: req.user.photo || ""
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
