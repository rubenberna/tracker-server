require("./models/User"); // Mongoose expects to only see this executed one time, so we don't import the file into different locations, but rather create instances of the model
require("./models/Track");
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const trackRoutes = require("./routes/trackRoutes");
const requireAuth = require("./middlewares/requireAuth");

const app = express();

// Middlewares and routes
app.use(bodyParser.json());
app.use(authRoutes);
app.use(trackRoutes);

// Mongoose configuration
const mongoUri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0-spcz3.gcp.mongodb.net/test?retryWrites=true&w=majority`;

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to mongo instance");
});

mongoose.connection.on("error", (err) => {
  console.log("Error connecting to mongo", err);
});

// We're applying the middleware to verify the user is authenticated
app.get("/", requireAuth, (req, res) => {
  res.send(`Your email is ${req.user.email}`);
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
