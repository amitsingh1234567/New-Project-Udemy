const express = require('express');
const router = express.Router();

const CarsController = require('../controllers/cars');
const {validateBody, validateParam, schemas}= require('../helpers/routeHelpers');

router.get('/', CarsController.index);
router.post('/',validateBody(schemas.carSchema), CarsController.newCar);
router.get('/:carId',validateParam(schemas.idSchema, 'carId'), CarsController.getCar);
router.put('/:carId',validateParam(schemas.idSchema, 'carId'), validateBody(schemas.putcarSchema), CarsController.replaceCar)
router.patch('/:carId',validateParam(schemas.idSchema, 'carId'), validateBody(schemas.patchCarSchema), CarsController.updateCar)
router.delete('/:carId',validateParam(schemas.idSchema, 'carId'), CarsController.deleteCar)

module.exports = router;

