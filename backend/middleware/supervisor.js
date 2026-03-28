module.exports = (req, res, next) => {
  if (!req.user || req.user.role !== "supervisor") {
    return res.status(403).json({ message: "Supervisor access only" });
  }
  next();
};
