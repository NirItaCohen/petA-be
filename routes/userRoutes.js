const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signUp);
router.post("/login", authController.login);

router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword
);

router.patch("/updateMe", authController.protect, userController.updateMe);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser); // delete this after connecting signup

router
  .route("/:id")
  .get(userController.getUser)
  .patch(authController.protect, userController.updateUser)
  .delete(
    authController.protect,
    authController.restrictToAdmin,
    userController.deleteUser
  );

// router
//   .route("/:userid/:petid&method=adopt")
//   .post(userController.addAdoptPetToUser)
//   .patch(userController.returnFromAdopt);

// router
//   .route("/:userid/:petid&method=foster")
//   .post(userController.addFosterPetToUser)
//   .patch(userController.returnFromFoster);

// router
//   .route("/:userid/:petid&method=like")
//   .post(userController.likePet)
//   .patch(userController.unLikePet);

router
  .route("/:userid/:petid&method=adopt")
  .post(authController.protect, userController.addAdoptPetToUser)
  .patch(authController.protect, userController.returnFromAdopt);

router
  .route("/:userid/:petid&method=foster")
  .post(authController.protect, userController.addFosterPetToUser)
  .patch(authController.protect, userController.returnFromFoster);

router
  .route("/:userid/:petid&method=like")
  .post(authController.protect, userController.likePet)
  .patch(authController.protect, userController.unLikePet);

module.exports = router;
