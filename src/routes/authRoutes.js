const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = mongoose.model("User");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = new User({ email, password });
    await user.save();
    const token = jwt.sign({ userId: user._id }, "MY_SECRET_KEY");
    res.send({ token });
  } catch (error) {
    res.status(422).send(error.message);
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  // no email or password given
  if (!email || !password) {
    return res.status(422).send({ error: "Must provide email and password" });
  }

  // we don't have a user with that email address
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(422).send({ error: "Invalid password or email" });
  }

  // compare hashed passwords
  try {
    // method from User model
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, "MY_SECRET_KEY");
    res.send({ token });

    // the comparePassword method returns a promise. Ifrejected, we catch it here
  } catch (error) {
    return res.status(422).send({ error: "Invalid password or email" });
  }
});

module.exports = router;
