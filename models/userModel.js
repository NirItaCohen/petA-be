const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    requiered: [true, "A user must have a name"],
  },
  email: {
    type: String,
    unique: true,
    requiered: [true, "A user must have a name"],
    lowercase: true,
    validate: [validator.isEmail, "The email address is not allowed"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    requiered: [true, "A user must have a password"],
    minLength: [4, "A password must contain at least 4 charcthers"],
    maxLength: [10, "A password can contain maximum of 10 charcthers"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    requiered: [true, "A user must have a password"],
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: "Password must match",
    },
    // select: false ???
  },
  pets: {
    type: [String],
  },
  createAtt: {
    type: Date,
    default: Date.now(),
    select: false
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
