const mongoose = require("mongoose");

// the pointSchema is going to represent one individual recorded point that we're going to collect through a mobile device in the world. It will by default bring all the different properties below
const pointSchema = new mongoose.Schema({
  timestamp: Number,
  coords: {
    latitude: Number,
    longitude: Number,
    altitude: Number,
    accuracy: Number,
    heading: Number,
    speed: Number,
  },
});

const trackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, //userId is a reference to some other object
    ref: "User", // reference to another mongoose model
  },
  name: {
    type: String,
    default: "",
  },
  locations: [pointSchema], // reference to the different objects that are going to be inside of this array
});

mongoose.model("Track", trackSchema);
