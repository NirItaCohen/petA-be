const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const catchAsync = require("../utils/catchAsync");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    requiered: [true, "A user must have a first name"],
  },
  lastName: {
    type: String,
    trim: true,
    requiered: [true, "A user must have a last name"],
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
    enum: ["regularUser", "admin"],
    default: "regularUser",
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
  },
  passwordChangedAt: Date,
  phone: Number,
  petsAdopted: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pet" }],
  },

  petsFostered: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pet" }],
  },
  petsLiked: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pet" }],
  },

  createAtt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.chngedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestampAt = +(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestampAt;
  }
  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
