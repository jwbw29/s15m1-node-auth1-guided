const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../users/users-model.js");

router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const hash = bcrypt.hashSync(password, 8); // this actually means 2^8
    const newUser = { username, password: hash };
    const result = await User.add(newUser);
    res.status(201).json({ message: `Welcome, ${result.username}` });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const [user] = await User.findBy({ username });
    console.log(user);
  } catch (err) {
    next(err);
  }
});

router.get("/logout", async (req, res, next) => {
  res.json({ message: "logout working" });
});

module.exports = router;
