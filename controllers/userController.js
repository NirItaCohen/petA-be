const User = require("../models/userModel");
const Pet = require("../models/petModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const filterObj = (obj, ...allowedFields) => {
  Object.keys.obj.forEach((element) => {
    if (allowedFields.includes(element)) {
      newObj[element] = obj[element];
    }
  });
};
const writePetStatusToDB = async (status, req) => {
  const updatePet = await Pet.findByIdAndUpdate(req.params.petid, {
    $set: { adoptionStatus: status },
  });
};
const successResponseReturnUser = (user, res) => {
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
};
const unLikeFunction = async (req) => {
  const user = await User.findByIdAndUpdate(
    req.params.userid,
    { $pull: { petsLiked: req.params.petid } },
    {
      new: true,
    }
  );
  const updatePet = await Pet.findByIdAndUpdate(
    req.params.petid,
    { $pull: { userLiked: req.params.userid } },
    {
      new: true,
    }
  );
  return user;
};
// Admin but not only - can be used when check who foster/adopt pet
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
// Admin but not only - can be used when check who foster/adopt pet

// can be used also when rendering my pets page
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

// Check if need to be canceled
exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

// Admin only
exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (user) {
    successResponseReturnUser(user, res);
  }
});

// Admin only
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

exports.likePet = catchAsync(async (req, res, next) => {
  const pet = await Pet.findById(req.params.petid);
  if (!pet) {
    return next(new AppError("No pet found with that ID", 404));
  }
  const user = await User.findByIdAndUpdate(
    req.params.userid,
    { $push: { petsLiked: req.params.petid } },
    {
      new: true,
    }
  );
  const updatePet = await Pet.findByIdAndUpdate(req.params.petid, {
    $push: { userLiked: req.params.userid },
  });
  successResponseReturnUser(user, res);
});

exports.unLikePet = catchAsync(async (req, res, next) => {
  const user = unLikeFunction(req);
  successResponseReturnUser(user, res);
});

// Admin and user
exports.addAdoptPetToUser = catchAsync(async (req, res, next) => {
  const pet = await Pet.findById(req.params.petid);
  if (!pet) {
    return next(new AppError("No pet found with that ID", 404));
  }
  if (pet.adoptionStatus !== "Available") {
    return next(
      new AppError(
        `${pet.name} is not available to adopt. if you foster it, return first and then adopt.`
      )
    );
  }
  const user = await User.findByIdAndUpdate(
    req.params.userid,
    { $push: { petsAdopted: req.params.petid } },
    {
      new: true,
      runValidators: true,
    }
  );
  writePetStatusToDB("Adopted", req);
  successResponseReturnUser(user, res);
  unLikeFunction(req);
});

// Admin and user
exports.addFosterPetToUser = catchAsync(async (req, res, next) => {
  const pet = await Pet.findById(req.params.petid);
  if (!pet) {
    return next(new AppError("No pet found with that ID", 404));
  }
  if (pet.adoptionStatus !== "Available") {
    return next(new AppError(`${pet.name} is not avaliable to foster.`));
  }
  const user = await User.findByIdAndUpdate(
    req.params.userid,
    { $push: { petsFostered: req.params.petid } },
    {
      new: true,
      runValidators: true,
    }
  );
  writePetStatusToDB("Foster", req);
  successResponseReturnUser(user, res);
  unLikeFunction(req);
});

// Admin and user
exports.returnFromFoster = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.userid,
    { $pull: { petsFostered: req.params.petid } },
    {
      new: true,
      runValidators: true,
    }
  );
  writePetStatusToDB("Available", req);
  if (user) {
    res.status(200).json({
      status: "success",
      data: null,
    });
  } else {
    return next(new AppError("No user found with that ID", 404));
  }
});

// Admin and user
exports.returnFromAdopt = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.userid,
    { $pull: { petsAdopted: req.params.petid } },
    {
      new: true,
      runValidators: true,
    }
  );
  writePetStatusToDB("Available", req);
  if (user) {
    res.status(200).json({
      status: "success",
      data: null,
    });
  } else {
    return next(new AppError("No user found with that ID", 404));
  }
});

// User
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        "This route is not for passwords updates. Please use /updateMyPassword ",
        400
      )
    );
  }
  const filteredBody = filterObj(req.body, firstName, lastName, email);
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  createAndSendToken(updatedUser, 200, res);
});
