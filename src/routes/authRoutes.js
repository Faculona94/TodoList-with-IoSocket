const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user");

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      return res.redirect("/register?error=usernameexists");
    }

    const user = new User({ username, password });
    await user.save();

    return res.status(200).send("Registration successful");
  } catch {
    return res.status(500).send("Error during registration");
  }
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  if (req.user) {
    res.json({ success: true, message: 'Authenticated' });
  } else {
    res.status(401).json({ success: false, message: 'Incorrect credentials' });
  }
});

module.exports = router;
