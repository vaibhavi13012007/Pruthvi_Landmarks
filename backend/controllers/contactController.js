const Contact = require("../models/Contact");

exports.sendMessage = async (req, res) => {
  try {
    const { name, email, subject, rating, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields required" });
    }

    console.log("📩 Contact message:", {
      name,
      email,
      subject,
      rating,
      message
    });

    // 🔥 SAVE TO DATABASE
    const newContact = new Contact({
      name,
      email,
      subject,
      rating,
      message
    });

    await newContact.save();

    res.status(201).json({
      success: true,
      message: "Message sent successfully"
    });
  } catch (error) {
    console.error("❌ Error saving contact:", error);
    res.status(500).json({ message: "Server error" });
  }
};
