const Pet = require("../models/petModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllPets = catchAsync(async (req, res, next) => {
  const pets = await Pet.find();
  res.status(200).json({
    status: "success",
    resluts: pets.length,
    data: {
      pets,
    },
  });
});

exports.getPet = catchAsync(async (req, res, next) => {
  const pet = await Pet.findById(req.params.id);
  if (pet) {
    res.status(200).json({
      status: "success",
      data: {
        pet,
      },
    });
  } else {
    return next(new AppError("No pet found with that ID", 404));
  }
});

exports.createPet = catchAsync(async (req, res, next) => {
  const newPet = await Pet.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      pet: newPet,
    },
  });
});

exports.updatePet = catchAsync(async (req, res, next) => {
  const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (pet) {
    res.status(200).json({
      status: "success",
      data: {
        pet,
      },
    });
  } else {
    return next(new AppError("No pet found with that ID", 404));
  }
});

exports.deletePet = catchAsync(async (req, res, next) => {
  const pet = await Pet.findByIdAndDelete(req.params.id);
  if (pet) {
    res.status(204).json({
      status: "success",
      data: null,
    });
  } else {
    return next(new AppError("No user found with that ID", 404));
  }
});

exports.likeUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.userid);
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }
  const pet = await Pet.findByIdAndUpdate(
    req.params.petid,
    { $push: { userLiked: req.params.userid } },
    {
      new: true,
    }
  );
  const updateUser = await User.findByIdAndUpdate(req.params.userid, {
    $push: { petsLiked: req.params.petid },
  });
  if (pet) {
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } else {
    return next(new AppError("No pet found with that ID", 404));
  }
});

exports.unLikeUser = catchAsync(async (req, res, next) => {
  const pet = await User.findByIdAndUpdate(
    req.params.petid,
    { $pull: { userLiked: req.params.userid } },
    {
      new: true,
    }
  );
  const updateUser = await Pet.findByIdAndUpdate(
    req.params.userid,
    { $pull: { petsLiked: req.params.petid } },
    {
      new: true,
    }
  );
  if (pet) {
    res.status(200).json({
      status: "success",
      data: {
        pet,
      },
    });
  } else {
    return next(new AppError("No pet found with that ID", 404));
  }
});
