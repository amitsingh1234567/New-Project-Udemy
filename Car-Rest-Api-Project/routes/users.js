const express = require('express');
const router = express();

//Bring All Controllers
const UserControllers = require('../controllers/users'); 
const { validateParam, validateBody, schemas } = require('../helpers/routeHelpers')

// router.route('/')
// .get(UserControllers.user)
// .post()

router.get('/', UserControllers.index);

router.post('/', validateBody(schemas.userSchema), UserControllers.newUser);

router.get('/:userId', validateParam(schemas.idSchema, 'userId'), UserControllers.getUser);

router.put('/:userId',[validateParam(schemas.idSchema, 'userId'),validateBody(schemas.userSchema)], UserControllers.replaceUser);

router.patch('/:userId',[validateParam(schemas.idSchema, 'userId'),validateBody(schemas.userOptionalSchema)], UserControllers.updateUser);

router.get('/:userId/cars',validateParam(schemas.idSchema, 'userId'), UserControllers.getUserCars);

router.post('/:userId/cars',validateParam(schemas.idSchema, 'userId'),validateBody(schemas.userCarSchema), UserControllers.newUserCar);


module.exports = router;
