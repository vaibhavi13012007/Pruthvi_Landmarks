db.users.updateOne(
  { email: "admin@gmail.com" },
  { $set: { role: "admin" } }
)
