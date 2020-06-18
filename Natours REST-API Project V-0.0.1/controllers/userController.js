const User = require('../models/userModel');
const catchAsync = require('../utilities/catchAsync');
const AppError = require('./../utilities/appError');


const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
}

module.exports = {
    getAllUsers: catchAsync(async (req, res, next) => {
        user = await User.find({});

        res.status(201).json({
            status: 'success',
            data:{
                length: user.length,
                user: user
            }
        });  
    }),

    updateMe: catchAsync( async (req, res, next) => {
        // 1) Create error if user POSTs password data
        if(req.body.password || req.body.passwordConfim){
            return next(new AppError('This route is not for password updates. Please use /updateMypassword.', 400));
        }
       // 2) Filtered out unwanted fields names that are not allowed to be update
        const filterBody = filterObj(req.body, 'name', 'email');
        // 2) Update user document
        const updateUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: {
                updateUser
            }
        });
    }),

    deleteMe: catchAsync (async (req, res, next) => {
        await User.findByIdAndUpdate(req.user.id, {active: false});

        res.status(204).json({
            status: 'success',
            data: null
        });
    }),

    createUser:(req, res, next) => {
        res.status(200).json({message:'Hello from createUserControllers'});
    },

    getUser:(req, res, next) => {
        res.status(200).json({message:'Hello from getUserControllers'});
    },

    updateUser:(req, res, next) => {
        res.status(200).json({message:'Hello from updateUserControllers'});
    },

    deleteUser:(req, res, next) => {
        res.status(200).json({message:'Hello from deleteUserControllers'});
    },



    // checkID:(req, res, next, val) => {
    //     console.log(`Tower id is: ${val}`);
    //     if(req.params.id * 1 > 10){
    //         return res.status(404).json({
    //             message: 'Invalid ID!'
    //         });
    //     }
    //     next();
    // },
};