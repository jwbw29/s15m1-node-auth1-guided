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
    if (user && bcrypt.compareSync(password, user.password)) {
      //start session
      req.session.user = user; // very important line -- this is what signals the express session library to create the session and send the cookie back to the client
      res.json({ message: `Welcome back, ${user.username}` });
    } else {
      next({ status: 401, message: "Invalid credentials" });
    }
  } catch (err) {
    next(err);
  }
});

router.get("/logout", async (req, res, next) => {
  if (req.session.user) {
    //destroy it
    const { username } = req.session.user;
    req.session.destroy((err) => {
      if (err) {
        res.json({
          message:
            "you can checkout any time you like, but you can never leave",
        });
      } else {
        res.set(
          "Set-Cookie",
          "monkey=; SameSite=Strict; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
        ); // this is how you delete a cookie -- you set it to an empty string and set the expiration date to the past
        res.json({ message: `Goodbye, ${username}` });
      }
    });
  } else {
    res.json({ message: "no session" });
  }
});

module.exports = router;
