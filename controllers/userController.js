const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (user) {
    res.status(200).json({
      status: "Success",
      data: {
        user,
      },
    });
  } else {
    return next(new AppError("No user found with that ID", 404));
  }
});

exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (user) {
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } else {
    return next(new AppError("No user found with that ID", 404));
  }
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (user) {
    res.status(204).json({
      status: "success",
      data: null,
    });
  } else {
    return next(new AppError("No user found with that ID", 404));
  }
});
