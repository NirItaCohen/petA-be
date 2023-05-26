const express = require("express");
const petController = require("../controllers/petController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(petController.getAllPets)
  .post(
    authController.protect,
    authController.restrictToAdmin,
    petController.createPet
  );

router
  .route("/:id")
  .get(petController.getPet)
  .patch(authController.protect, petController.updatePet)
  .delete(
    authController.protect,
    authController.restrictToAdmin,
    petController.deletePet
  );

module.exports = router;
