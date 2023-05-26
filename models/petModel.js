const mongoose = require("mongoose");

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A pet must have a name"],
  },
  type: {
    type: String,
    enum: { values: ["Dog", "Cat", "Other"] },
    required: [true, "A pet must has a type"],
  },
  adoptionStatus: {
    type: String,
    enum: { values: ["Adopted", "Fostered", "Available"] },
    required: [true, "A pet must has a type"],
  },
  height: {
    type: Number,
    required: [true, "A pet must has a height"],
  },
  weight: {
    type: Number,
    required: [true, "A pet must has a weight"],
  },
  picture: String,
  color: {
    type: String,
    required: [true, "A pet must has a color"],
  },
  bio: String,
  hypoallergnic: Boolean,
  dietery: [String],
  breed: String,
  userLiked: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  createAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

const Pet = mongoose.model("Pet", petSchema);

module.exports = Pet;
