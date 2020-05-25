const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// pre-save hook, which is going to run before we put it in our database
userSchema.pre("save", function (next) {
  const user = this;
  // only run this if the user modified the password property
  if (!user.isModified("password")) {
    return next();
  }

  // create salt
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    // hash password of the user with the salt
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

// add this method to the user model to compared hashed passwords
userSchema.methods.comparePassword = function (candidatePassword) {
  // the bcrypt library relies a lot on callbacks, which is why we are generating a promise
  const user = this;
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }
      if (!isMatch) {
        return reject(false);
      }
      resolve(true);
    });
  });
};

mongoose.model("User", userSchema);
