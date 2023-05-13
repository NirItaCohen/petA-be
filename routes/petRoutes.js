const express = require('express');
const petController = require('../controllers/petController');

const router = express.Router();

router
  .route('/')
  .get(petController.getAllPets)
  .post(petController.createPet);

router
  .route('/:id')
  .get(petController.getPet)
  .patch(petController.updatePet)
  .delete(petController.deletePet);

// QEURY ROUTE
// router.route('/serch').post()

module.exports = router;
