const User = require('../models/user');
const Car= require('../models/car');
const path = require('path');
const Joi = require('joi');

// const idSchema = Joi.object().keys({
//     userId:Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
// })

module.exports = {
    //Validation: DONE
    index:async (req, res, next) => {
        try{
            const users = await User.find({})
            res.status(200).json(users);

        }catch(err){
            console.log(err)
        } 
    },
    //Validation: DONE
    newUser:async (req, res, next) => {
        
        const newUser = new User(req.value.body)
        try{
        const user = await newUser.save()
            res.status(201).json(user);
        }catch(err){
            console.log('got error in saving user ' +err)
        }
    },
    //Validation: DONE
    getUser:async (req, res, next) => { 

       const { userId } = req.value.params;    
        try{
             const user = await User.findById(userId)
             res.status(200).json(user);
        }catch(err){
            console.log('Problem in fetching user data by id ' + err)
        }
    },
    //validation: DONE
    replaceUser: async (req, res, next) => {
        //Enforce that req.body must contain all the fields
        const {userId} = req.value.params;
        const replaceValue = {};
        const {firstName, lastName, email} = req.value.body;
        replaceValue.firstName = firstName;
        replaceValue.lastName = lastName;
        replaceValue.email = email;        

        try{
       const updateData = await User.findByIdAndUpdate(userId, {$set:replaceValue}, {new: true})
                res.status(200).json(updateData)
            
        }catch(err){
            console.log(err)
        }

    },
    //validation: DONE
    updateUser: async (req, res, next) => {
        //req.body may contain any number of fields
        const {userId} = req.value.params;
        const replaceValue = req.value.body;    
               
        try{
       const updateData = await User.findByIdAndUpdate(userId, {$set:replaceValue}, {new: true})
                res.status(200).json(updateData)
        }catch(err){
            console.log(err)
        }
    },
    //validation: DONE
    getUserCars: async (req, res, next) => {
        const {userId} = req.value.params;
        try{
        const user = await User.findById(userId).populate('cars')
        res.json(user.cars)
        }catch(err){
            console.log(err)
        }
    },
    //validation: DONE
    newUserCar: async (req, res, next) => {
        
       const {userId} = req.value.params;
       //Create a new car
       const newCar = new Car(req.value.body);
       //Get user
       const user = await User.findById(userId)
      
       //Assign user as a Car's seller
       newCar.seller = user._id;
       //Save the Car
       try{  
          const carData = await newCar.save()
        
       }catch(err){
           console.log(err)
       }
       //Add car to the user's selling array 'cars'
       user.cars.push(newCar._id)
       //Save the user
       try{
             await user.save()
             res.status(200).json(newCar);
       }catch(err){
           console.log(err)
       }
    }
};

/* 
    We can intract with mongoose in 3 different ways:

    1) Callbacks
    2) Promises
    3) Async / Await (Promises)

*/